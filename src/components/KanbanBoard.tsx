"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Clock,
  Check,
  RotateCcw,
  Star,
  Layers,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Binary,
  Terminal,
  ShieldCheck,
  Sparkles,
  GripVertical,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskStatus, TaskCategory } from "@/lib/types";

interface KanbanBoardProps {
  tasks: any[];
  onUpdate?: () => void;
  onSelectTask: (task: any) => void;
}

const CATEGORY_META: Record<
  string,
  { label: string; dot: string; text: string; bg: string }
> = {
  dsa: {
    label: "DSA",
    dot: "bg-purple-500",
    text: "text-purple-300 font-semibold",
    bg: "bg-[#F3E8FF]/15 border-purple-500/30",
  },
  design: {
    label: "Architecture",
    dot: "bg-blue-400",
    text: "text-blue-300 font-semibold",
    bg: "bg-[#DBEAFE]/15 border-blue-500/30",
  },
  implementation: {
    label: "Coding",
    dot: "bg-amber-400",
    text: "text-amber-300 font-semibold",
    bg: "bg-[#FEF3C7]/15 border-amber-500/30",
  },
  course: {
    label: "Course",
    dot: "bg-emerald-400",
    text: "text-emerald-300 font-semibold",
    bg: "bg-[#DCFCE7]/15 border-emerald-500/30",
  },
  quality: {
    label: "Review",
    dot: "bg-indigo-400",
    text: "text-indigo-300 font-semibold",
    bg: "bg-[#E0E7FF]/15 border-indigo-500/30",
  },
  checkpoint: {
    label: "Checkpoint",
    dot: "bg-rose-400",
    text: "text-rose-300 font-semibold",
    bg: "bg-[#FFE4E6]/15 border-rose-500/30",
  },
  other: {
    label: "Task",
    dot: "bg-zinc-400",
    text: "text-zinc-300",
    bg: "bg-white/[0.04] border-white/[0.08]",
  },
};

const COLUMNS: {
  id: TaskStatus;
  title: string;
  dotColor: string;
  borderColor: string;
  dropBorder: string;
}[] = [
  {
    id: "not_started",
    title: "To Do",
    dotColor: "bg-zinc-400",
    borderColor: "border-zinc-700/60",
    dropBorder: "border-zinc-500 bg-zinc-900/40",
  },
  {
    id: "in_progress",
    title: "In Progress",
    dotColor: "bg-amber-400 animate-pulse",
    borderColor: "border-amber-500/40",
    dropBorder: "border-amber-400 bg-amber-500/10",
  },
  {
    id: "done",
    title: "Done",
    dotColor: "bg-emerald-400",
    borderColor: "border-emerald-500/40",
    dropBorder: "border-emerald-400 bg-emerald-500/10",
  },
];

export function KanbanBoard({ tasks, onUpdate, onSelectTask }: KanbanBoardProps) {
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const handleMoveStatus = async (
    e: React.MouseEvent | null,
    task: any,
    targetStatus: TaskStatus
  ) => {
    if (e) e.stopPropagation();
    try {
      setUpdatingTaskId(task.taskId);
      const res = await fetch(`/api/tasks/${task.taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (res.ok && onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error("Failed to move task status", err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDropStatus = async (taskId: string, targetStatus: TaskStatus) => {
    const task = tasks.find((t) => t.taskId === taskId);
    if (!task || task.status === targetStatus) return;
    await handleMoveStatus(null, task, targetStatus);
  };

  const blockedTasks = tasks.filter((t) => t.status === "blocked");

  const filteredTasks = tasks.filter((t) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "dsa") return t.category === "dsa";
    if (selectedFilter === "architecture") return t.category === "design";
    if (selectedFilter === "course") return t.category === "course";
    if (selectedFilter === "coding") return t.category === "implementation";
    if (selectedFilter === "checkpoint") return t.category === "checkpoint";
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Category Quick Filter Bar (Inspired by Image 1 & 2 rounded pill filter controls) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {[
            { id: "all", label: "All Tasks", count: tasks.length },
            { id: "course", label: "Courses", count: tasks.filter((t) => t.category === "course").length },
            { id: "dsa", label: "DSA", count: tasks.filter((t) => t.category === "dsa").length },
            { id: "architecture", label: "Architecture", count: tasks.filter((t) => t.category === "design").length },
            { id: "coding", label: "Coding Labs", count: tasks.filter((t) => t.category === "implementation").length },
            { id: "checkpoint", label: "Checkpoints", count: tasks.filter((t) => t.category === "checkpoint").length },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer",
                selectedFilter === f.id
                  ? "bg-white text-zinc-950 shadow-md font-bold scale-[1.02]"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
              )}
            >
              <span>{f.label}</span>
              <span className={cn("text-[10px]", selectedFilter === f.id ? "text-zinc-600" : "text-zinc-400")}>
                ({f.count})
              </span>
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-zinc-400 hidden sm:block">
          Drag cards to advance status
        </div>
      </div>

      {/* Blocked tasks banner if any exist */}
      {blockedTasks.length > 0 && (
        <div className="p-3.5 rounded-2xl border border-rose-500/30 bg-rose-950/20 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>{blockedTasks.length} task(s) currently blocked.</strong> Click any card to inspect or resolve.
            </span>
          </div>
        </div>
      )}

      {/* 3-Column Responsive Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const isDropTarget = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverCol(col.id);
              }}
              onDragLeave={() => {
                if (dragOverCol === col.id) setDragOverCol(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData("text/plain");
                if (taskId) handleDropStatus(taskId, col.id);
                setDragOverCol(null);
                setDraggedTaskId(null);
              }}
              className={cn(
                "flex flex-col rounded-3xl border transition-all p-4 min-h-[460px]",
                isDropTarget
                  ? col.dropBorder
                  : "border-white/[0.08] bg-[#111215]/80"
              )}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-xs">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", col.dotColor)} />
                  <span className="font-semibold text-zinc-100">{col.title}</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List in Column */}
              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center border border-dashed border-white/[0.06] rounded-lg text-zinc-600 text-xs font-mono p-4 text-center">
                    <span>No {col.title.toLowerCase()} tasks</span>
                    <span className="text-[10px] text-zinc-700 mt-1">Drop a card here to transition</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const meta = CATEGORY_META[task.category] || CATEGORY_META.other;
                    const isBusy = updatingTaskId === task.taskId;
                    const isBeingDragged = draggedTaskId === task.taskId;

                    return (
                      <div
                        key={task.taskId}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", task.taskId);
                          setDraggedTaskId(task.taskId);
                        }}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDragOverCol(null);
                        }}
                        onClick={() => onSelectTask(task)}
                        className={cn(
                          "group rounded-2xl border p-4 transition-all duration-200 cursor-grab active:cursor-grabbing relative space-y-3 select-none hover:shadow-lg",
                          isBeingDragged && "opacity-40 scale-[0.98]",
                          task.status === "done"
                            ? "bg-[#101216]/50 border-white/[0.04] text-zinc-400 hover:border-emerald-500/30"
                            : task.status === "in_progress"
                            ? "bg-[#15171D] border-amber-500/30 hover:border-amber-500/60 shadow-sm"
                            : "bg-[#131418] border-white/[0.08] hover:border-white/[0.2]"
                        )}
                      >
                        {/* Top Metadata Row: Category & Authoritative Resource Pill & Circular Action Icon */}
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border",
                                meta.bg,
                                meta.text
                              )}
                            >
                              <span className={cn("w-1 h-1 rounded-full", meta.dot)} />
                              <span>{meta.label}</span>
                            </span>

                            {/* Authoritative Resource Attribution */}
                            {(task.resourceLabel || task.primaryCourses) && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-zinc-300 truncate max-w-[170px] hover:border-white/[0.16] transition-colors"
                                title={`Assigned Resource: ${task.resourceName || task.resourceLabel || task.primaryCourses}`}
                              >
                                {task.resourceCategory === "dsa" || task.category === "dsa" ? (
                                  <Binary className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                                ) : task.resourceCategory === "architecture" || task.category === "design" ? (
                                  <Layers className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                                ) : task.resourceCategory === "implementation" || task.category === "implementation" ? (
                                  <Terminal className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                ) : task.resourceCategory === "quality" || task.category === "quality" ? (
                                  <ShieldCheck className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                                ) : task.resourceCategory === "checkpoint" || task.category === "checkpoint" ? (
                                  <Sparkles className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                                ) : (
                                  <BookOpen className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                )}
                                <span className="truncate">{task.resourceLabel || task.primaryCourses}</span>
                              </span>
                            )}
                          </div>

                          {/* Circular Action Button (Inspired by mobile design ↗ button) */}
                          <div
                            className="w-6 h-6 rounded-full bg-white/[0.06] group-hover:bg-white text-zinc-400 group-hover:text-zinc-950 flex items-center justify-center transition-all duration-200 shrink-0 shadow-sm"
                            title="Inspect details"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                          </div>
                        </div>

                        {/* Title */}
                        <h4
                          className={cn(
                            "text-xs sm:text-sm font-bold leading-snug transition-colors group-hover:text-white",
                            task.status === "done" ? "line-through text-zinc-500" : "text-zinc-100"
                          )}
                        >
                          {task.title}
                        </h4>

                        {/* Description Preview */}
                        {task.description && (
                          <p className="text-[11px] text-zinc-400/90 line-clamp-2 leading-relaxed font-normal">
                            {task.description}
                          </p>
                        )}

                        {/* Card Footer: Quick Actions & Status Advance */}
                        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
                          {/* Confidence or DSA Tag */}
                          <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                            {task.confidence ? (
                              <div className="flex items-center gap-0.5 text-amber-400">
                                <Star className="w-2.5 h-2.5 fill-amber-400" />
                                <span>{task.confidence}/5</span>
                              </div>
                            ) : task.dsaTargetCount ? (
                              <span className="text-purple-400 font-semibold">
                                {task.dsaTargetCount} problems
                              </span>
                            ) : (
                              <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                Details
                              </span>
                            )}
                          </div>

                          {/* 1-Click Action Buttons (WCAG 2.2 AA compliant single-pointer alternative) */}
                          <div className="flex items-center gap-1">
                            {col.id === "not_started" && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={(e) => handleMoveStatus(e, task, "in_progress")}
                                className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                                title="Move to In Progress"
                              >
                                <span>Start</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}

                            {col.id === "in_progress" && (
                              <>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={(e) => handleMoveStatus(e, task, "not_started")}
                                  className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                                  title="Revert to To Do"
                                >
                                  <ArrowLeft className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={(e) => handleMoveStatus(e, task, "done")}
                                  className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Complete task"
                                >
                                  <span>Complete</span>
                                  <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                </button>
                              </>
                            )}

                            {col.id === "done" && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={(e) => handleMoveStatus(e, task, "in_progress")}
                                className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 hover:text-zinc-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-1 transition-colors cursor-pointer"
                                title="Reopen task"
                              >
                                <RotateCcw className="w-2.5 h-2.5" />
                                <span>Reopen</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
