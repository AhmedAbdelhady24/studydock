# StudyDock Domain Glossary

This document establishes the precise domain language used across the StudyDock codebase, database models, and user interface.

## Terms

### Plan
A versioned curriculum or roadmap (e.g. `product-engineer-33-week`). A plan contains an ordered sequence of phases and weeks.

### Phase
A thematic group of consecutive weeks (e.g., Phase I: *JavaScript and debugging* spanning Weeks 1–4).

### Week
A distinct 7-day study module with a stable `week_id` (e.g. `product-engineer-33-week-w01`), target study hours, concept syllabus, primary course assignments, and exit criteria.

### Task
An individual trackable requirement within a week. Tasks have stable identifiers (`task_id`), categories (`course`, `implementation`, `dsa`, `design`, `quality`, `checkpoint`, `other`), descriptions, and requirement flags (`required: true | false`).

### Task Definition vs. Task Progress
- **Task Definition:** Immutable specification imported from the roadmap CSV. Represents *what should be learned*.
- **Task Progress:** Mutable, user-owned state (`status`, `completed_at`, `notes`, `confidence`). **Must never be reset upon plan re-import.**

### Checkpoint Attestation
Formal user confirmation that the week's exit test/criteria were independently satisfied. A week cannot be marked `week_complete` without its exit checkpoint being attested as passed.

### Week Completion (`week_complete`)
A strict invariant:
$$\text{week\_complete} \iff (\forall t \in \text{active\_required\_tasks}, \text{status}(t) = \text{done}) \land \text{checkpoint\_attested}(w)$$
Ticking individual tasks without attesting the checkpoint does **not** complete the week.

### Distinct Solved DSA Problem
A unique algorithmic problem where at least one successful attempt is recorded. Distinct from total attempts (e.g. attempting "Two Sum" 3 times with 2 successes counts as 1 distinct solved problem and 3 attempts). A completed weekly DSA checklist task does not count as a solved problem.

### Course Planned Target vs. Course Actual Coverage
- **Course Target:** Planned coverage range (e.g., 80–100% or 40 problems) across specific weeks, imported from `course_targets.csv`.
- **Course Actual:** User-entered observed progress. Never interpolated from completed weeks.

### Studied Hours
Derived strictly from recorded `study_sessions` (sum of `duration_minutes`). Never inferred or fabricated from checked tasks or week `target_hours`.
