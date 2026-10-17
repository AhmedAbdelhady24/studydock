"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  UploadCloud,
  LayoutGrid,
  List,
} from "lucide-react";
import { TaskItem } from "@/components/TaskItem";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskDetailDrawer } from "@/components/TaskDetailDrawer";
import { StudyTimer } from "@/components/StudyTimer";
import { CheckpointBanner } from "@/components/CheckpointBanner";
import { cn } from "@/lib/utils";

export default function TodayPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<"all" | "required" | "dsa">("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchPlanData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/plan");
      if (!res.ok) throw new Error("Failed to load plan data");
      const json = await res.json();
      setData(json);

      // If a task is selected in drawer, update its reference from the fresh data
      if (selectedTask) {
        for (const w of json.weeks || []) {
          const match = (w.tasks || []).find((t: any) => t.taskId === selectedTask.taskId);
          if (match) {
            setSelectedTask(match);
            break;
          }
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
        <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-zinc-500">Loading workspace...</p>
      </div>
    );
  }

  if (!data?.plan) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-lg border border-white/[0.08] bg-[#111317] text-center space-y-5">
        <div className="w-10 h-10 mx-auto rounded-md bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-zinc-300">
          <UploadCloud className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-white">
            No Active Plan Loaded
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Import your 33-week Product Engineer roadmap CSV to start tracking your daily progress.
          </p>
        </div>
        <Link
          href="/import"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white border border-white/[0.1] transition-all"
        >
          <span>Go to Import</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const { metrics, weeks } = data;
  const activeWeek = weeks.find((w: any) => !w.isCompleted) || weeks[0];
  const activeWeekTasks = activeWeek?.tasks || [];
  const requiredTasks = activeWeekTasks.filter((t: any) => t.required);
  const allRequiredDone =
    requiredTasks.length > 0 &&
    requiredTasks.every((t: any) => t.status === "done");

  const filteredTasks =
    taskFilter === "required"
      ? activeWeekTasks.filter((t: any) => t.required)
      : taskFilter === "dsa"
      ? activeWeekTasks.filter((t: any) => t.category === "dsa")
      : activeWeekTasks;

  const handleOpenTask = (task: any) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Week in Flight Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-semibold text-emerald-400">
              Week {activeWeek?.weekNumber}
            </span>
            <span className="text-zinc-600">•</span>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {activeWeek?.title}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {activeWeek?.phaseTitle} • {activeWeek?.targetHours}h target •{" "}
            <span className="text-zinc-200 font-mono font-semibold">
              {activeWeek?.primaryCourses || "General Syllabus"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/weeks/${activeWeek?.weekId}`}
            className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors font-mono"
          >
            <span>Full Week Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
          </Link>
        </div>
      </div>

      {/* Integrated Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 rounded-lg border border-white/[0.08] bg-[#111317] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        <div className="p-4">
          <span className="text-xs text-zinc-400 font-medium block">
            Overall Progress
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white tabular-nums">
              {metrics?.overallPercentage ?? 0}%
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {metrics?.completedTasksCount ?? 0}/{metrics?.totalTasksCount ?? 231} tasks
            </span>
          </div>
        </div>

        <div className="p-4">
          <span className="text-xs text-zinc-400 font-medium block">
            Weeks Completed
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white tabular-nums">
              {metrics?.completedWeeksCount ?? 0}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              of {metrics?.totalWeeksCount ?? 33} passed
            </span>
          </div>
        </div>

        <div className="p-4">
          <span className="text-xs text-zinc-400 font-medium block">
            Time Logged
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white tabular-nums">
              {metrics?.totalHoursStudied ?? 0}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">hours total</span>
          </div>
        </div>

        <div className="p-4">
          <span className="text-xs text-zinc-400 font-medium block">
            DSA Solved
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white tabular-nums">
              {metrics?.distinctDsaSolvedCount ?? 0}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">unique problems</span>
          </div>
        </div>
      </div>

      {/* Main Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Active Tasks & Verification (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Items List Header with Kanban / List Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-200">
                Week {activeWeek?.weekNumber} Tasks
              </h2>
              <span className="text-xs font-mono text-zinc-500">
                ({activeWeekTasks.filter((t: any) => t.status === "done").length}/{activeWeekTasks.length} done)
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Filter Pills */}
              <div className="flex items-center gap-1 text-xs bg-[#101216] p-1 rounded-md border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setTaskFilter("all")}
                  className={cn(
                    "px-2 py-0.5 rounded font-medium transition-colors",
                    taskFilter === "all" ? "bg-white/[0.1] text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter("required")}
                  className={cn(
                    "px-2 py-0.5 rounded font-medium transition-colors",
                    taskFilter === "required" ? "bg-white/[0.1] text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Required
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter("dsa")}
                  className={cn(
                    "px-2 py-0.5 rounded font-medium transition-colors",
                    taskFilter === "dsa" ? "bg-white/[0.1] text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  DSA
                </button>
              </div>

              {/* View Switcher: Board (Kanban) vs List */}
              <div className="flex items-center gap-1 bg-[#101216] p-1 rounded-md border border-white/[0.08] text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  className={cn(
                    "px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors",
                    viewMode === "kanban"
                      ? "bg-white/[0.12] text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                  title="Switch to Kanban board view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Board</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors",
                    viewMode === "list"
                      ? "bg-white/[0.12] text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                  title="Switch to List view"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Display: Kanban Board or List */}
          {viewMode === "kanban" ? (
            <KanbanBoard
              tasks={filteredTasks}
              onUpdate={fetchPlanData}
              onSelectTask={handleOpenTask}
            />
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task: any) => (
                <TaskItem
                  key={task.taskId}
                  task={task}
                  onUpdate={fetchPlanData}
                  onSelectTask={handleOpenTask}
                />
              ))}
            </div>
          )}

          {/* Verification Milestone Seal */}
          <CheckpointBanner
            weekId={activeWeek?.weekId}
            exitCriteria={activeWeek?.exitCriteria}
            allRequiredTasksCompleted={allRequiredDone}
            isPassed={activeWeek?.checkpointPassed || false}
            passedAt={activeWeek?.checkpointPassedAt}
            evidenceNotes={activeWeek?.checkpointEvidence}
            onAttestationUpdated={fetchPlanData}
          />
        </div>

        {/* Right Column: Focus Timer & Course Targets */}
        <div className="space-y-6">
          <StudyTimer
            currentWeekId={activeWeek?.weekId}
            onSessionLogged={fetchPlanData}
          />

          {/* Compact Phase Progress List */}
          <div className="rounded-lg border border-white/[0.08] bg-[#111317] p-4 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="font-semibold text-zinc-300">
                Phase Progress
              </span>
              <Link
                href="/roadmap"
                className="text-[11px] text-zinc-400 hover:text-white transition-colors"
              >
                All 33 Weeks →
              </Link>
            </div>

            <div className="space-y-2.5">
              {(metrics?.phases || []).slice(0, 5).map((p: any) => (
                <div key={p.code} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-300 truncate max-w-[180px]">{p.title}</span>
                    <span className="font-mono text-zinc-500">{p.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-emerald-500/80 h-1 rounded-full transition-all"
                      style={{ width: `${p.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={fetchPlanData}
      />
    </div>
  );
}
