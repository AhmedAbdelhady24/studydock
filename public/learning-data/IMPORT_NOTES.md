# StudyDock import and video-metadata audit (20 October 2026)

## Files

- `plan_template.csv`: original 543 import tasks, same column order, values, row order, `plan_slug`, `week_id`, `task_id` and `course_id` references. **No curricular edits**. UTF-8 without BOM.
- `courses_template.csv`: original 16 import goals, same import columns, IDs, targets and order. `coverage_note` refreshed from local measured inventory (no ID changes). UTF-8 without BOM.
- `Product_Engineer_33_Week_Measured_Tracker.md`: unchanged 33 weekly lesson/task assignments, with measured time information replacing former unmeasured scenario tables.
- `full_video_catalog.csv`: all 2,176 unique catalog paths in original column order; `duration_seconds` filled from ffprobe where successful; one invalid media entry has no duration.
- `verified_video_catalog.csv`: detailed measured metadata.
- `scheduled_video_metadata.csv`: 312 measured matching scheduled assignments.
- `course_coverage_verified.csv`: expanded course and supplemental catalog breakdown (27 rows; 16 imported goals). Do not import this file as the course template.
- `weekly_workload_verified.csv`: detailed measured viewing plus estimated practice schedule; `weekly_workload_summary.csv` human-readable values.
- `scan_failures.csv`: one damaged unscheduled video.
- `dsa_count_metadata_patch_PROPOSAL_ONLY.csv`: five existing DSA rows with blank structured count, proposed as 2 each. No import edits made.
- `dsa_problem_registry_PROPOSAL_ONLY.csv`: 66 primary problem slots + 9 extra optional proposed slots, with NO invented problem IDs. Not an app import format.

## Evidence

- 2,176 cataloged video files; 2,175 measured durations; 1 invalid unscheduled video.
- 247 required and 65 optional scheduled video assignments; all 312 have known measured durations.
- 282 distinct scheduled video paths, with 30 repeat assignments.
- Total measured required video viewing: 40.70 hours across 33 weeks, at 1× playback speed.
- Total measured optional video viewing: 11.22 hours.
- Full roadmap has a 16h/week target = 528 planned hours.
- Proposed practice allocation: 9.25h/week, total 305.25h. The required-video+practice scenario estimates 345.95h total. Neither independent practice duration nor actual learner completion is measured.
- Highest combined estimated week: week 22 (13.99h including optional videos), and *even this is still unverified because practice hours are estimates*.
- All 33 weeks are conservatively `UNVERIFIED` for budget; the proposed practice scenario would fit. Do not claim a certified all-within-budget result.
- Original algorithm target: 65–85 **distinct** problems; 33 prose entries specify two primary slots each = 66 slots, but structured counts sum 56 because 5 numeric fields are blank. With absent platform IDs actual distinct solved count remains unknown.

## Course-note consistency

The 16 `coverage_note` values were regenerated from `course_coverage_verified.csv`. The counts used are **catalog paths scoped to each course**, not estimated topic coverage or real student completion. NeetCode Algorithms uses 57 files, separate from its 20 system-design and 22 full-stack files. Original Primeagen course uses 8, while Part 2 is separate with 26. Course goals preserve their aspiration percentages, which are not equivalent to scheduled video fractions.

## Safe import process

1. Export/back up existing StudyDock progress.
2. The plan import is unchanged from the existing stripped-BOM plan; a re-import is **not required** just to refresh viewing metadata.
3. If you want refreshed course notes, compare them to your current records and use your application's safe ID-preserving update/dry-run, not an unconditional overwrite.
4. Neither the source report nor this bundle contains your live completed-task data. An import might reset progress depending on the app; validate before importing.
5. Data audit scripts do not prove full playback: ffprobe reads container metadata only.
6. The DSA proposal files are NOT StudyDock imports and were deliberately kept separate.

## Integrity checks

- All 543 plan task IDs, 33 week IDs, 16 course IDs and original import column orders retained.
- `plan_template.csv` matches the scan source after removing only the BOM prefix (SHA-256 checked against the local audit input manifest).
- All 312 scheduled video entries match the catalog; all 312 contain durations.
- Measured durations were never imputed.
- All CSV outputs are UTF-8 without BOM.
- No original video files or user progress altered.
