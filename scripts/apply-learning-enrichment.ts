import fs from "node:fs";
import assert from "node:assert/strict";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db, closeConnection } from "../src/db";
import { plans, tasks, courses } from "../src/db/schema";
import { parseCourseTargetsCsv } from "../src/lib/csv-parser";
import { getLearningMetadata } from "../src/lib/learning-metadata";

async function main() {
  const metadata = getLearningMetadata();
  const courseRows = parseCourseTargetsCsv(fs.readFileSync("public/learning-data/courses_template.csv", "utf8"));
  assert(courseRows.success, JSON.stringify(courseRows.errors));
  assert(courseRows.data.every((row) => row.plan_slug === metadata.planSlug));
  const corrections = z.array(z.object({
    task_id: z.string().min(1), week_number: z.coerce.number().int().positive(),
    current_dsa_target_count: z.literal(""), proposed_dsa_target_count: z.literal("2"),
  })).parse(parse(fs.readFileSync("public/learning-data/dsa_count_metadata_patch_PROPOSAL_ONLY.csv", "utf8"), { columns: true }));
  assert.equal(corrections.length, 5);

  await db.transaction(async (tx) => {
    const plan = await tx.query.plans.findFirst({ where: eq(plans.slug, metadata.planSlug) });
    assert(plan, "Import the plan before applying enrichment");
    for (const row of courseRows.data) {
      const where = and(eq(courses.planId, plan.id), eq(courses.courseId, row.course_id));
      const existing = await tx.query.courses.findFirst({ where });
      assert(existing, `Missing course: ${row.course_id}`);
      await tx.update(courses).set({ coverageNote: row.coverage_note }).where(where);
      const updated = await tx.query.courses.findFirst({ where });
      assert.equal(updated?.coverageNote, row.coverage_note);
    }
    for (const row of corrections) {
      const where = and(eq(tasks.planId, plan.id), eq(tasks.taskId, row.task_id));
      const existing = await tx.query.tasks.findFirst({ where });
      assert(existing && existing.category === "dsa" && !existing.archivedAt, `Missing active DSA task: ${row.task_id}`);
      assert(existing.dsaTargetCount === null || existing.dsaTargetCount === 2, `Preserve edited count: ${row.task_id}`);
      assert.equal(existing.weekId, `${metadata.planSlug}-w${String(row.week_number).padStart(2, "0")}`);
      await tx.update(tasks).set({ dsaTargetCount: 2 }).where(where);
      const updated = await tx.query.tasks.findFirst({ where });
      assert.equal(updated?.dsaTargetCount, 2);
    }
  });
  console.log(`Updated ${courseRows.data.length} course notes and ${corrections.length} existing DSA target counts; extra problem slots remain proposals.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(closeConnection);
