import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const plans = pgTable(
  "plans",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    startDate: timestamp("start_date", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    importedSourceHash: text("imported_source_hash"),
    currentVersion: integer("current_version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("plans_slug_idx").on(table.slug),
  })
);

export const phases = pgTable("phases", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .references(() => plans.id, { onDelete: "cascade" })
    .notNull(),
  code: text("code").notNull(),
  title: text("title").notNull(),
  displayOrder: integer("display_order").notNull(),
});

export const weeks = pgTable(
  "weeks",
  {
    id: serial("id").primaryKey(),
    planId: integer("plan_id")
      .references(() => plans.id, { onDelete: "cascade" })
      .notNull(),
    weekId: text("week_id").notNull(),
    weekNumber: integer("week_number").notNull(),
    phase: text("phase").notNull(),
    phaseTitle: text("phase_title").notNull(),
    title: text("title").notNull(),
    targetHours: numeric("target_hours").notNull().default("0"),
    primaryCourses: text("primary_courses").default(""),
    concepts: text("concepts").default(""),
    exitCriteria: text("exit_criteria").default(""),
    sourceAnchor: text("source_anchor").default(""),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    planWeekIdIdx: uniqueIndex("weeks_plan_week_id_idx").on(table.planId, table.weekId),
    planWeekNumberIdx: uniqueIndex("weeks_plan_week_num_idx").on(table.planId, table.weekNumber),
  })
);

export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    planId: integer("plan_id")
      .references(() => plans.id, { onDelete: "cascade" })
      .notNull(),
    weekId: text("week_id").notNull(),
    taskId: text("task_id").notNull(),
    category: text("category").notNull(), // course, implementation, dsa, design, quality, checkpoint, other
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    required: boolean("required").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(1),
    dsaTargetCount: integer("dsa_target_count"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    planTaskIdIdx: uniqueIndex("tasks_plan_task_id_idx").on(table.planId, table.taskId),
    weekIdIdx: index("tasks_week_id_idx").on(table.weekId),
    categoryIdx: index("tasks_category_idx").on(table.category),
  })
);

export const taskProgress = pgTable(
  "task_progress",
  {
    id: serial("id").primaryKey(),
    taskId: text("task_id").notNull().unique(),
    status: text("status").notNull().default("not_started"), // not_started, in_progress, done, blocked
    completedAt: timestamp("completed_at", { withTimezone: true }),
    confidence: integer("confidence"), // 1-5
    notes: text("notes"),
    lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    taskIdIdx: uniqueIndex("task_progress_task_id_idx").on(table.taskId),
    statusIdx: index("task_progress_status_idx").on(table.status),
  })
);

export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    planId: integer("plan_id")
      .references(() => plans.id, { onDelete: "cascade" })
      .notNull(),
    courseId: text("course_id").notNull(),
    title: text("title").notNull(),
    plannedWeeks: text("planned_weeks").default(""),
    coverageKind: text("coverage_kind").notNull(), // percentage, count, text
    targetMin: numeric("target_min"),
    targetMax: numeric("target_max"),
    targetUnit: text("target_unit"),
    coverageNote: text("coverage_note"),
    referenceUrl: text("reference_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    planCourseIdIdx: uniqueIndex("courses_plan_course_id_idx").on(table.planId, table.courseId),
  })
);

export const courseProgress = pgTable(
  "course_progress",
  {
    id: serial("id").primaryKey(),
    courseId: text("course_id").notNull().unique(),
    actualPercent: numeric("actual_percent"),
    lessonsCompleted: integer("lessons_completed"),
    minutesStudied: integer("minutes_studied").notNull().default(0),
    exercisesDone: integer("exercises_done"),
    lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    courseIdIdx: uniqueIndex("course_progress_course_id_idx").on(table.courseId),
  })
);

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .references(() => plans.id, { onDelete: "cascade" })
    .notNull(),
  weekId: text("week_id"),
  taskId: text("task_id"),
  courseId: text("course_id"),
  date: text("date").notNull(),
  durationMinutes: integer("duration_minutes").notNull(), // strictly positive
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const dsaAttempts = pgTable("dsa_attempts", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .references(() => plans.id, { onDelete: "cascade" })
    .notNull(),
  weekId: text("week_id"),
  taskId: text("task_id"),
  problemTitle: text("problem_title").notNull(),
  pattern: text("pattern").notNull(),
  difficulty: text("difficulty").notNull().default("medium"), // easy, medium, hard
  url: text("url"),
  attemptedAt: timestamp("attempted_at", { withTimezone: true }).defaultNow().notNull(),
  solved: boolean("solved").notNull().default(false),
  solvedIndependently: boolean("solved_independently").notNull().default(false),
  minutesSpent: integer("minutes_spent").notNull().default(0),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  notes: text("notes"),
});

export const designExercises = pgTable("design_exercises", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .references(() => plans.id, { onDelete: "cascade" })
    .notNull(),
  weekId: text("week_id"),
  taskId: text("task_id"),
  subject: text("subject").notNull(),
  exerciseDescription: text("exercise_description").notNull(),
  status: text("status").notNull().default("draft"),
  artifactLink: text("artifact_link"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const evidenceLinks = pgTable("evidence_links", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .references(() => plans.id, { onDelete: "cascade" })
    .notNull(),
  weekId: text("week_id"),
  taskId: text("task_id"),
  label: text("label").notNull(),
  urlOrPath: text("url_or_path").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const checkpointAttestations = pgTable(
  "checkpoint_attestations",
  {
    id: serial("id").primaryKey(),
    planId: integer("plan_id")
      .references(() => plans.id, { onDelete: "cascade" })
      .notNull(),
    weekId: text("week_id").notNull(),
    passed: boolean("passed").notNull().default(false),
    passedAt: timestamp("passed_at", { withTimezone: true }),
    evidenceNotes: text("evidence_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    planWeekCheckpointIdx: uniqueIndex("checkpoint_plan_week_idx").on(
      table.planId,
      table.weekId
    ),
  })
);

export const importBatches = pgTable("import_batches", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .references(() => plans.id, { onDelete: "cascade" })
    .notNull(),
  importedAt: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
  importHash: text("import_hash").notNull(),
  schemaVersion: text("schema_version").notNull().default("1.0"),
  weeksCount: integer("weeks_count").notNull(),
  tasksCount: integer("tasks_count").notNull(),
  coursesCount: integer("courses_count").notNull(),
  summary: text("summary"),
});
