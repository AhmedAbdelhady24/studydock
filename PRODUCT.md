# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Software engineers, product engineers, and technical self-learners executing intensive multi-month study curricula (33 weeks, 1,400+ hours).

## Product Purpose
StudyDock is a local-first engineering curriculum execution engine and learning harness. It converts ambitious learning intent into auditable, sustained technical mastery through structured sprint roadmaps, spaced retrieval cadences, 60fps optimistic Kanban execution, focus session telemetry, algorithmic practice tracking, and mandatory exit gatekeepers.

## Positioning
An auditable, local-first learning harness engineered with zero telemetry, direct PostgreSQL persistence, and zero cloud dependency. Unlike gamified consumer trackers or generic todo apps, StudyDock enforces engineering rigor: mandatory exit checkpoint attestations, non-destructive syllabus CSV diffing, formula-injection defense, and complete SQL snapshot backups.

## Operating Context
- Local web browser running on desktop and mobile viewports.
- Docker Compose or native PostgreSQL 16 with Drizzle ORM.
- Daily workflows: sprint task execution on Kanban board, focus timer tracking, algorithmic drill logging, and weekly checkpoint sign-offs.

## Capabilities and Constraints
- Local-first architecture (Next.js 14 App Router, TypeScript 5.7, Drizzle ORM 0.39, PostgreSQL 16)
- 100% zero-telemetry boundary (zero outbound network requests or third-party analytics)
- Deterministic syllabus importer with CSV diffing, immutable task IDs (`w01_t01` through `w33_t07`), and OWASP spreadsheet formula sanitization
- 60fps optimistic Kanban board with keyboard navigation and slide-over task drawer
- Focus timer logging with session telemetry and aggregated study metrics
- Algorithmic drill bank (DSA) with topic tags, difficulty levels, and completion status
- Curriculum roadmap with 33-week timeline, phase milestones, and verified exit gatekeepers
- Sonner toast notification pipeline for all user feedback
- System-respecting dark and light themes with responsive mobile shell

## Brand Commitments
- Name: StudyDock
- Tone: Deliberate, technical, understated, engineering-grade, focused
- Visual identity: Neutral monochrome architectural grounds with precision category indicators (no neon gradients or decorative slop)
- System typography: Geometric sans with tabular figures for metrics and timers

## Evidence on Hand
- Complete 33-week curriculum syllabus (`study_curriculum_expanded_33w.csv`)
- Comprehensive test suite (12/12 passing Vitest tests covering parser, exporter, and metrics)
- Migration scripts and seed data for immediate reproduction
- Interactive architecture diagram (`public/docs/studydock-architecture.html`)
- 15-second procedural motion graphics showreel (`assets/showreel-motion.mp4`)

## Product Principles
1. **Local-First & Sovereign**: Learning telemetry and progression data remain strictly local. 0ms lag, direct database transactions, zero cloud tracking.
2. **Honest Rigor over Gamification**: Replace vanity streaks with verified exit gatekeeper sign-offs, algorithm code traces, and genuine practice hours.
3. **Optimistic & Tactile**: Every interaction responds instantly with zero layout shifts, smooth transitions, and keyboard-first access.
4. **Resilience by Design**: Tables, Bento cards, and drawers hold integrity against worst-case data lengths and extreme inputs.
