CREATE TABLE "checkpoint_attestations" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"week_id" text NOT NULL,
	"passed" boolean DEFAULT false NOT NULL,
	"passed_at" timestamp with time zone,
	"evidence_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"actual_percent" numeric,
	"lessons_completed" integer,
	"minutes_studied" integer DEFAULT 0 NOT NULL,
	"exercises_done" integer,
	"last_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_progress_course_id_unique" UNIQUE("course_id")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"course_id" text NOT NULL,
	"title" text NOT NULL,
	"planned_weeks" text DEFAULT '',
	"coverage_kind" text NOT NULL,
	"target_min" numeric,
	"target_max" numeric,
	"target_unit" text,
	"coverage_note" text,
	"reference_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"week_id" text,
	"task_id" text,
	"subject" text NOT NULL,
	"exercise_description" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"artifact_link" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dsa_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"week_id" text,
	"task_id" text,
	"problem_title" text NOT NULL,
	"pattern" text NOT NULL,
	"difficulty" text DEFAULT 'medium' NOT NULL,
	"url" text,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"solved" boolean DEFAULT false NOT NULL,
	"solved_independently" boolean DEFAULT false NOT NULL,
	"minutes_spent" integer DEFAULT 0 NOT NULL,
	"reviewed_at" timestamp with time zone,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "evidence_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"week_id" text,
	"task_id" text,
	"label" text NOT NULL,
	"url_or_path" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "import_batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"import_hash" text NOT NULL,
	"schema_version" text DEFAULT '1.0' NOT NULL,
	"weeks_count" integer NOT NULL,
	"tasks_count" integer NOT NULL,
	"courses_count" integer NOT NULL,
	"summary" text
);
--> statement-breakpoint
CREATE TABLE "phases" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"display_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_date" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"imported_source_hash" text,
	"current_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "plans_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"week_id" text,
	"task_id" text,
	"course_id" text,
	"date" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"completed_at" timestamp with time zone,
	"confidence" integer,
	"notes" text,
	"last_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "task_progress_task_id_unique" UNIQUE("task_id")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"week_id" text NOT NULL,
	"task_id" text NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 1 NOT NULL,
	"dsa_target_count" integer,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weeks" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"week_id" text NOT NULL,
	"week_number" integer NOT NULL,
	"phase" text NOT NULL,
	"phase_title" text NOT NULL,
	"title" text NOT NULL,
	"target_hours" numeric DEFAULT '0' NOT NULL,
	"primary_courses" text DEFAULT '',
	"concepts" text DEFAULT '',
	"exit_criteria" text DEFAULT '',
	"source_anchor" text DEFAULT '',
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "checkpoint_attestations" ADD CONSTRAINT "checkpoint_attestations_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_exercises" ADD CONSTRAINT "design_exercises_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dsa_attempts" ADD CONSTRAINT "dsa_attempts_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_links" ADD CONSTRAINT "evidence_links_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_batches" ADD CONSTRAINT "import_batches_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phases" ADD CONSTRAINT "phases_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weeks" ADD CONSTRAINT "weeks_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "checkpoint_plan_week_idx" ON "checkpoint_attestations" USING btree ("plan_id","week_id");--> statement-breakpoint
CREATE UNIQUE INDEX "course_progress_course_id_idx" ON "course_progress" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "courses_plan_course_id_idx" ON "courses" USING btree ("plan_id","course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "plans_slug_idx" ON "plans" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "task_progress_task_id_idx" ON "task_progress" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_progress_status_idx" ON "task_progress" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "tasks_plan_task_id_idx" ON "tasks" USING btree ("plan_id","task_id");--> statement-breakpoint
CREATE INDEX "tasks_week_id_idx" ON "tasks" USING btree ("week_id");--> statement-breakpoint
CREATE INDEX "tasks_category_idx" ON "tasks" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "weeks_plan_week_id_idx" ON "weeks" USING btree ("plan_id","week_id");--> statement-breakpoint
CREATE UNIQUE INDEX "weeks_plan_week_num_idx" ON "weeks" USING btree ("plan_id","week_number");