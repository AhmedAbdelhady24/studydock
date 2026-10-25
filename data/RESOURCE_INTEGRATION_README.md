# StudyDock resource integration — October 2026

This update keeps your **33-week Product Engineer core** intact and adds **optional** Harness Engineering and management reading. The six-week AI/FDE specialization is packaged as a **separate plan**.

## Files

- `core_33_weeks/plan_template.csv`: **557** tasks = original **543** rows unchanged + **14** new optional rows. No original task ID, week ID, or plan slug was changed.
- `core_33_weeks/courses_template.csv`: original **16** course rows unchanged + **2** new optional goals.
- `core_33_weeks/optional_additions_only.csv` and `optional_course_goals_only.csv`: patch-only alternatives if the importer can add rows without overwriting progress.
- `core_33_weeks/Product_Engineer_33_Week_Resource_Updated_Tracker.md`: complete core tracker with optional reading added to the relevant weeks.
- `optional_ai_fde_6_weeks/`: separate 6-week plan with an independent plan_slug and **42** tasks. Display Weeks 34–39; app-local `week_number` is 1–6.
- `audit/`: the previous **measured local** catalog and workload reports plus a new `supplemental_resources_audit.csv`. The new optional external tasks have **no ffprobe durations** and do not belong in local video counts.

## Import safety

1. **Back up current StudyDock progress before importing**. Stable IDs are necessary, but importing an entire CSV may still have replacement semantics in the app.
2. All CSVs are UTF-8 **without BOM**, with unchanged original column order, and the **original 543 task rows and 16 course rows are identical by value** to the previously imported files.
3. Review `optional_additions_only.csv` and `optional_course_goals_only.csv` first; import those only if StudyDock supports **additive partial imports**. Otherwise use the full updated core CSVs and confirm the app preserves task progress by ID.
4. Import `optional_ai_fde_6_weeks/` separately **only after completing the core track**, or leave it as Markdown until then.
5. Optional resources **do not affect required progress, exit gates, DSA targets or design-pattern obligations**. Existing mandatory tasks and schedules are unchanged.
6. `course_coverage_verified.csv` includes two appended external-resource rows with `not_in_local_video_catalog`, not fabricated catalog percentages. The 312 measured local video assignments remain intact.

## Resource placement

- *High Output Management*: four optional 20–30-minute reflection sessions (Weeks 13, 20, 27 and 30); no full-book completion goal.
- [Harness Engineering](https://github.com/walkinglabs/learn-harness-engineering): nine selected lecture readings L03/L05/L06/L07/L08/L09/L10/L11/L12 and one P05 self-verification exercise during Weeks 25–29, **optional**.
- [Harvard CS50P](https://cs50.harvard.edu/python/): selected lessons only in optional Week 34.
- [Maxime Labonne LLM Engineer](https://github.com/mlabonne/llm-course): selected engineer topics in optional Weeks 37–39; **not** LLM Scientist.
- Andrew Ng Machine Learning Specialization: **deferred**, not imported as active coursework.

## Workload disclaimer

Local viewing durations were measured previously with ffprobe; new optional online lecture **reading** and project time are not measured or included in those totals. Allocate them only if you have spare study time; otherwise skip without penalty. The 16h/week core schedule is **not recertified** by this update.

## Scope

No original imported task or course row was changed. No original task's required flag changed. No DSA goals were altered. The separate optional extension uses brand-new identifiers and does not reuse the core plan slug.
