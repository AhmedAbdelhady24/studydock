import { NextResponse } from "next/server";
import { db } from "@/db";
import { plans, weeks, tasks, taskProgress, checkpointAttestations, studySessions, dsaAttempts } from "@/db/schema";
import { eq, isNull, asc } from "drizzle-orm";
import { calculateDashboardMetrics, WeekWithDetails, TaskWithProgress } from "@/lib/metrics";
import { getTaskResource } from "@/lib/taskResources";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const plan = await db.query.plans.findFirst({
      where: isNull(plans.archivedAt),
    });

    if (!plan) {
      return NextResponse.json({
        plan: null,
        metrics: calculateDashboardMetrics([], 0, 0, 0),
        weeks: [],
      });
    }

    const dbWeeks = await db.query.weeks.findMany({
      where: eq(weeks.planId, plan.id),
      orderBy: [asc(weeks.weekNumber)],
    });

    const dbTasks = await db.query.tasks.findMany({
      where: eq(tasks.planId, plan.id),
      orderBy: [asc(tasks.sortOrder)],
    });

    const dbProgress = await db.query.taskProgress.findMany();
    const progressMap = new Map(dbProgress.map((p) => [p.taskId, p]));

    const dbCheckpoints = await db.query.checkpointAttestations.findMany({
      where: eq(checkpointAttestations.planId, plan.id),
    });
    const checkpointMap = new Map(dbCheckpoints.map((c) => [c.weekId, c]));

    const weeksData: WeekWithDetails[] = dbWeeks.map((w) => {
      const weekTasksList: TaskWithProgress[] = dbTasks
        .filter((t) => t.weekId === w.weekId)
        .map((t) => {
          const prog = progressMap.get(t.taskId);
          const resource = getTaskResource(
            { category: t.category, title: t.title, description: t.description },
            {
              weekNumber: w.weekNumber,
              primaryCourses: w.primaryCourses || "",
              phaseTitle: w.phaseTitle,
              concepts: w.concepts || "",
            }
          );
          return {
            id: t.id,
            taskId: t.taskId,
            weekId: t.weekId,
            category: t.category,
            title: t.title,
            description: t.description,
            required: t.required,
            sortOrder: t.sortOrder,
            dsaTargetCount: t.dsaTargetCount,
            archivedAt: t.archivedAt,
            status: (prog?.status as any) || "not_started",
            completedAt: prog?.completedAt || null,
            confidence: prog?.confidence || null,
            notes: prog?.notes || null,
            primaryCourses: w.primaryCourses || "",
            concepts: w.concepts || "",
            weekNumber: w.weekNumber,
            weekTitle: w.title,
            phaseTitle: w.phaseTitle,
            exitCriteria: w.exitCriteria || "",
            resourceName: resource.resourceName,
            resourceCategory: resource.resourceCategory,
            resourceLabel: resource.resourceLabel,
            referenceUrl: resource.referenceUrl,
            topicBadge: resource.topicBadge,
            taskConcepts: resource.taskConcepts,
          };
        });

      const checkpoint = checkpointMap.get(w.weekId);
      const checkpointPassed = Boolean(checkpoint?.passed);

      const activeTasks = weekTasksList.filter((t) => !t.archivedAt);
      const reqTasks = activeTasks.filter((t) => t.required);
      const doneReqTasks = reqTasks.filter((t) => t.status === "done");
      const isCompleted =
        reqTasks.length > 0 &&
        doneReqTasks.length === reqTasks.length &&
        checkpointPassed;

      return {
        id: w.id,
        weekId: w.weekId,
        weekNumber: w.weekNumber,
        phase: w.phase,
        phaseTitle: w.phaseTitle,
        title: w.title,
        targetHours: Number(w.targetHours),
        primaryCourses: w.primaryCourses || "",
        concepts: w.concepts || "",
        exitCriteria: w.exitCriteria || "",
        sourceAnchor: w.sourceAnchor || "",
        archivedAt: w.archivedAt,
        isCompleted,
        checkpointPassed,
        checkpointPassedAt: checkpoint?.passedAt || null,
        checkpointEvidence: checkpoint?.evidenceNotes || null,
        requiredTasksCount: reqTasks.length,
        doneTasksCount: doneReqTasks.length,
        tasksCount: weekTasksList.length,
        completedTasksCount: doneReqTasks.length,
        tasks: weekTasksList,
      };
    });

    const sessions = await db.query.studySessions.findMany({
      where: eq(studySessions.planId, plan.id),
    });
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    const attempts = await db.query.dsaAttempts.findMany({
      where: eq(dsaAttempts.planId, plan.id),
    });
    const distinctSolved = new Set(
      attempts.filter((a) => a.solved).map((a) => a.problemTitle.trim().toLowerCase())
    ).size;

    const metrics = calculateDashboardMetrics(
      weeksData,
      totalMinutes,
      distinctSolved,
      attempts.length
    );

    const enhancedMetrics = {
      ...metrics,
      overallPercentage: metrics.taskCompletionPercentage,
      completedTasksCount: metrics.doneRequiredTasks,
      totalTasksCount: metrics.totalActiveRequiredTasks,
      completedWeeksCount: metrics.fullyCompletedWeeks,
      totalWeeksCount: metrics.totalWeeks,
      totalHoursStudied: metrics.totalStudiedHours,
      distinctDsaSolvedCount: metrics.dsaDistinctSolved,
      phases: metrics.phaseProgress.map((p) => ({
        ...p,
        percentage: p.taskCompletionPercent,
      })),
    };

    return NextResponse.json({
      plan,
      metrics: enhancedMetrics,
      weeks: weeksData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
