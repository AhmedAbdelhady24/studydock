import { db } from "../db";
import {
  plans,
  phases,
  weeks,
  tasks,
  taskProgress,
  courses,
  courseProgress,
  checkpointAttestations,
  dsaAttempts,
  studySessions,
} from "../db/schema";
import { eq, isNull, asc } from "drizzle-orm";
import { stringify } from "csv-stringify/sync";

/**
 * Sanitizes cell values to prevent formula injection in Excel/Sheets.
 * If a string begins with =, +, -, @, \t, or \r, prefix with an apostrophe.
 */
export function sanitizeCsvField(value: any): string {
  if (value === null || value === undefined) return "";
  let str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

async function getActivePlan(planSlug?: string) {
  const plan = await db.query.plans.findFirst({
    where: planSlug ? eq(plans.slug, planSlug) : isNull(plans.archivedAt),
  });

  if (!plan) {
    throw new Error("No active plan found to export.");
  }

  return plan;
}

export async function exportPlanAsCsv(planSlug?: string): Promise<string> {
  const plan = await getActivePlan(planSlug);

  const dbWeeks = await db.query.weeks.findMany({
    where: eq(weeks.planId, plan.id),
    orderBy: [asc(weeks.weekNumber)],
  });
  const weekMap = new Map(dbWeeks.map((w) => [w.weekId, w]));

  const dbTasks = await db.query.tasks.findMany({
    where: eq(tasks.planId, plan.id),
    orderBy: [asc(tasks.sortOrder)],
  });

  const dbProgress = await db.query.taskProgress.findMany();
  const progressMap = new Map(dbProgress.map((p) => [p.taskId, p]));

  const records = dbTasks.map((t) => {
    const w = weekMap.get(t.weekId);
    const p = progressMap.get(t.taskId);
    const isChecked = p?.status === "done";

    return {
      plan_slug: sanitizeCsvField(plan.slug),
      week_id: sanitizeCsvField(t.weekId),
      week_number: sanitizeCsvField(w?.weekNumber ?? 1),
      week_title: sanitizeCsvField(w?.title ?? ""),
      phase: sanitizeCsvField(w?.phase ?? ""),
      phase_title: sanitizeCsvField(w?.phaseTitle ?? ""),
      primary_courses: sanitizeCsvField(w?.primaryCourses ?? ""),
      concepts: sanitizeCsvField(w?.concepts ?? ""),
      exit_criteria: sanitizeCsvField(w?.exitCriteria ?? ""),
      target_hours: sanitizeCsvField(w?.targetHours ?? "20"),
      source_anchor: sanitizeCsvField(w?.sourceAnchor ?? ""),
      task_id: sanitizeCsvField(t.taskId),
      category: sanitizeCsvField(t.category),
      task_title: sanitizeCsvField(t.title),
      description: sanitizeCsvField(t.description),
      required: sanitizeCsvField(t.required ? "true" : "false"),
      sort_order: sanitizeCsvField(t.sortOrder),
      dsa_target_count: sanitizeCsvField(t.dsaTargetCount ?? 0),
      initial_checked: isChecked ? "true" : "false",
    };
  });

  return stringify(records, {
    header: true,
    columns: [
      "plan_slug",
      "week_id",
      "week_number",
      "week_title",
      "phase",
      "phase_title",
      "primary_courses",
      "concepts",
      "exit_criteria",
      "target_hours",
      "source_anchor",
      "task_id",
      "category",
      "task_title",
      "description",
      "required",
      "sort_order",
      "dsa_target_count",
      "initial_checked",
    ],
  });
}

export async function exportCoursesAsCsv(planSlug?: string): Promise<string> {
  const plan = await getActivePlan(planSlug);

  const dbCourses = await db.query.courses.findMany({
    where: eq(courses.planId, plan.id),
  });

  const records = dbCourses.map((c) => ({
    plan_slug: sanitizeCsvField(plan.slug),
    course_id: sanitizeCsvField(c.courseId),
    course_title: sanitizeCsvField(c.title),
    planned_weeks: sanitizeCsvField(c.plannedWeeks),
    coverage_kind: sanitizeCsvField(c.coverageKind),
    target_min: sanitizeCsvField(c.targetMin ?? ""),
    target_max: sanitizeCsvField(c.targetMax ?? ""),
    target_unit: sanitizeCsvField(c.targetUnit ?? ""),
    coverage_note: sanitizeCsvField(c.coverageNote ?? ""),
    reference_url: sanitizeCsvField(c.referenceUrl ?? ""),
  }));

  return stringify(records, {
    header: true,
    columns: [
      "plan_slug",
      "course_id",
      "course_title",
      "planned_weeks",
      "coverage_kind",
      "target_min",
      "target_max",
      "target_unit",
      "coverage_note",
      "reference_url",
    ],
  });
}

export async function exportFullPlanAsJson(planSlug?: string) {
  const plan = await getActivePlan(planSlug);

  const [
    dbPhases,
    dbWeeks,
    dbTasks,
    dbProgress,
    dbCheckpoints,
    dbCourses,
    dbCourseProgress,
    dbDsa,
    dbSessions,
  ] = await Promise.all([
    db.query.phases.findMany({ where: eq(phases.planId, plan.id) }),
    db.query.weeks.findMany({ where: eq(weeks.planId, plan.id) }),
    db.query.tasks.findMany({ where: eq(tasks.planId, plan.id) }),
    db.query.taskProgress.findMany(),
    db.query.checkpointAttestations.findMany({ where: eq(checkpointAttestations.planId, plan.id) }),
    db.query.courses.findMany({ where: eq(courses.planId, plan.id) }),
    db.query.courseProgress.findMany(),
    db.query.dsaAttempts.findMany({ where: eq(dsaAttempts.planId, plan.id) }),
    db.query.studySessions.findMany({ where: eq(studySessions.planId, plan.id) }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    plan,
    phases: dbPhases,
    weeks: dbWeeks,
    tasks: dbTasks,
    progress: dbProgress,
    checkpoints: dbCheckpoints,
    courses: dbCourses,
    courseProgress: dbCourseProgress,
    dsaAttempts: dbDsa,
    studySessions: dbSessions,
  };
}
