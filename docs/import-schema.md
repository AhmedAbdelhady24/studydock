# StudyDock CSV Import Contract (Schema v1.0)

StudyDock accepts either:
1. **Single-file format:** `plan_import.csv`
2. **ZIP bundle format:** A `.zip` archive containing `plan_import.csv`, `weeks.csv`, `tasks.csv`, `course_targets.csv`, and `manifest.json`.

## 1. Canonical File: `plan_import.csv`

Each row represents one task within a week, repeating week-level metadata for denormalized ingestion.

### Header Specification (Order & Names Exact)

`plan_slug,week_id,week_number,week_title,phase,phase_title,primary_courses,concepts,exit_criteria,target_hours,source_anchor,task_id,category,task_title,description,required,sort_order,dsa_target_count,initial_checked`

| Field | Type | Description |
|---|---|---|
| `plan_slug` | String (slug) | Unique plan identifier (e.g. `product-engineer-33-week`). |
| `week_id` | String | Unique, stable week ID within plan (e.g. `product-engineer-33-week-w01`). |
| `week_number` | Integer | 1-indexed sequential week number. |
| `week_title` | String | Human-readable title of the week. |
| `phase` | String | Phase identifier (e.g. `I`, `II`, `III`). |
| `phase_title` | String | Human-readable phase name. |
| `primary_courses`| String | Associated course references for the week. |
| `concepts` | String | Comma- or prose-delimited key concepts. |
| `exit_criteria` | String | Measurable completion standard for the week. |
| `target_hours` | Numeric | Planned target study hours for the week. |
| `source_anchor` | String | Markdown anchor slug (e.g. `week-01`). |
| `task_id` | String | Stable task ID unique per plan. |
| `category` | Enum | One of: `course`, `implementation`, `dsa`, `design`, `quality`, `checkpoint`, `other`. |
| `task_title` | String | Title / category display name. |
| `description` | String | Full task requirements and instructions. |
| `required` | Boolean | `true` or `false`. Non-required tasks do not block week completion. |
| `sort_order` | Integer | Display sequence inside the week (1-indexed). |
| `dsa_target_count`| Integer \| null | Target number of problems (empty string if not specified). |
| `initial_checked`| Boolean | Initial check status applied **only on initial creation**. |

## 2. Companion File: `course_targets.csv`

Headers: `plan_slug,course_id,course_title,planned_weeks,coverage_kind,target_min,target_max,target_unit,coverage_note,reference_url`

- `coverage_kind`: `percentage`, `count`, or `text`. Target problem counts are never conflated with course completion percentages.
- `target_min` / `target_max`: Numeric bounds or empty if text.
- `target_unit`: `%`, `problems`, `hours`, etc.

## 3. Invariants & Rules

1. **RFC 4180 Quoting:** All values are parsed with standard RFC 4180 rules. Formula injection prefixes (`=`, `+`, `-`, `@`) are escaped.
2. **Safe Re-import (Progress Preservation):**
   - Re-importing an updated plan matches tasks by `task_id`.
   - Existing user progress (`task_progress`, `dsa_attempts`, `study_sessions`, `evidence_links`, `checkpoint_attestations`) **must never be overwritten or deleted**.
   - Missing tasks in a re-import are marked `archived_at = NOW()`, not hard-deleted.
3. **All-or-Nothing Transaction:** Validation runs before any database writes. If any row is invalid, the entire import rolls back and returns row/column diagnostics.
4. **Preview Gate:** The UI provides an import diff showing New, Updated, Unchanged, and Archived counts before final write confirmation.
