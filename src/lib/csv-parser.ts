import { parse } from "csv-parse/sync";
import { PlanImportRowSchema, CourseTargetRowSchema } from "./csv-schema";
import { PlanRow, CourseTargetRow, ValidationError } from "./types";

export const REQUIRED_PLAN_HEADERS = [
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
];

export const REQUIRED_COURSE_HEADERS = [
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
];

export interface ParseResult<T> {
  success: boolean;
  data: T[];
  errors: ValidationError[];
}

export function parsePlanImportCsv(csvContent: string): ParseResult<PlanRow> {
  const errors: ValidationError[] = [];
  let rawRecords: Record<string, string>[];

  try {
    rawRecords = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: false,
    });
  } catch (err: any) {
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 1,
          column: "csv",
          message: `Malformed CSV formatting: ${err.message || String(err)}`,
        },
      ],
    };
  }

  if (rawRecords.length === 0) {
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 1,
          column: "file",
          message: "CSV file is empty or contains only headers.",
        },
      ],
    };
  }

  // Header validation
  const actualHeaders = Object.keys(rawRecords[0]);
  for (const requiredHeader of REQUIRED_PLAN_HEADERS) {
    if (!actualHeaders.includes(requiredHeader)) {
      errors.push({
        row: 1,
        column: requiredHeader,
        message: `Missing required header: ${requiredHeader}`,
      });
    }
  }

  if (errors.length > 0) {
    return { success: false, data: [], errors };
  }

  const validRows: PlanRow[] = [];
  const seenTaskIds = new Set<string>();
  const weekMetadataMap = new Map<
    string,
    {
      week_number: number;
      week_title: string;
      phase: string;
      phase_title: string;
    }
  >();

  for (let i = 0; i < rawRecords.length; i++) {
    const rowNumber = i + 2; // 1-indexed, accounting for header row
    const raw = rawRecords[i];

    const parseResult = PlanImportRowSchema.safeParse(raw);
    if (!parseResult.success) {
      for (const issue of parseResult.error.issues) {
        errors.push({
          row: rowNumber,
          column: issue.path.join(".") || "unknown",
          message: issue.message,
          value: raw[issue.path[0] as string],
        });
      }
      continue;
    }

    const rowData = parseResult.data as PlanRow;

    // Duplicate Task ID validation
    if (seenTaskIds.has(rowData.task_id)) {
      errors.push({
        row: rowNumber,
        column: "task_id",
        message: `Duplicate task_id '${rowData.task_id}' found in plan`,
        value: rowData.task_id,
      });
    } else {
      seenTaskIds.add(rowData.task_id);
    }

    // Consistent Week Metadata validation
    const existingWeekMeta = weekMetadataMap.get(rowData.week_id);
    if (existingWeekMeta) {
      if (
        existingWeekMeta.week_number !== rowData.week_number ||
        existingWeekMeta.week_title !== rowData.week_title ||
        existingWeekMeta.phase !== rowData.phase ||
        existingWeekMeta.phase_title !== rowData.phase_title
      ) {
        errors.push({
          row: rowNumber,
          column: "week_id",
          message: `Inconsistent week metadata for week_id '${rowData.week_id}'. Metadata must match across all rows with the same week_id.`,
        });
      }
    } else {
      weekMetadataMap.set(rowData.week_id, {
        week_number: rowData.week_number,
        week_title: rowData.week_title,
        phase: rowData.phase,
        phase_title: rowData.phase_title,
      });
    }

    validRows.push(rowData);
  }

  return {
    success: errors.length === 0,
    data: errors.length === 0 ? validRows : [],
    errors,
  };
}

export function parseCourseTargetsCsv(
  csvContent: string
): ParseResult<CourseTargetRow> {
  const errors: ValidationError[] = [];
  let rawRecords: Record<string, string>[];

  try {
    rawRecords = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: false,
    });
  } catch (err: any) {
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 1,
          column: "csv",
          message: `Malformed CSV formatting: ${err.message || String(err)}`,
        },
      ],
    };
  }

  if (rawRecords.length === 0) {
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 1,
          column: "file",
          message: "CSV file is empty or contains only headers.",
        },
      ],
    };
  }

  // Header validation
  const actualHeaders = Object.keys(rawRecords[0]);
  for (const requiredHeader of REQUIRED_COURSE_HEADERS) {
    if (!actualHeaders.includes(requiredHeader)) {
      errors.push({
        row: 1,
        column: requiredHeader,
        message: `Missing required header: ${requiredHeader}`,
      });
    }
  }

  if (errors.length > 0) {
    return { success: false, data: [], errors };
  }

  const validRows: CourseTargetRow[] = [];
  const seenCourseIds = new Set<string>();

  for (let i = 0; i < rawRecords.length; i++) {
    const rowNumber = i + 2;
    const raw = rawRecords[i];

    const parseResult = CourseTargetRowSchema.safeParse(raw);
    if (!parseResult.success) {
      for (const issue of parseResult.error.issues) {
        errors.push({
          row: rowNumber,
          column: issue.path.join(".") || "unknown",
          message: issue.message,
          value: raw[issue.path[0] as string],
        });
      }
      continue;
    }

    const rowData = parseResult.data as CourseTargetRow;

    if (seenCourseIds.has(rowData.course_id)) {
      errors.push({
        row: rowNumber,
        column: "course_id",
        message: `Duplicate course_id '${rowData.course_id}' found`,
        value: rowData.course_id,
      });
    } else {
      seenCourseIds.add(rowData.course_id);
    }

    validRows.push(rowData);
  }

  return {
    success: errors.length === 0,
    data: errors.length === 0 ? validRows : [],
    errors,
  };
}
