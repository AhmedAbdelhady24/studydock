---
name: learning-plan-author
description: Creates structured, importable Markdown learning plans and converts them into StudyDock-compatible CSV bundles. Use when generating, formatting, or updating learning roadmaps with weekly tasks, DSA exercises, design patterns, course targets, and exit checkpoints.
---

# Learning Plan Author

This skill guides the creation and maintenance of learning plans compatible with **StudyDock**.

## Plan Structure Requirements

Every authored plan must contain:
1. **Title & Overview**: A top-level heading (`# ...`) with plan description.
2. **Phase Map Table**: A markdown table mapping week ranges to phases.
   ```markdown
   ## Phase map

   | Phase | Title | Weeks | Focus |
   |-------|-------|-------|-------|
   | I | JavaScript & Debugging | 1–4 | Core syntax, runtime execution, and debugging |
   ```
3. **Core Course Completion Targets**: A markdown table specifying courses, week ranges, and coverage expectations.
   ```markdown
   ## Core course completion targets

   | Course | Planned weeks | Target coverage | Coverage notes |
   |--------|---------------|-----------------|----------------|
   | JavaScript: The Hard Parts v3 | 1–2 | 80–100% | Focus on closures and async |
   ```
4. **Weekly Blocks (`## Week NN — Title`)**:
   Each week must provide:
   - `**Primary courses**: ...`
   - `**Concepts**: ...`
   - `**Exit criteria**: ...`
   - `**Target hours**: ...`
   - **Required task categories**:
     - At least 1 `course` task
     - At least 1 `dsa` task (with explicit or target problem count)
     - At least 1 `design` or `architecture` task
     - 2 `implementation` (independent coding) tasks
     - 1 `checkpoint` task reflecting the week's exit gate

## Task Stable IDs

To ensure safe re-import without resetting user progress, add explicit HTML comments for task IDs:
```markdown
- [ ] Implement custom Promise.all and Promise.race <!-- task-id: pe-w02-p-promise-all -->
```
If omitted, IDs are automatically generated from a deterministic content hash.

## Generating the CSV Bundle

Run the bundled converter script:
```bash
python3 scripts/markdown_to_csv.py \
  path/to/learning_plan.md \
  --plan-slug your-plan-slug \
  --expected-weeks 12 \
  --output data/import \
  --zip
```
