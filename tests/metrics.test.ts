import { describe, it, expect } from "vitest";
import { computeWeekCompletion, calculateDashboardMetrics, TaskWithProgress, WeekWithDetails } from "../src/lib/metrics";

describe("StudyDock Progress & Metrics Engine", () => {
  it("should calculate week completion strictly: requires all required tasks done AND checkpoint attested", () => {
    const tasks: TaskWithProgress[] = [
      {
        id: 1,
        taskId: "t1",
        weekId: "w1",
        category: "course",
        title: "Lecture",
        description: "",
        required: true,
        sortOrder: 1,
        dsaTargetCount: null,
        archivedAt: null,
        status: "done",
        completedAt: new Date(),
        confidence: 5,
        notes: null,
      },
      {
        id: 2,
        taskId: "t2",
        weekId: "w1",
        category: "checkpoint",
        title: "Checkpoint",
        description: "",
        required: true,
        sortOrder: 2,
        dsaTargetCount: null,
        archivedAt: null,
        status: "done",
        completedAt: new Date(),
        confidence: 5,
        notes: null,
      },
    ];

    // Case 1: Tasks done, but checkpoint NOT attested passed -> NOT complete
    const res1 = computeWeekCompletion(tasks, false);
    expect(res1.isCompleted).toBe(false);
    expect(res1.requiredCount).toBe(2);
    expect(res1.doneRequiredCount).toBe(2);

    // Case 2: Tasks done AND checkpoint attested passed -> COMPLETE
    const res2 = computeWeekCompletion(tasks, true);
    expect(res2.isCompleted).toBe(true);

    // Case 3: One task not done -> NOT complete even if checkpoint passed
    tasks[0].status = "in_progress";
    const res3 = computeWeekCompletion(tasks, true);
    expect(res3.isCompleted).toBe(false);
    expect(res3.doneRequiredCount).toBe(1);
  });

  it("should not let non-required tasks block week completion", () => {
    const tasks: TaskWithProgress[] = [
      {
        id: 1,
        taskId: "t1",
        weekId: "w1",
        category: "course",
        title: "Required task",
        description: "",
        required: true,
        sortOrder: 1,
        dsaTargetCount: null,
        archivedAt: null,
        status: "done",
        completedAt: new Date(),
        confidence: 5,
        notes: null,
      },
      {
        id: 2,
        taskId: "t2",
        weekId: "w1",
        category: "other",
        title: "Optional bonus",
        description: "",
        required: false,
        sortOrder: 2,
        dsaTargetCount: null,
        archivedAt: null,
        status: "not_started",
        completedAt: null,
        confidence: null,
        notes: null,
      },
    ];

    const res = computeWeekCompletion(tasks, true);
    expect(res.isCompleted).toBe(true);
    expect(res.requiredCount).toBe(1);
    expect(res.doneRequiredCount).toBe(1);
  });

  it("should handle empty datasets without division by zero errors", () => {
    const emptyMetrics = calculateDashboardMetrics([], 0, 0, 0);

    expect(emptyMetrics.totalActiveRequiredTasks).toBe(0);
    expect(emptyMetrics.doneRequiredTasks).toBe(0);
    expect(emptyMetrics.taskCompletionRatio).toBe(0);
    expect(emptyMetrics.taskCompletionPercentage).toBe(0);
    expect(emptyMetrics.fullyCompletedWeeks).toBe(0);
    expect(emptyMetrics.totalStudiedHours).toBe(0);
  });
});
