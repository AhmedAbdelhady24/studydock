import { NextRequest, NextResponse } from "next/server";
import { parsePlanImportCsv, parseCourseTargetsCsv } from "@/lib/csv-parser";
import { executePlanImport } from "@/lib/importer";
import { PlanRow, CourseTargetRow } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let planRows: PlanRow[] = [];
    let courseRows: CourseTargetRow[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const planFile = formData.get("planFile") as File | null;
      const courseFile = formData.get("courseFile") as File | null;

      if (!planFile) {
        return NextResponse.json(
          { success: false, error: "Plan CSV file is required for import." },
          { status: 400 }
        );
      }

      const planCsv = await planFile.text();
      const planParse = parsePlanImportCsv(planCsv);
      if (!planParse.success) {
        return NextResponse.json(
          { success: false, errors: planParse.errors },
          { status: 400 }
        );
      }
      planRows = planParse.data;

      if (courseFile) {
        const courseCsv = await courseFile.text();
        if (courseCsv.trim()) {
          const courseParse = parseCourseTargetsCsv(courseCsv);
          if (!courseParse.success) {
            return NextResponse.json(
              { success: false, errors: courseParse.errors },
              { status: 400 }
            );
          }
          courseRows = courseParse.data;
        }
      }
    } else {
      const body = await request.json();

      if (body.planRows && Array.isArray(body.planRows)) {
        planRows = body.planRows;
        courseRows = body.courseRows || [];
      } else if (body.planCsv) {
        const planParse = parsePlanImportCsv(body.planCsv);
        if (!planParse.success) {
          return NextResponse.json(
            { success: false, errors: planParse.errors },
            { status: 400 }
          );
        }
        planRows = planParse.data;

        if (body.courseCsv && body.courseCsv.trim()) {
          const courseParse = parseCourseTargetsCsv(body.courseCsv);
          if (!courseParse.success) {
            return NextResponse.json(
              { success: false, errors: courseParse.errors },
              { status: 400 }
            );
          }
          courseRows = courseParse.data;
        }
      }
    }

    if (planRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid plan rows to import." },
        { status: 400 }
      );
    }

    const result = await executePlanImport(planRows, courseRows);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Import execute error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute import." },
      { status: 500 }
    );
  }
}
