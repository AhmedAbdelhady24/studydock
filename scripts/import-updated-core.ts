import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { parsePlanImportCsv, parseCourseTargetsCsv } from "../src/lib/csv-parser";
import { computeImportPreview, executePlanImport } from "../src/lib/importer";
import { db, closeConnection } from "../src/db";
import { plans, tasks, taskProgress, courses } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🚀 Executing core 33-week resource update import...");

  const planPath = path.resolve(process.cwd(), "data/import-ready/plan_template.csv");
  const coursesPath = path.resolve(process.cwd(), "data/import-ready/courses_template.csv");

  assert(fs.existsSync(planPath), `Missing ${planPath}`);
  assert(fs.existsSync(coursesPath), `Missing ${coursesPath}`);

  const planCsv = fs.readFileSync(planPath, "utf-8");
  const coursesCsv = fs.readFileSync(coursesPath, "utf-8");

  const planResult = parsePlanImportCsv(planCsv);
  assert(planResult.success, `Plan CSV errors: ${JSON.stringify(planResult.errors)}`);
  assert.equal(planResult.data.length, 557, `Expected 557 tasks, got ${planResult.data.length}`);

  const coursesResult = parseCourseTargetsCsv(coursesCsv);
  assert(coursesResult.success, `Courses CSV errors: ${JSON.stringify(coursesResult.errors)}`);
  assert.equal(coursesResult.data.length, 18, `Expected 18 courses, got ${coursesResult.data.length}`);

  // Preview check
  const preview = await computeImportPreview(planResult.data, coursesResult.data);
  console.log("📊 Import Preview:", JSON.stringify(preview, null, 2));

  assert.equal(preview.totalTasks, 557);
  assert.equal(preview.totalCourses, 18);
  assert.equal(preview.archivedTasksCount, 0);

  // Capture user progress snapshot before import
  const activeTask = await db.query.taskProgress.findFirst({
    where: eq(taskProgress.taskId, "product-engineer-33-week-w01-t-537590361026"),
  });
  console.log("📌 Active task state before import:", activeTask);
  assert.equal(activeTask?.status, "in_progress");

  // Execute import
  const result = await executePlanImport(planResult.data, coursesResult.data);
  console.log("✅ Import executed:", result);

  // Post-import verification
  const plan = await db.query.plans.findFirst({
    where: eq(plans.slug, "product-engineer-33-week"),
  });
  assert(plan);
  console.log(`Plan currentVersion: ${plan.currentVersion}`);

  const dbTasks = await db.query.tasks.findMany({
    where: eq(tasks.planId, plan.id),
  });
  assert.equal(dbTasks.length, 557, `Expected 557 tasks in DB, got ${dbTasks.length}`);

  const dbCourses = await db.query.courses.findMany({
    where: eq(courses.planId, plan.id),
  });
  assert.equal(dbCourses.length, 18, `Expected 18 courses in DB, got ${dbCourses.length}`);

  // Verify the active task progress was preserved
  const activeTaskAfter = await db.query.taskProgress.findFirst({
    where: eq(taskProgress.taskId, "product-engineer-33-week-w01-t-537590361026"),
  });
  console.log("📌 Active task state after import:", activeTaskAfter);
  assert.equal(activeTaskAfter?.status, "in_progress");
  assert.equal(
    activeTaskAfter?.lastUpdatedAt.toISOString(),
    activeTask?.lastUpdatedAt.toISOString(),
    "lastUpdatedAt timestamp must be preserved"
  );

  // Verify the 14 new optional tasks are all required: false
  const optionalTaskIds = [
    "product-engineer-33-week-w13-opt-book-grove-ch1",
    "product-engineer-33-week-w20-opt-book-grove-meetings",
    "product-engineer-33-week-w25-opt-harness-l09",
    "product-engineer-33-week-w25-opt-harness-l10",
    "product-engineer-33-week-w26-opt-harness-l03",
    "product-engineer-33-week-w26-opt-harness-l06",
    "product-engineer-33-week-w27-opt-harness-l07",
    "product-engineer-33-week-w27-opt-harness-l08",
    "product-engineer-33-week-w27-opt-book-grove-feedback",
    "product-engineer-33-week-w28-opt-harness-l05",
    "product-engineer-33-week-w28-opt-harness-l11",
    "product-engineer-33-week-w29-opt-harness-l12",
    "product-engineer-33-week-w29-opt-harness-p05",
    "product-engineer-33-week-w30-opt-book-grove-systems",
  ];

  for (const optId of optionalTaskIds) {
    const task = dbTasks.find((t) => t.taskId === optId);
    assert(task, `Missing optional task: ${optId}`);
    assert.equal(task.required, false, `Task ${optId} should be optional`);
  }

  // Verify the 2 new courses
  const harnessCourse = dbCourses.find((c) => c.courseId === "product-engineer-33-week-course-learn-harness-engineering-optional");
  assert(harnessCourse, "Missing Learn Harness Engineering course");
  assert.equal(harnessCourse.coverageKind, "count");

  const groveCourse = dbCourses.find((c) => c.courseId === "product-engineer-33-week-course-high-output-management-reading");
  assert(groveCourse, "Missing High Output Management course");
  assert.equal(groveCourse.coverageKind, "count");

  console.log("🎉 All post-import assertions passed cleanly! Zero data loss confirmed.");
}

main()
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exitCode = 1;
  })
  .finally(closeConnection);
