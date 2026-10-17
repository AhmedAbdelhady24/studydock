import { z } from "zod";
import { TASK_CATEGORIES, COVERAGE_KINDS, TaskCategory, CoverageKind } from "./types";

export const PlanImportRowSchema = z.object({
  plan_slug: z
    .string({ required_error: "plan_slug is required" })
    .min(1, "plan_slug cannot be empty")
    .regex(/^[a-z0-9-_]+$/, "plan_slug must be a valid lowercase slug"),
  week_id: z
    .string({ required_error: "week_id is required" })
    .min(1, "week_id cannot be empty"),
  week_number: z.coerce
    .number({ required_error: "week_number is required" })
    .int("week_number must be an integer")
    .positive("week_number must be positive"),
  week_title: z
    .string({ required_error: "week_title is required" })
    .min(1, "week_title cannot be empty"),
  phase: z
    .string({ required_error: "phase is required" })
    .min(1, "phase cannot be empty"),
  phase_title: z
    .string({ required_error: "phase_title is required" })
    .min(1, "phase_title cannot be empty"),
  primary_courses: z.string().default(""),
  concepts: z.string().default(""),
  exit_criteria: z.string().default(""),
  target_hours: z.coerce
    .number()
    .nonnegative("target_hours cannot be negative")
    .default(0),
  source_anchor: z.string().default(""),
  task_id: z
    .string({ required_error: "task_id is required" })
    .min(1, "task_id cannot be empty"),
  category: z
    .string({ required_error: "category is required" })
    .refine((val): val is TaskCategory => TASK_CATEGORIES.includes(val as TaskCategory), {
      message: `Invalid category. Allowed values: ${TASK_CATEGORIES.join(", ")}`,
    }),
  task_title: z.string().default(""),
  description: z.string().default(""),
  required: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      const lower = val.trim().toLowerCase();
      if (lower === "true" || lower === "1") return true;
      if (lower === "false" || lower === "0") return false;
      throw new Error(`Invalid boolean value: ${val}`);
    }),
  sort_order: z.coerce.number().int().default(1),
  dsa_target_count: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      const num = Number(val);
      if (isNaN(num)) return null;
      return num;
    }),
  initial_checked: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      const lower = (val || "").trim().toLowerCase();
      return lower === "true" || lower === "1";
    })
    .default(false),
});

export const CourseTargetRowSchema = z.object({
  plan_slug: z
    .string({ required_error: "plan_slug is required" })
    .min(1, "plan_slug cannot be empty"),
  course_id: z
    .string({ required_error: "course_id is required" })
    .min(1, "course_id cannot be empty"),
  course_title: z
    .string({ required_error: "course_title is required" })
    .min(1, "course_title cannot be empty"),
  planned_weeks: z.string().default(""),
  coverage_kind: z
    .string({ required_error: "coverage_kind is required" })
    .refine((val): val is CoverageKind => COVERAGE_KINDS.includes(val as CoverageKind), {
      message: `Invalid coverage_kind. Allowed values: ${COVERAGE_KINDS.join(", ")}`,
    }),
  target_min: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
  target_max: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
  target_unit: z.string().nullable().default(null),
  coverage_note: z.string().nullable().default(null),
  reference_url: z.string().nullable().default(null),
});
