import { NextRequest, NextResponse } from "next/server";
import {
  exportPlanAsCsv,
  exportCoursesAsCsv,
  exportFullPlanAsJson,
} from "@/lib/exporter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "plan-csv";
    const planSlug = searchParams.get("slug") || undefined;

    if (format === "json") {
      const jsonData = await exportFullPlanAsJson(planSlug);
      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="studydock-backup-${new Date().toISOString().split("T")[0]}.json"`,
        },
      });
    }

    if (format === "courses-csv") {
      const csv = await exportCoursesAsCsv(planSlug);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="course_targets_${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // Default: plan-csv
    const csv = await exportPlanAsCsv(planSlug);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="plan_export_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err: any) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate export." },
      { status: 500 }
    );
  }
}
