# Verified bundle integration

The running app now exposes the verified bundle in **Video Library** (`/library`), with video search, priority/week filters, all 33 weekly workload estimates, 27 inventory/coverage groups, the 75-slot proposed problem registry, and source-report downloads.

Measured viewing minutes appear in task details. Required/optional viewing and proposed practice hours appear on week pages; roadmap cards include required viewing and estimated practice. Course filters now use the actual percentage/count/text kinds, and the problem-count goal is displayed in problems rather than percent.

## Data and progress

- The original bundle assets live under `public/learning-data/`. They are the dated source snapshot, including unmodified original import/proposal CSVs.
- `src/lib/learning-metadata.ts` validates and joins the supplied CSVs using the installed CSV parser and Zod. A different plan or edited task resource does not receive mismatched task-video metadata.
- `scripts/apply-learning-enrichment.ts` transactionally updates only the 16 existing course notes and five existing null DSA counts. The structured total is now 66. The 9 extra slots are still proposals; no new tasks or problem IDs were created.
- The script can be rerun with `node --import tsx scripts/apply-learning-enrichment.ts`. It refuses unexpected existing nonblank counts. Use it again after intentionally importing the original source plan, which still contains the five blank values.
- Before/after full-plan exports were compared: all existing task/course progress, notes, confidence, checkpoints, DSA attempts and study sessions remained unchanged. All 543 tasks and all 16 goals retained their IDs. Only the intended definition fields changed.
- Current app exports include the corrected database definitions. Source downloads remain the original evidence snapshot.

## Verification

- TypeScript check passed.
- All 20 tests passed, including catalog/assignment/weekly-hour reconciliation, invalid-media handling, and protection against attaching metadata to a different plan or changed resource.
- Browser checked catalog search plus week filtering, 33 workload rows, 27 coverage rows, the proposal view, measured task minutes, weekly hours, and count-goal filtering. At 390px viewport width, the checked pages had no whole-page horizontal overflow.
- Running `/api/plan` returned 312 tasks with video metadata and 33 weeks with workload data.

## Limits

The public assets and workload data describe the verified bundle snapshot. Refresh them when revising the curriculum. The current importer does not accept arbitrary media catalogs. Measured durations were supplied from the remote scan; media were not re-probed here. Practice times remain proposed estimates and all weekly feasibility statuses remain unverified.

During browser checks the dev server returned 500 for its existing favicon/icon routes. Page content and enrichment API checks passed; icon handling was outside this change.
