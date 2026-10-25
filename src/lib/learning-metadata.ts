import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { z } from "zod";

const number = z.coerce.number().finite().nonnegative();
const duration = z.preprocess((value) => value === "" ? null : value, number.positive().nullable());
const text = z.string();
const flag = z.enum(["true", "false"]);

function readRows<T extends z.ZodTypeAny>(filename: string, schema: T): z.infer<T>[] {
  return z.array(schema).parse(parse(fs.readFileSync(path.join(process.cwd(), "public/learning-data", filename), "utf8"), {
    columns: true, bom: true, skip_empty_lines: true, trim: true,
  }));
}

function loadMetadata() {
  const measured = readRows("verified_video_catalog.csv", z.object({
    relative_path: text, course_name: text, duration_seconds: duration,
    probe_status: z.enum(["success", "invalid_media"]),
  }));
  const measuredByPath = new Map(measured.map((row) => [row.relative_path, row]));
  const videos = readRows("full_video_catalog.csv", z.object({
    relative_path: text, full_title: text, course_folder: text, category: text,
    assigned_weeks: text, study_priority: z.enum(["required", "optional", "reference_only"]),
    studydock_task_ids: text,
  })).map((row) => {
    const measurement = measuredByPath.get(row.relative_path);
    if (!measurement) throw new Error(`Missing measured record for ${row.relative_path}`);
    return { ...row, ...measurement };
  });
  const assignments = readRows("scheduled_video_metadata.csv", z.object({
    plan_slug: text, week_id: text, task_id: text, relative_path: text,
    source_video_reference: text, required: flag, duration_seconds: number.positive(),
  }));
  const weeks = readRows("weekly_workload_verified.csv", z.object({
    plan_slug: text, week_id: text, week_number: number.int().positive(), week_title: text,
    required_viewing_hours: number, optional_viewing_hours: number,
    allocated_practice_hours: number, total_estimated_hours: number,
    required_total_estimated_hours: number, target_hours: number, status: z.literal("UNVERIFIED"),
  }));
  const coverage = readRows("course_coverage_verified.csv", z.object({
    course_id: text, course_name: text, total_unique_cataloged_videos: number.int(),
    required_scheduled_assignments: number.int(), optional_scheduled_assignments: number.int(),
    unique_scheduled_videos: number.int(), total_measured_course_duration_hours: number,
  }));
  const dsaSlots = readRows("dsa_problem_registry_PROPOSAL_ONLY.csv", z.object({
    week_number: number.int().positive(), existing_dsa_task_id: text, slot_type: text,
    slot_number: number.int().positive(), problem_id: text, note: text,
  }));
  const planSlugs = new Set([...assignments, ...weeks].map((row) => row.plan_slug));
  if (planSlugs.size !== 1) throw new Error("Learning metadata must describe one plan");
  for (const row of assignments) {
    const video = measuredByPath.get(row.relative_path);
    if (video?.probe_status !== "success" || video.duration_seconds !== row.duration_seconds) {
      throw new Error(`Invalid measured assignment: ${row.task_id}`);
    }
  }
  return { planSlug: assignments[0].plan_slug, videos, assignments, weeks, coverage, dsaSlots };
}

export type LearningMetadata = ReturnType<typeof loadMetadata>;
let metadata: LearningMetadata | undefined;

// shortcut: this is a verified bundle snapshot; replace the assets when the curriculum is revised.
export function getLearningMetadata(): LearningMetadata {
  return metadata ??= loadMetadata();
}

export function getTaskVideo(planSlug: string, task: { taskId: string; description: string; required: boolean }) {
  const data = getLearningMetadata();
  if (planSlug !== data.planSlug) return null;
  const assignment = data.assignments.find((row) => row.task_id === task.taskId);
  if (!assignment || !task.description.includes(`Local inventory-listed file: ${assignment.source_video_reference} |`) ||
      task.required !== (assignment.required === "true")) return null;
  return { durationSeconds: assignment.duration_seconds, relativePath: assignment.relative_path };
}
