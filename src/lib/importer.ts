import { db } from "../db";
import {
  plans,
  phases,
  weeks,
  tasks,
  taskProgress,
  courses,
  courseProgress,
  importBatches,
} from "../db/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import { PlanRow, CourseTargetRow, ImportPreviewSummary } from "./types";
import crypto from "crypto";

export async function computeImportPreview(
  planRows: PlanRow[],
  courseRows: CourseTargetRow[]
): Promise<ImportPreviewSummary> {
  if (planRows.length === 0) {
    throw new Error("No plan rows provided for preview.");
  }

  const slug = planRows[0].plan_slug;
  const existingPlan = await db.query.plans.findFirst({
    where: eq(plans.slug, slug),
  });

  const incomingTaskIds = new Set(planRows.map((r) => r.task_id));
  const distinctWeeks = new Set(planRows.map((r) => r.week_id));

  let existingTasksCount = 0;
  let newTasksCount = 0;
  let archivedTasksCount = 0;
  const warnings: string[] = [];

  if (existingPlan) {
    const dbTasks = await db.query.tasks.findMany({
      where: and(eq(tasks.planId, existingPlan.id), isNull(tasks.archivedAt)),
    });

    const dbTaskMap = new Map(dbTasks.map((t) => [t.taskId, t]));

    for (const incomingId of incomingTaskIds) {
      if (dbTaskMap.has(incomingId)) {
        existingTasksCount++;
      } else {
        newTasksCount++;
      }
    }

    for (const dbTask of dbTasks) {
      if (!incomingTaskIds.has(dbTask.taskId)) {
        archivedTasksCount++;
        warnings.push(
          `Task '${dbTask.taskId}' (${dbTask.title}) is not in the imported plan and will be archived for review.`
        );
      }
    }
  } else {
    newTasksCount = incomingTaskIds.size;
  }

  return {
    planSlug: slug,
    planTitle: planRows[0].plan_slug.replace(/-/g, " ").toUpperCase(),
    totalWeeks: distinctWeeks.size,
    totalTasks: planRows.length,
    totalCourses: courseRows.length,
    newTasksCount,
    existingTasksCount,
    archivedTasksCount,
    warnings,
  };
}

export async function executePlanImport(
  planRows: PlanRow[],
  courseRows: CourseTargetRow[],
  sourceHash?: string
): Promise<{ success: boolean; planId: number; message: string }> {
  if (planRows.length === 0) {
    throw new Error("Cannot import empty plan.");
  }

  const slug = planRows[0].plan_slug;
  const hash =
    sourceHash ||
    crypto
      .createHash("sha256")
      .update(JSON.stringify(planRows))
      .digest("hex");

  return await db.transaction(async (tx) => {
    // 1. Upsert plan record
    let plan = await tx.query.plans.findFirst({
      where: eq(plans.slug, slug),
    });

    if (!plan) {
      const [newPlan] = await tx
        .insert(plans)
        .values({
          slug,
          title: slug.replace(/-/g, " ").toUpperCase(),
          importedSourceHash: hash,
          currentVersion: 1,
        })
        .returning();
      plan = newPlan;
    } else {
      const [updatedPlan] = await tx
        .update(plans)
        .set({
          importedSourceHash: hash,
          currentVersion: plan.currentVersion + 1,
          updatedAt: new Date(),
        })
        .where(eq(plans.id, plan.id))
        .returning();
      plan = updatedPlan;
    }

    const planId = plan.id;

    // 2. Upsert Phases
    const phasesByCode = new Map<string, { code: string; title: string; order: number }>();
    let phaseOrder = 1;
    for (const row of planRows) {
      if (!phasesByCode.has(row.phase)) {
        phasesByCode.set(row.phase, {
          code: row.phase,
          title: row.phase_title,
          order: phaseOrder++,
        });
      }
    }

    for (const p of phasesByCode.values()) {
      const existingPhase = await tx.query.phases.findFirst({
        where: and(eq(phases.planId, planId), eq(phases.code, p.code)),
      });

      if (!existingPhase) {
        await tx.insert(phases).values({
          planId,
          code: p.code,
          title: p.title,
          displayOrder: p.order,
        });
      } else {
        await tx
          .update(phases)
          .set({ title: p.title, displayOrder: p.order })
          .where(eq(phases.id, existingPhase.id));
      }
    }

    // 3. Upsert Weeks
    const weeksById = new Map<string, PlanRow>();
    for (const row of planRows) {
      if (!weeksById.has(row.week_id)) {
        weeksById.set(row.week_id, row);
      }
    }

    for (const [weekId, w] of weeksById.entries()) {
      const existingWeek = await tx.query.weeks.findFirst({
        where: and(eq(weeks.planId, planId), eq(weeks.weekId, weekId)),
      });

      if (!existingWeek) {
        await tx.insert(weeks).values({
          planId,
          weekId,
          weekNumber: w.week_number,
          phase: w.phase,
          phaseTitle: w.phase_title,
          title: w.week_title,
          targetHours: String(w.target_hours),
          primaryCourses: w.primary_courses,
          concepts: w.concepts,
          exitCriteria: w.exit_criteria,
          sourceAnchor: w.source_anchor,
        });
      } else {
        await tx
          .update(weeks)
          .set({
            weekNumber: w.week_number,
            phase: w.phase,
            phaseTitle: w.phase_title,
            title: w.week_title,
            targetHours: String(w.target_hours),
            primaryCourses: w.primary_courses,
            concepts: w.concepts,
            exitCriteria: w.exit_criteria,
            sourceAnchor: w.source_anchor,
            archivedAt: null, // un-archive if re-imported
          })
          .where(eq(weeks.id, existingWeek.id));
      }
    }

    // 4. Upsert Tasks & Preserve Task Progress
    const incomingTaskIds = new Set(planRows.map((r) => r.task_id));

    // Archive missing tasks
    const existingDbTasks = await tx.query.tasks.findMany({
      where: and(eq(tasks.planId, planId), isNull(tasks.archivedAt)),
    });

    for (const t of existingDbTasks) {
      if (!incomingTaskIds.has(t.taskId)) {
        await tx
          .update(tasks)
          .set({ archivedAt: new Date() })
          .where(eq(tasks.id, t.id));
      }
    }

    for (const row of planRows) {
      const existingTask = await tx.query.tasks.findFirst({
        where: and(eq(tasks.planId, planId), eq(tasks.taskId, row.task_id)),
      });

      if (!existingTask) {
        // Insert task definition
        await tx.insert(tasks).values({
          planId,
          weekId: row.week_id,
          taskId: row.task_id,
          category: row.category,
          title: row.task_title || row.category,
          description: row.description,
          required: row.required,
          sortOrder: row.sort_order,
          dsaTargetCount: row.dsa_target_count,
        });

        // Initialize progress for new task (only applies initial_checked once)
        const existingProgress = await tx.query.taskProgress.findFirst({
          where: eq(taskProgress.taskId, row.task_id),
        });

        if (!existingProgress) {
          await tx.insert(taskProgress).values({
            taskId: row.task_id,
            status: row.initial_checked ? "done" : "not_started",
            completedAt: row.initial_checked ? new Date() : null,
          });
        }
      } else {
        // Update task definition metadata; PRESERVE taskProgress untouched!
        await tx
          .update(tasks)
          .set({
            weekId: row.week_id,
            category: row.category,
            title: row.task_title || row.category,
            description: row.description,
            required: row.required,
            sortOrder: row.sort_order,
            dsaTargetCount: row.dsa_target_count,
            archivedAt: null, // restore if previously archived
          })
          .where(eq(tasks.id, existingTask.id));

        // Ensure progress record exists without overwriting current progress
        const existingProgress = await tx.query.taskProgress.findFirst({
          where: eq(taskProgress.taskId, row.task_id),
        });

        if (!existingProgress) {
          await tx.insert(taskProgress).values({
            taskId: row.task_id,
            status: "not_started",
          });
        }
      }
    }

    // 5. Upsert Courses
    for (const c of courseRows) {
      const existingCourse = await tx.query.courses.findFirst({
        where: and(eq(courses.planId, planId), eq(courses.courseId, c.course_id)),
      });

      if (!existingCourse) {
        await tx.insert(courses).values({
          planId,
          courseId: c.course_id,
          title: c.course_title,
          plannedWeeks: c.planned_weeks,
          coverageKind: c.coverage_kind,
          targetMin: c.target_min !== null ? String(c.target_min) : null,
          targetMax: c.target_max !== null ? String(c.target_max) : null,
          targetUnit: c.target_unit,
          coverageNote: c.coverage_note,
          referenceUrl: c.reference_url,
        });

        // Initialize course progress if not existing
        const existingProgress = await tx.query.courseProgress.findFirst({
          where: eq(courseProgress.courseId, c.course_id),
        });

        if (!existingProgress) {
          await tx.insert(courseProgress).values({
            courseId: c.course_id,
            actualPercent: null,
            minutesStudied: 0,
          });
        }
      } else {
        await tx
          .update(courses)
          .set({
            title: c.course_title,
            plannedWeeks: c.planned_weeks,
            coverageKind: c.coverage_kind,
            targetMin: c.target_min !== null ? String(c.target_min) : null,
            targetMax: c.target_max !== null ? String(c.target_max) : null,
            targetUnit: c.target_unit,
            coverageNote: c.coverage_note,
            referenceUrl: c.reference_url,
          })
          .where(eq(courses.id, existingCourse.id));
      }
    }

    // 6. Record Import Batch
    await tx.insert(importBatches).values({
      planId,
      importHash: hash,
      weeksCount: weeksById.size,
      tasksCount: planRows.length,
      coursesCount: courseRows.length,
      summary: `Imported ${weeksById.size} weeks, ${planRows.length} tasks, ${courseRows.length} course targets.`,
    });

    return {
      success: true,
      planId,
      message: `Successfully imported ${weeksById.size} weeks, ${planRows.length} tasks, and ${courseRows.length} course targets.`,
    };
  });
}
