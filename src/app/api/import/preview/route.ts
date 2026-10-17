import { NextRequest, NextResponse } from "next/server";
import { parsePlanImportCsv, parseCourseTargetsCsv } from "@/lib/csv-parser";
import { computeImportPreview } from "@/lib/importer";

export async function POST(request: NextRequest) {
  try {
    let planCsv = "";
    let courseCsv = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const planFile = formData.get("planFile") as File | null;
      const courseFile = formData.get("courseFile") as File | null;

      if (planFile) {
        planCsv = await planFile.text();
      }
      if (courseFile) {
        courseCsv = await courseFile.text();
      }
    } else {
      const body = await request.json();
      planCsv = body.planCsv || "";
      courseCsv = body.courseCsv || "";
    }

    if (!planCsv.trim()) {
      return NextResponse.json(
        { success: false, errors: [{ row: 1, column: "file", message: "Plan CSV file is required." }] },
        { status: 400 }
      );
    }

    // 1. Parse plan CSV
    const planParse = parsePlanImportCsv(planCsv);
    if (!planParse.success) {
      return NextResponse.json(
        {
          success: false,
          errors: planParse.errors,
          message: `Plan validation failed with ${planParse.errors.length} error(s).`,
        },
        { status: 400 }
      );
    }

    // 2. Parse course CSV if provided
    let courseRows: any[] = [];
    if (courseCsv.trim()) {
      const courseParse = parseCourseTargetsCsv(courseCsv);
      if (!courseParse.success) {
        return NextResponse.json(
          {
            success: false,
            errors: courseParse.errors,
            message: `Course targets validation failed with ${courseParse.errors.length} error(s).`,
          },
          { status: 400 }
        );
      }
      courseRows = courseParse.data;
    }

    // 3. Compute Preview against existing database state
    const preview = await computeImportPreview(planParse.data, courseRows);

    return NextResponse.json({
      success: true,
      preview,
      planRows: planParse.data,
      courseRows,
    });
  } catch (err: any) {
    console.error("Import preview error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process import preview." },
      { status: 500 }
    );
  }
}
