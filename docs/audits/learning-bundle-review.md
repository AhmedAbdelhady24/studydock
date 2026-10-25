# Learning bundle audit

Reviewed the five revised Downloads files against the prior supplied files, the previously imported BOM-free copies in `data/import-ready/`, and the current StudyDock CSV parser. No database writes were performed in this audit.

## Verdict

The learning plan is internally consistent and preserves existing IDs. The revised plan and goals are the same content already imported. Both supplied import CSVs still need their UTF-8 BOM removed before the current app accepts them. The bundle does not yet support a complete workload audit.

## Verified results

- 33 weeks, 543 unique tasks, 16 course goals.
- 231 independent study tasks, all required; 312 video assignments: 247 required and 65 optional.
- All weeks retain required implementation, DSA and design practice among the independent tasks.
- All 312 video assignments resolve to exact catalog paths after removing the plan's leading `./` path notation.
- Those assignments refer to 282 distinct catalog paths. Repeated assignments account for the remaining 30 occurrences; they are not automatically errors.
- The catalog has 2,176 distinct paths and no duplicate path rows. Every row declares `title_status=full_title`.
- Catalog task IDs, assigned weeks and priority annotations agree with the plan. For a video used as both required and optional, the catalog uses required priority; consult the task for each week's requirement.
- All 312 Markdown video path occurrences agree with their assigned weeks in the plan, including the 24 supplementary optional assignments under `Path:` lines.
- Both import CSVs fail the actual app parser as supplied with `Missing required header: plan_slug`. Removing only the leading BOM makes all 543 plan rows and 16 goal rows pass.
- All 16 coverage-audit rows' inventory counts, required/optional assignment counts, unique-path counts and percentages reconcile under their apparent folder-grouping rules. However, the NeetCode grouping has a misleading label, discussed below.

## What actually changed from the previous delivery

After decoding UTF-8 with BOM handling, the plan CSV, goals CSV, coverage audit and Markdown are identical to the previous delivery. Thus every existing task/week/course ID and its metadata is preserved, but no additional optional tasks were introduced by this revision relative to the imported bundle.

The previous `full-title-catalog.csv` already had 2,176 entries. The revised `full_video_catalog.csv` retains the same 14 source fields and rows and adds three fields: `assigned_weeks`, `study_priority`, `studydock_task_ids`. This is useful scheduling enrichment, not an expansion of the supplied video inventory relative to the last delivery.

## Corrections for the file generator

### 1. Remove the BOM from import CSV exports

Write UTF-8 without BOM. Preserve the exact existing headers and stable IDs. No additional import schema or template files are needed for this version: compatibility has now been tested against the actual app parser.

### 2. Rebuild coverage notes from one source

Eight course notes combine current inventory counts with older, contradictory counts:

| Course | Current inventory claim | Older filenames claim in the same note |
|---|---:|---:|
| Total TypeScript Pro Essentials | 369 | 59 |
| Epic React v2 | 411 | 372 |
| Complete Intro to React v9 | 50 | 31 |
| API Design in Node.js v5 | 62 | 59 |
| Next.js Fundamentals v4 | 35 | 29 |
| The Last Algorithms Course You'll Need | 8 | 34 |
| NeetCode 150 / Grind 75 | 99 | 0 |
| Ultimate Design Patterns + Refactoring.Guru | 110 | 55 |

Generate the notes once from the final catalog and task mapping. If two counts intentionally measure different scopes, name those scopes explicitly. The NeetCode note also claims both 43 video assignments and zero weekly video assignments. Its target is a count of problems, yet the note discusses an earlier percentage target; use wording appropriate to `coverage_kind=count`.

### 3. Separate NeetCode learning resources from problem targets

The audit's 99-video denominator consists of 57 algorithms videos, 20 system-design videos and 22 full-stack videos. Those are not a NeetCode 150 / Grind 75 problem-set inventory. The reported 14 required assignments include system-design lessons.

Split these into clearly named resource groups in the reference audit, or explicitly rename the combined group. Keep the existing problem-goal course ID stable. Do not treat video completion as problem completion. One algorithms video is required in one week and optional in another, so count assignments using task-level flags rather than the catalog's aggregate priority.

The design-pattern denominator also includes a folder explicitly labeled `additional copy`. It accurately counts paths, but does not establish unique lesson content. Label the denominator as file count, or add a separate content-deduplication measure backed by hashes/evidence.

### 4. Complete duration metadata before claiming workload feasibility

- Catalog: 507 rows have durations and `metadata_check=passed`; 1,669 have no duration and `metadata_check=not_checked`.
- Scheduled unique videos: 58 have durations; 224 do not.
- Scheduled assignments: 62 have durations; 250 do not, including 210 required and 40 optional assignments.
- Every week has at least one assigned video with missing duration. Every week has a 16-hour target.

The companion weekly CSV lists known viewing time and missing counts. Known hours are lower bounds, not workload estimates; zero means no duration evidence, not no work. Obtain measured durations from the actual media, then budget viewing, exercises, implementation, DSA, design and review separately. Do not invent missing durations or conclude that the plan fits 16 hours from current data.

### 5. Reconcile DSA targets

The explicit weekly `dsa_target_count` values sum to 56, while the course goal is 65-85 distinct problems. This does not establish a contradiction if additional work is intended, but the schedule does not explicitly allocate the minimum 9 extra distinct problems. Explain where those fit or revise the allocations, preserving IDs. Repeat attempts and review sessions must not count as new distinct problems.

### 6. Update the handoff description and roadmap references

Use `full_video_catalog.csv` consistently; the Markdown still also references the old catalog filename. Replace the claim that app templates are still needed with the verified compatibility result and the remaining BOM requirement. Describe the 24 optional lessons as already present in the prior bundle, rather than newly added in this revision.

## Suggested message to the generating ChatGPT

> The actual StudyDock parser was tested: the columns and enum values are compatible, but both import CSVs still fail because of a leading UTF-8 BOM. Please export UTF-8 without BOM and preserve all current plan, week, task and course IDs. The plan, goals, coverage audit and Markdown are identical to the previous delivery; the catalog adds assignment metadata but has the same 2,176 source entries. Rebuild contradictory coverage notes from the final catalog, separate NeetCode algorithms/system-design/full-stack inventory from the 65-85-problem goal, and make clear that design-pattern file counts include an additional-copy folder. Obtain measured durations for the 250 scheduled assignments currently missing them before claiming weekly feasibility. Explicitly allocate the gap between 56 weekly problem targets and the 65-problem minimum. Return corrected files plus a concise factual change list; do not expand or reschedule the curriculum without identifying the proposed changes.

## Limits

This audit verifies supplied-file consistency and parser compatibility. It does not verify media existence on disk, playback, publisher curriculum completeness, correctness of lesson content or reported duration measurements. The user's learning progress was not re-read or changed. No re-import is needed for identical plan/goal content.
