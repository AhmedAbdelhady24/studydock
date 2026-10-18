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
import { BentoOverview } from "@/components/BentoOverview";
import { ProgressTimeline } from "@/components/ProgressTimeline";
import { cn } from "@/lib/utils";

export default function TodayPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<"all" | "required" | "dsa">("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchPlanData = async (silent = false) => {
    try {
      if (!silent && !data) {
        setLoading(true);
      }
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

  const handleSilentUpdate = () => {
    fetchPlanData(true);
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  if (loading && !data) {
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
      {/* Bento Hero & Stats Overview (Inspired by mobile designs Image 1 & 2) */}
      <BentoOverview activeWeek={activeWeek} metrics={metrics} />

      {/* Main Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Active Tasks & Verification (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Items List Header with Kanban / List Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
                Week {activeWeek?.weekNumber} Tasks
              </h2>
              <span className="text-xs font-mono text-zinc-500 font-semibold">
                ({activeWeekTasks.filter((t: any) => t.status === "done").length}/{activeWeekTasks.length} done)
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setTaskFilter("all")}
                  className={cn(
                    "px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200",
                    taskFilter === "all" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold" : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter("required")}
                  className={cn(
                    "px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200",
                    taskFilter === "required" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold" : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  )}
                >
                  Required
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter("dsa")}
                  className={cn(
                    "px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200",
                    taskFilter === "dsa" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold" : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  )}
                >
                  DSA
                </button>
              </div>

              {/* View Switcher: Board (Kanban) vs List */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  className={cn(
                    "px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 transition-all duration-200",
                    viewMode === "kanban"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
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
                    "px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 transition-all duration-200",
                    viewMode === "list"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
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
              onUpdate={handleSilentUpdate}
              onSelectTask={handleOpenTask}
            />
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task: any) => (
                <TaskItem
                  key={task.taskId}
                  task={task}
                  onUpdate={handleSilentUpdate}
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
            onAttestationUpdated={handleSilentUpdate}
          />
        </div>

        {/* Right Column: Progress Checklist Stepper & Focus Timer */}
        <div className="space-y-6">
          <ProgressTimeline
            tasks={activeWeekTasks}
            weekNumber={activeWeek?.weekNumber}
            onSelectTask={handleOpenTask}
          />

          <StudyTimer
            currentWeekId={activeWeek?.weekId}
            onSessionLogged={handleSilentUpdate}
          />

          {/* Compact Phase Progress List */}
          <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215] p-5 text-xs space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
              <span className="font-bold text-zinc-900 dark:text-zinc-200">
                Phase Progress
              </span>
              <Link
                href="/roadmap"
                className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                All 33 Weeks →
              </Link>
            </div>

            <div className="space-y-2.5">
              {(metrics?.phases || []).slice(0, 5).map((p: any) => (
                <div key={p.code} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[180px] font-medium">{p.title}</span>
                    <span className="font-mono text-zinc-500 font-semibold">{p.percentage}%</span>
                  </div>
                  <div className="w-full bg-black/[0.06] dark:bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all"
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
        onUpdate={handleSilentUpdate}
      />
    </div>
  );
}
