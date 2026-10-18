import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { plans, weeks, tasks, taskProgress, courses, courseProgress } from "@/db/schema";
import { eq, isNull, asc } from "drizzle-orm";
import { executeSearch } from "@/lib/search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    const plan = await db.query.plans.findFirst({
      where: isNull(plans.archivedAt),
    });

    if (!plan) {
      return NextResponse.json({ query, results: [] });
    }

    const [dbWeeks, dbTasks, dbProgress, dbCourses, dbCourseProg] = await Promise.all([
      db.query.weeks.findMany({
        where: eq(weeks.planId, plan.id),
        orderBy: [asc(weeks.weekNumber)],
      }),
      db.query.tasks.findMany({
        where: eq(tasks.planId, plan.id),
        orderBy: [asc(tasks.sortOrder)],
      }),
      db.query.taskProgress.findMany(),
      db.query.courses.findMany({
        where: eq(courses.planId, plan.id),
      }),
      db.query.courseProgress.findMany(),
    ]);

    const taskProgressMap = new Map(dbProgress.map((p) => [p.taskId, p]));
    const courseProgressMap = new Map(dbCourseProg.map((p) => [p.courseId, p]));

    const results = executeSearch({
      query,
      weeks: dbWeeks,
      tasks: dbTasks,
      taskProgressMap,
      courses: dbCourses,
      courseProgressMap,
      limit: 25,
    });

    return NextResponse.json({
      query,
      results,
    });
  } catch (err: any) {
    console.error("Search API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to execute search" },
      { status: 500 }
    );
  }
}
