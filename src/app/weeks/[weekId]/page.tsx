"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  LayoutGrid,
  List,
} from "lucide-react";
import { TaskItem } from "@/components/TaskItem";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskDetailDrawer } from "@/components/TaskDetailDrawer";
import { CheckpointBanner } from "@/components/CheckpointBanner";
import { cn } from "@/lib/utils";

export default function WeekDetailPage() {
  const params = useParams();
  const weekId = params.weekId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadData = async (silent = false) => {
    try {
      if (!silent && !data) {
        setLoading(true);
      }
      const res = await fetch("/api/plan");
      const json = await res.json();
      setData(json);

      if (selectedTask) {
        for (const w of json.weeks || []) {
          const match = (w.tasks || []).find((t: any) => t.taskId === selectedTask.taskId);
          if (match) {
            setSelectedTask(match);
            break;
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSilentUpdate = () => {
    loadData(true);
  };

  useEffect(() => {
    loadData();
  }, [weekId]);

  useEffect(() => {
    if (typeof window !== "undefined" && data) {
      const searchParams = new URLSearchParams(window.location.search);
      const targetTaskId = searchParams.get("taskId");
      if (targetTaskId) {
        for (const w of data.weeks || []) {
          const match = (w.tasks || []).find((t: any) => t.taskId === targetTaskId);
          if (match) {
            setSelectedTask(match);
            setIsDrawerOpen(true);
            break;
          }
        }
      }
    }
  }, [data, weekId]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-6 h-6 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
        <p className="text-xs font-mono text-zinc-500">Loading week details...</p>
      </div>
    );
  }

  const weeks = data?.weeks || [];
  const currentWeekIndex = weeks.findIndex((w: any) => w.weekId === weekId);
  const currentWeek = weeks[currentWeekIndex] || weeks[0];

  if (!currentWeek) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-zinc-400">Week not found: {weekId}</p>
        <Link href="/roadmap" className="text-xs text-blue-400 hover:underline font-mono">
          Return to Roadmap
        </Link>
      </div>
    );
  }

  const prevWeek = currentWeekIndex > 0 ? weeks[currentWeekIndex - 1] : null;
  const nextWeek =
    currentWeekIndex < weeks.length - 1 ? weeks[currentWeekIndex + 1] : null;

  const tasksList = currentWeek.tasks || [];
  const requiredTasks = tasksList.filter((t: any) => t.required);
  const allRequiredDone =
    requiredTasks.length > 0 &&
    requiredTasks.every((t: any) => t.status === "done");

  const filteredTasks =
    categoryFilter === "all"
      ? tasksList
      : tasksList.filter((t: any) => t.category === categoryFilter);

  const categories = Array.from(new Set(tasksList.map((t: any) => t.category)));

  const handleOpenTask = (task: any) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
        <Link
          href="/roadmap"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Curriculum Roadmap</span>
        </Link>

        <div className="flex items-center gap-2">
          {prevWeek && (
            <Link
              href={`/weeks/${prevWeek.weekId}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/[0.2] text-zinc-700 dark:text-zinc-300 transition-colors font-mono text-xs font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>W{prevWeek.weekNumber.toString().padStart(2, "0")}</span>
            </Link>
          )}
          {nextWeek && (
            <Link
              href={`/weeks/${nextWeek.weekId}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/[0.2] text-zinc-700 dark:text-zinc-300 transition-colors font-mono text-xs font-semibold"
            >
              <span>W{nextWeek.weekNumber.toString().padStart(2, "0")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Week Header Banner */}
      <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215] p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12] px-3 py-0.5 rounded-full">
                WEEK {currentWeek.weekNumber.toString().padStart(2, "0")}
              </span>
              <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 bg-black/[0.04] dark:bg-white/[0.04] px-3 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.06] font-medium">
                {currentWeek.phaseTitle}
              </span>
              {currentWeek.isCompleted && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 border border-black/[0.08] dark:border-white/[0.08] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Passed</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {currentWeek.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.02] px-4 py-2 text-right font-mono text-xs shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block uppercase font-semibold">Target Pace</span>
              <span className="font-extrabold text-zinc-900 dark:text-zinc-100">{currentWeek.targetHours}h / week</span>
            </div>

            <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.02] px-4 py-2 text-right font-mono text-xs shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block uppercase font-semibold">Progress</span>
              <span className="font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {currentWeek.completedTasksCount} / {currentWeek.tasksCount} done
              </span>
            </div>
          </div>
        </div>

        {/* Primary Courses & Concepts */}
        {currentWeek.workload && (
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 text-sm space-y-2">
            <h2 className="font-semibold">Viewing & practice budget</h2>
            <p>{currentWeek.workload.required_viewing_hours.toFixed(2)}h required viewing · {currentWeek.workload.optional_viewing_hours.toFixed(2)}h optional viewing, measured at 1×.</p>
            <p>{currentWeek.workload.allocated_practice_hours.toFixed(2)}h estimated practice · {currentWeek.workload.required_total_estimated_hours.toFixed(2)}h proposed required total / {currentWeek.targetHours}h target.</p>
            <p className="text-xs text-zinc-500">Verified bundle snapshot. Practice timing is unverified; compare with your real study sessions. <Link href="/library" className="underline">View full library and workload</Link></p>
          </div>
        )}
        <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 font-semibold block mb-1">
              Primary Course References:
            </span>
            <p className="text-zinc-900 dark:text-zinc-200 font-mono text-xs font-bold">
              {currentWeek.primaryCourses || "Standard Systems Engineering"}
            </p>
          </div>

          {currentWeek.concepts && (
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 font-semibold block mb-1">
                Core Engineering Concepts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentWeek.concepts.split(",").map((c: string, idx: number) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] bg-black/[0.04] dark:bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.06] text-zinc-700 dark:text-zinc-300 font-medium"
                  >
                    {c.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exit Checkpoint Gatekeeper */}
      <CheckpointBanner
        weekId={currentWeek.weekId}
        exitCriteria={currentWeek.exitCriteria}
        allRequiredTasksCompleted={allRequiredDone}
        isPassed={currentWeek.checkpointPassed || false}
        passedAt={currentWeek.checkpointPassedAt}
        evidenceNotes={currentWeek.checkpointEvidence}
        onAttestationUpdated={handleSilentUpdate}
      />

      {/* Action Items Header & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
            Action Items & Deliverables ({filteredTasks.length})
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-xs">
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={cn(
                  "px-3 py-0.5 rounded-full font-semibold transition-all duration-200",
                  categoryFilter === "all"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                )}
              >
                All
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "px-3 py-0.5 rounded-full font-semibold transition-all duration-200 capitalize",
                    categoryFilter === cat
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  )}
                >
                  {cat.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.04] p-1 rounded-full border border-black/[0.08] dark:border-white/[0.08] text-xs">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 transition-all duration-200",
                  viewMode === "list"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                )}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 transition-all duration-200",
                  viewMode === "kanban"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                )}
                title="Board view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Board</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Display */}
        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={filteredTasks}
            onUpdate={handleSilentUpdate}
            onSelectTask={handleOpenTask}
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((t: any) => (
              <TaskItem
                key={t.taskId}
                task={t}
                onUpdate={handleSilentUpdate}
                onSelectTask={handleOpenTask}
              />
            ))}
          </div>
        )}
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
