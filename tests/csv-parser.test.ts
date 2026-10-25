import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { parsePlanImportCsv, parseCourseTargetsCsv } from "../src/lib/csv-parser";

describe("StudyDock CSV Parser & Data Contract", () => {
  const fixturesDir = path.resolve(__dirname, "../data/import");
  const planCsvPath = path.join(fixturesDir, "plan_import.csv");
  const coursesCsvPath = path.join(fixturesDir, "course_targets.csv");

  it("should successfully parse the canonical 33-week plan fixture (33 weeks, 231 tasks)", () => {
    const csvContent = fs.readFileSync(planCsvPath, "utf-8");
    const result = parsePlanImportCsv(csvContent);

    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).toHaveLength(231);

    // Verify exactly 33 distinct weeks
    const distinctWeeks = new Set(result.data.map((r) => r.week_id));
    expect(distinctWeeks.size).toBe(33);

    // Verify task categories
    const checkpoints = result.data.filter((r) => r.category === "checkpoint");
    expect(checkpoints).toHaveLength(33);

    const dsaTasks = result.data.filter((r) => r.category === "dsa");
    expect(dsaTasks).toHaveLength(33);

    const designTasks = result.data.filter((r) => r.category === "design");
    expect(designTasks).toHaveLength(33);

    const implementationTasks = result.data.filter((r) => r.category === "implementation");
    expect(implementationTasks).toHaveLength(66);
  });

  it("should successfully parse the course targets fixture (16 course targets)", () => {
    const csvContent = fs.readFileSync(coursesCsvPath, "utf-8");
    const result = parseCourseTargetsCsv(csvContent);

    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).toHaveLength(16);

    const kinds = new Set(result.data.map((r) => r.coverage_kind));
    expect(kinds.has("percentage")).toBe(true);
  });

  it("should reject CSV with missing required headers", () => {
    const invalidCsv = "week_id,task_id\nw01,t01\n";
    const result = parsePlanImportCsv(invalidCsv);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toContain("Missing required header");
  });

  it("should reject invalid category with exact row and column diagnostics", () => {
    const sampleCsv = `plan_slug,week_id,week_number,week_title,phase,phase_title,primary_courses,concepts,exit_criteria,target_hours,source_anchor,task_id,category,task_title,description,required,sort_order,dsa_target_count,initial_checked
test-plan,test-w01,1,Week 1,I,Phase 1,Course,Concepts,Exit,10,w01,task-01,unsupported_category,Title,Desc,true,1,,false`;

    const result = parsePlanImportCsv(sampleCsv);
    expect(result.success).toBe(false);
    expect(result.errors.some((e) => e.column === "category" && e.row === 2)).toBe(true);
  });

  it("should detect duplicate task_id across rows", () => {
    const duplicateCsv = `plan_slug,week_id,week_number,week_title,phase,phase_title,primary_courses,concepts,exit_criteria,target_hours,source_anchor,task_id,category,task_title,description,required,sort_order,dsa_target_count,initial_checked
test-plan,test-w01,1,Week 1,I,Phase 1,Course,Concepts,Exit,10,w01,task-dup,dsa,Title 1,Desc,true,1,2,false
test-plan,test-w01,1,Week 1,I,Phase 1,Course,Concepts,Exit,10,w01,task-dup,dsa,Title 2,Desc,true,2,2,false`;

    const result = parsePlanImportCsv(duplicateCsv);
    expect(result.success).toBe(false);
    expect(result.errors.some((e) => e.column === "task_id" && e.message.includes("Duplicate"))).toBe(true);
  });

  it("should detect inconsistent repeated week metadata for the same week_id", () => {
    const inconsistentCsv = `plan_slug,week_id,week_number,week_title,phase,phase_title,primary_courses,concepts,exit_criteria,target_hours,source_anchor,task_id,category,task_title,description,required,sort_order,dsa_target_count,initial_checked
test-plan,test-w01,1,Original Title,I,Phase 1,Course,Concepts,Exit,10,w01,task-01,dsa,Title,Desc,true,1,2,false
test-plan,test-w01,1,Changed Title,I,Phase 1,Course,Concepts,Exit,10,w01,task-02,dsa,Title,Desc,true,2,2,false`;

    const result = parsePlanImportCsv(inconsistentCsv);
    expect(result.success).toBe(false);
    expect(result.errors.some((e) => e.column === "week_id" && e.message.includes("Inconsistent"))).toBe(true);
  });

  it("should reject malformed RFC 4180 quotes", () => {
    const malformedCsv = `plan_slug,week_id,week_number,week_title,phase,phase_title,primary_courses,concepts,exit_criteria,target_hours,source_anchor,task_id,category,task_title,description,required,sort_order,dsa_target_count,initial_checked
test-plan,test-w01,1,"Unclosed quote,I,Phase 1,Course,Concepts,Exit,10,w01,task-01,dsa,Title,Desc,true,1,2,false`;

    const result = parsePlanImportCsv(malformedCsv);
    expect(result.success).toBe(false);
    expect(result.errors[0].message).toContain("Malformed CSV");
  });

  it("should validate the updated 33-week core template with 557 tasks and 18 courses", () => {
    const readyPlanPath = path.resolve(__dirname, "../data/import-ready/plan_template.csv");
    const readyCoursesPath = path.resolve(__dirname, "../data/import-ready/courses_template.csv");

    const planContent = fs.readFileSync(readyPlanPath, "utf-8");
    const coursesContent = fs.readFileSync(readyCoursesPath, "utf-8");

    const planRes = parsePlanImportCsv(planContent);
    expect(planRes.success).toBe(true);
    expect(planRes.data).toHaveLength(557);

    const distinctWeeks = new Set(planRes.data.map((r) => r.week_id));
    expect(distinctWeeks.size).toBe(33);

    const optionalTasks = planRes.data.filter((r) => !r.required);
    expect(optionalTasks.length).toBeGreaterThanOrEqual(14);

    const coursesRes = parseCourseTargetsCsv(coursesContent);
    expect(coursesRes.success).toBe(true);
    expect(coursesRes.data).toHaveLength(18);

    const harness = coursesRes.data.find((c) => c.course_id.includes("harness"));
    expect(harness?.coverage_kind).toBe("count");
    expect(harness?.target_max).toBe(10);
  });

  it("should validate the separate 6-week optional AI/FDE track templates", () => {
    const fdePlanPath = path.resolve(__dirname, "../data/optional_ai_fde_6_weeks/plan_template.csv");
    const fdeCoursesPath = path.resolve(__dirname, "../data/optional_ai_fde_6_weeks/courses_template.csv");

    const planContent = fs.readFileSync(fdePlanPath, "utf-8");
    const coursesContent = fs.readFileSync(fdeCoursesPath, "utf-8");

    const planRes = parsePlanImportCsv(planContent);
    expect(planRes.success).toBe(true);
    expect(planRes.data).toHaveLength(42);

    const distinctWeeks = new Set(planRes.data.map((r) => r.week_id));
    expect(distinctWeeks.size).toBe(6);

    const coursesRes = parseCourseTargetsCsv(coursesContent);
    expect(coursesRes.success).toBe(true);
    expect(coursesRes.data).toHaveLength(4);
  });
});
