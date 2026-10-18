import { describe, it, expect } from "vitest";
import { executeSearch, NAV_SHORTCUTS } from "../src/lib/search";

describe("executeSearch", () => {
  const mockWeeks = [
    {
      weekId: "w01",
      weekNumber: 1,
      title: "Foundations & Clean Code",
      phaseTitle: "Phase 1: Foundations",
      targetHours: 15,
      concepts: "SOLID principles, unit testing, refactoring",
      primaryCourses: "Clean Code",
      exitCriteria: "Can write unit tests with 80% coverage",
    },
    {
      weekId: "w02",
      weekNumber: 2,
      title: "Data Structures & Two Pointers",
      phaseTitle: "Phase 1: Foundations",
      targetHours: 18,
      concepts: "arrays, two pointers, sliding window",
      primaryCourses: "Grokking Algorithms",
      exitCriteria: "Solve 10 LeetCode mediums",
    },
  ];

  const mockTasks = [
    {
      taskId: "t01-01",
      weekId: "w01",
      title: "Read Clean Code Chapters 1-3",
      description: "Focus on meaningful names and small functions",
      category: "course",
      required: true,
      sortOrder: 1,
    },
    {
      taskId: "t02-01",
      weekId: "w02",
      title: "Two Pointers: Valid Palindrome & Container With Most Water",
      description: "Implement two pointers technique on sorted arrays",
      category: "dsa",
      required: true,
      sortOrder: 1,
    },
  ];

  const mockCourses = [
    {
      courseId: "clean-code",
      title: "Clean Code Handbook",
      plannedWeeks: "Weeks 1-4",
      coverageKind: "percentage",
      coverageNote: "Essential handbook on agile software craftsmanship",
    },
  ];

  const mockProgressMap = new Map([
    ["t01-01", { status: "done" }],
    ["t02-01", { status: "in_progress" }],
  ]);

  it("returns default shortcuts and tasks when query is empty", () => {
    const results = executeSearch({
      query: "",
      weeks: mockWeeks,
      tasks: mockTasks,
      taskProgressMap: mockProgressMap,
      courses: mockCourses,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === "nav")).toBe(true);
    expect(results.some((r) => r.type === "task")).toBe(true);
  });

  it("finds tasks by keyword and extracts snippet", () => {
    const results = executeSearch({
      query: "palindrome",
      weeks: mockWeeks,
      tasks: mockTasks,
      taskProgressMap: mockProgressMap,
      courses: mockCourses,
    });

    expect(results.length).toBeGreaterThan(0);
    const first = results[0];
    expect(first.type).toBe("task");
    expect(first.title).toContain("Valid Palindrome");
    expect(first.status).toBe("in_progress");
    expect(first.badge).toBe("DSA");
  });

  it("finds weeks by title or week number", () => {
    const results = executeSearch({
      query: "week 2",
      weeks: mockWeeks,
      tasks: mockTasks,
      taskProgressMap: mockProgressMap,
      courses: mockCourses,
    });

    expect(results.some((r) => r.type === "week" && r.title.includes("Week 2"))).toBe(true);
  });

  it("finds courses by title", () => {
    const results = executeSearch({
      query: "craftsmanship",
      weeks: mockWeeks,
      tasks: mockTasks,
      taskProgressMap: mockProgressMap,
      courses: mockCourses,
    });

    expect(results.some((r) => r.type === "course" && r.title.includes("Clean Code"))).toBe(true);
  });

  it("finds navigation shortcuts by keyword", () => {
    const results = executeSearch({
      query: "leetcode",
      weeks: mockWeeks,
      tasks: mockTasks,
      taskProgressMap: mockProgressMap,
      courses: mockCourses,
    });

    expect(results.some((r) => r.type === "nav" && r.url === "/dsa")).toBe(true);
  });
});
