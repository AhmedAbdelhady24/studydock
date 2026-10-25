# Corrected StudyDock bundle review

Reviewed `Product_Engineer_33_Week_Verified_Metadata_StudyDock_Bundle.zip` against the previous import-ready files, the current app parser, the original supplied enriched catalog and `reports.zip`. No imports or live progress changes were made.

## Result

The corrected bundle passes the file-level audit. It resolves the encoding, contradictory course-note and missing scheduled-duration findings. Workload remains a proposed scenario because practical work has not been timed.

## Independently checked

- ZIP integrity is valid. Every CSV in the bundle is UTF-8 without BOM.
- The actual app parser accepts all 543 plan rows and all 16 course rows directly.
- All parsed plan fields and row counts match `data/import-ready/plan_template.csv` exactly.
- Course fields match the prior import except for exactly 16 changed `coverage_note` values. Course IDs and targets are unchanged.
- All 16 revised notes agree with the supplied verified coverage counts; Web Security explicitly reports no matching local inventory.
- All 312 video assignments agree with the Markdown week/path occurrences, with no omitted or extra occurrences.
- All 2,176 catalog paths are unique. Original enriched catalog fields are preserved except `duration_seconds` and `metadata_check`, which now reflect the supplied scan.
- All 312 scheduled durations match the primary measured metadata. None is missing or failed.
- Every one of the 543 tasks appears exactly once across 312 video assignments and 231 proposed practice allocations.
- All 33 detailed weekly viewing sums and proposed practice sums reconcile, as do the rounded weekly summary figures.
- Five evidence CSVs match `reports.zip` byte for byte: verified catalog, scheduled metadata, course coverage, practice allocations and detailed weekly workload.
- Input hashes in `reports.zip` match the four original Downloads CSVs. All seven reported output CSV hashes in that archive match their contents.

## Workload figures

| Measure | Hours |
|---|---:|
| Required video assignments, including repeats | 40.6994 |
| Optional video assignments, including repeats | 11.2182 |
| Proposed independent practice | 305.25 |
| Required viewing plus proposed practice | 345.9494 |
| Full study budget | 528 |

The largest combined proposed week is Week 22 at 13.9876 hours. All 33 rows correctly retain the conservative `UNVERIFIED` status. Passing the proposed budget arithmetic does not measure personal study pace or establish that 9.25 practice hours per week is sufficient for every week's work.

## DSA clarification

The earlier 56-versus-65 numerical discrepancy is explained by five blank structured fields in Weeks 10, 15, 31, 32 and 33. Existing prose specifies two primary problems per week, yielding 66 primary slots if those fields are populated. This is a metadata correction proposal, not evidence of 66 distinct solved problems.

The five proposed patches point to the correct existing blank fields and propose 2 each. The separate 75-slot registry references existing DSA task IDs and leaves actual problem IDs blank. Optional extra slots remain proposals. Neither proposal has been applied.

## App implications

The unchanged plan does not need re-importing. The existing importer updates course definitions by stable ID and preserves existing task/course progress; the course-note refresh can use that path with the unchanged plan. The five count corrections also retain task IDs and do not inherently require progress resets. No new app update mechanism is needed merely for these metadata edits.

Viewing-duration reports are companion files: the current plan import schema has no per-video duration field. Re-importing the same plan will not itself make these durations appear in StudyDock. Integrating the measured workload into the UI is separate product work.

## Remaining limits

The scan was performed in another environment. This review reconciles its supplied measurements and reports; it does not independently rerun ffprobe or verify media existence/playback. The reported damaged `7. Depth-First Delete.mp4` is outside the scheduled set. Container metadata does not prove full playback, title/content correctness or publisher curriculum completeness. The included reproduction tests were not rerun here.
