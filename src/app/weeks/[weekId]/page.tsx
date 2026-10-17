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

  const loadData = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    loadData();
  }, [weekId]);

  if (loading) {
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
          className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors font-medium font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Curriculum Roadmap</span>
        </Link>

        <div className="flex items-center gap-1.5">
          {prevWeek && (
            <Link
              href={`/weeks/${prevWeek.weekId}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#101216] border border-white/[0.08] hover:border-white/[0.16] text-zinc-300 transition-colors font-mono"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>W{prevWeek.weekNumber.toString().padStart(2, "0")}</span>
            </Link>
          )}
          {nextWeek && (
            <Link
              href={`/weeks/${nextWeek.weekId}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#101216] border border-white/[0.08] hover:border-white/[0.16] text-zinc-300 transition-colors font-mono"
            >
              <span>W{nextWeek.weekNumber.toString().padStart(2, "0")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Week Header Banner */}
      <div className="rounded-lg border border-white/[0.08] bg-[#101216] p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                WEEK {currentWeek.weekNumber.toString().padStart(2, "0")}
              </span>
              <span className="text-[11px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                {currentWeek.phaseTitle}
              </span>
              {currentWeek.isCompleted && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Passed</span>
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white">
              {currentWeek.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="rounded border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-right font-mono text-xs">
              <span className="text-[10px] text-zinc-500 block uppercase">Target Pace</span>
              <span className="font-semibold text-zinc-200">{currentWeek.targetHours}h / week</span>
            </div>

            <div className="rounded border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-right font-mono text-xs">
              <span className="text-[10px] text-zinc-500 block uppercase">Progress</span>
              <span className="font-semibold text-zinc-200 tabular-nums">
                {currentWeek.completedTasksCount} / {currentWeek.tasksCount} done
              </span>
            </div>
          </div>
        </div>

        {/* Primary Courses & Concepts */}
        <div className="pt-3 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-zinc-500 font-medium block mb-1">
              Primary Course References:
            </span>
            <p className="text-zinc-200 font-mono text-xs font-semibold">
              {currentWeek.primaryCourses || "Standard Systems Engineering"}
            </p>
          </div>

          {currentWeek.concepts && (
            <div>
              <span className="text-zinc-500 font-medium block mb-1">
                Core Engineering Concepts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentWeek.concepts.split(",").map((c: string, idx: number) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06] text-zinc-300"
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
        onAttestationUpdated={loadData}
      />

      {/* Action Items Header & Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-zinc-200">
            Action Items & Deliverables ({filteredTasks.length})
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <button
                onClick={() => setCategoryFilter("all")}
                className={cn(
                  "px-2 py-0.5 rounded font-medium transition-colors border",
                  categoryFilter === "all"
                    ? "bg-white/[0.1] text-white border-white/[0.2]"
                    : "border-white/[0.06] text-zinc-400 hover:text-zinc-200 bg-[#101216]"
                )}
              >
                All
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "px-2 py-0.5 rounded font-medium transition-colors border capitalize",
                    categoryFilter === cat
                      ? "bg-white/[0.1] text-white border-white/[0.2]"
                      : "border-white/[0.06] text-zinc-400 hover:text-zinc-200 bg-[#101216]"
                  )}
                >
                  {cat.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#101216] p-1 rounded-md border border-white/[0.08] text-xs">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-colors",
                  viewMode === "list"
                    ? "bg-white/[0.12] text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
                title="List view"
              >
                <List className="w-3 h-3" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-colors",
                  viewMode === "kanban"
                    ? "bg-white/[0.12] text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
                title="Board view"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Board</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Display */}
        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={filteredTasks}
            onUpdate={loadData}
            onSelectTask={handleOpenTask}
          />
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((t: any) => (
              <TaskItem
                key={t.taskId}
                task={t}
                onUpdate={loadData}
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
        onUpdate={loadData}
      />
    </div>
  );
}
