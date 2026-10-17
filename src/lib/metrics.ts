export interface TaskWithProgress {
  id: number;
  taskId: string;
  weekId: string;
  category: string;
  title: string;
  description: string;
  required: boolean;
  sortOrder: number;
  dsaTargetCount: number | null;
  archivedAt: Date | null;
  status: "not_started" | "in_progress" | "done" | "blocked";
  completedAt: Date | null;
  confidence: number | null;
  notes: string | null;
  primaryCourses?: string;
  concepts?: string;
  weekNumber?: number;
  weekTitle?: string;
  phaseTitle?: string;
  exitCriteria?: string;
  resourceName?: string;
  resourceCategory?: "course" | "dsa" | "architecture" | "implementation" | "quality" | "checkpoint" | "general";
  resourceLabel?: string;
  referenceUrl?: string;
  topicBadge?: string;
}

export interface WeekWithDetails {
  id: number;
  weekId: string;
  weekNumber: number;
  phase: string;
  phaseTitle: string;
  title: string;
  targetHours: number;
  primaryCourses: string;
  concepts: string;
  exitCriteria: string;
  sourceAnchor: string;
  archivedAt: Date | null;
  isCompleted: boolean;
  checkpointPassed: boolean;
  requiredTasksCount: number;
  doneTasksCount: number;
  tasks: TaskWithProgress[];
}

export interface PhaseMetrics {
  code: string;
  title: string;
  totalWeeks: number;
  completedWeeks: number;
  totalRequiredTasks: number;
  doneRequiredTasks: number;
  taskCompletionPercent: number;
}

export interface DashboardMetrics {
  totalActiveRequiredTasks: number;
  doneRequiredTasks: number;
  taskCompletionRatio: number; // 0 to 1
  taskCompletionPercentage: number; // 0 to 100
  totalWeeks: number;
  fullyCompletedWeeks: number;
  totalStudiedMinutes: number;
  totalStudiedHours: number;
  dsaDistinctSolved: number;
  dsaTotalAttempts: number;
  phaseProgress: PhaseMetrics[];
  categoryBreakdown: Record<string, { total: number; done: number }>;
}

export function computeWeekCompletion(
  weekTasks: TaskWithProgress[],
  checkpointPassed: boolean
): { isCompleted: boolean; requiredCount: number; doneRequiredCount: number } {
  const activeTasks = weekTasks.filter((t) => !t.archivedAt);
  const requiredTasks = activeTasks.filter((t) => t.required);
  const doneRequired = requiredTasks.filter((t) => t.status === "done");

  const allRequiredDone =
    requiredTasks.length > 0 && doneRequired.length === requiredTasks.length;

  const isCompleted = allRequiredDone && checkpointPassed;

  return {
    isCompleted,
    requiredCount: requiredTasks.length,
    doneRequiredCount: doneRequired.length,
  };
}

export function calculateDashboardMetrics(
  weeksData: WeekWithDetails[],
  totalStudiedMinutes: number,
  distinctSolvedDsaCount: number,
  totalDsaAttemptsCount: number
): DashboardMetrics {
  let totalActiveRequired = 0;
  let doneRequired = 0;
  let completedWeeksCount = 0;
  const categoryMap: Record<string, { total: number; done: number }> = {};
  const phaseMap = new Map<string, { title: string; weeks: WeekWithDetails[] }>();

  for (const w of weeksData) {
    if (w.archivedAt) continue;

    if (w.isCompleted) {
      completedWeeksCount++;
    }

    // Group by phase
    if (!phaseMap.has(w.phase)) {
      phaseMap.set(w.phase, { title: w.phaseTitle, weeks: [] });
    }
    phaseMap.get(w.phase)!.weeks.push(w);

    for (const t of w.tasks) {
      if (t.archivedAt) continue;

      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { total: 0, done: 0 };
      }
      categoryMap[t.category].total++;
      if (t.status === "done") {
        categoryMap[t.category].done++;
      }

      if (t.required) {
        totalActiveRequired++;
        if (t.status === "done") {
          doneRequired++;
        }
      }
    }
  }

  const taskCompletionRatio =
    totalActiveRequired > 0 ? doneRequired / totalActiveRequired : 0;

  const phaseProgress: PhaseMetrics[] = [];
  for (const [code, p] of phaseMap.entries()) {
    let pTotalReq = 0;
    let pDoneReq = 0;
    let pCompletedWeeks = 0;

    for (const w of p.weeks) {
      if (w.isCompleted) pCompletedWeeks++;
      pTotalReq += w.requiredTasksCount;
      pDoneReq += w.doneTasksCount;
    }

    const pct = pTotalReq > 0 ? Math.round((pDoneReq / pTotalReq) * 100) : 0;
    phaseProgress.push({
      code,
      title: p.title,
      totalWeeks: p.weeks.length,
      completedWeeks: pCompletedWeeks,
      totalRequiredTasks: pTotalReq,
      doneRequiredTasks: pDoneReq,
      taskCompletionPercent: pct,
    });
  }

  return {
    totalActiveRequiredTasks: totalActiveRequired,
    doneRequiredTasks: doneRequired,
    taskCompletionRatio,
    taskCompletionPercentage: Math.round(taskCompletionRatio * 100),
    totalWeeks: weeksData.filter((w) => !w.archivedAt).length,
    fullyCompletedWeeks: completedWeeksCount,
    totalStudiedMinutes,
    totalStudiedHours: Math.round((totalStudiedMinutes / 60) * 10) / 10,
    dsaDistinctSolved: distinctSolvedDsaCount,
    dsaTotalAttempts: totalDsaAttemptsCount,
    phaseProgress,
    categoryBreakdown: categoryMap,
  };
}
