export type TaskCategory =
  | "course"
  | "implementation"
  | "dsa"
  | "design"
  | "quality"
  | "checkpoint"
  | "other";

export const TASK_CATEGORIES: TaskCategory[] = [
  "course",
  "implementation",
  "dsa",
  "design",
  "quality",
  "checkpoint",
  "other",
];

export type TaskStatus = "not_started" | "in_progress" | "done" | "blocked";

export type CoverageKind = "percentage" | "count" | "text";

export const COVERAGE_KINDS: CoverageKind[] = ["percentage", "count", "text"];

export interface PlanRow {
  plan_slug: string;
  week_id: string;
  week_number: number;
  week_title: string;
  phase: string;
  phase_title: string;
  primary_courses: string;
  concepts: string;
  exit_criteria: string;
  target_hours: number;
  source_anchor: string;
  task_id: string;
  category: TaskCategory;
  task_title: string;
  description: string;
  required: boolean;
  sort_order: number;
  dsa_target_count: number | null;
  initial_checked: boolean;
}

export interface CourseTargetRow {
  plan_slug: string;
  course_id: string;
  course_title: string;
  planned_weeks: string;
  coverage_kind: CoverageKind;
  target_min: number | null;
  target_max: number | null;
  target_unit: string | null;
  coverage_note: string | null;
  reference_url: string | null;
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
  value?: unknown;
}

export interface ImportPreviewSummary {
  planSlug: string;
  planTitle: string;
  totalWeeks: number;
  totalTasks: number;
  totalCourses: number;
  newTasksCount: number;
  existingTasksCount: number;
  archivedTasksCount: number;
  warnings: string[];
}
