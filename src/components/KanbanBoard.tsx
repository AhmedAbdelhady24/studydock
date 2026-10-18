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
import { toast } from "sonner";

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
    text: "text-purple-700 dark:text-purple-300 font-semibold",
    bg: "bg-purple-500/10 border-purple-500/25",
  },
  design: {
    label: "Architecture",
    dot: "bg-blue-500",
    text: "text-blue-700 dark:text-blue-300 font-semibold",
    bg: "bg-blue-500/10 border-blue-500/25",
  },
  implementation: {
    label: "Coding",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300 font-semibold",
    bg: "bg-amber-500/10 border-amber-500/25",
  },
  course: {
    label: "Course",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300 font-semibold",
    bg: "bg-emerald-500/10 border-emerald-500/25",
  },
  quality: {
    label: "Review",
    dot: "bg-indigo-500",
    text: "text-indigo-700 dark:text-indigo-300 font-semibold",
    bg: "bg-indigo-500/10 border-indigo-500/25",
  },
  checkpoint: {
    label: "Checkpoint",
    dot: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-300 font-semibold",
    bg: "bg-rose-500/10 border-rose-500/25",
  },
  other: {
    label: "Task",
    dot: "bg-zinc-400",
    text: "text-zinc-700 dark:text-zinc-300",
    bg: "bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08]",
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
    dropBorder: "ring-2 ring-zinc-400/60 bg-zinc-200/50 dark:bg-zinc-800/30",
  },
  {
    id: "in_progress",
    title: "In Progress",
    dotColor: "bg-amber-400 animate-pulse",
    borderColor: "border-amber-500/40",
    dropBorder: "ring-2 ring-amber-400/70 bg-amber-500/10 dark:bg-amber-500/15",
  },
  {
    id: "done",
    title: "Done",
    dotColor: "bg-emerald-400",
    borderColor: "border-emerald-500/40",
    dropBorder: "ring-2 ring-emerald-400/70 bg-emerald-500/10 dark:bg-emerald-500/15",
  },
];

export function KanbanBoard({ tasks, onUpdate, onSelectTask }: KanbanBoardProps) {
  const [localTasks, setLocalTasks] = useState<any[]>(tasks);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  // Synchronize local tasks whenever parent tasks prop changes
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleMoveStatus = async (
    e: React.MouseEvent | null,
    task: any,
    targetStatus: TaskStatus
  ) => {
    if (e) e.stopPropagation();
    if (task.status === targetStatus) return;

    const previousStatus = task.status;
    const labelMap: Record<string, string> = {
      not_started: "To Do",
      in_progress: "In Progress",
      done: "Done",
      blocked: "Blocked",
    };

    // 1. Immediately update local UI optimistically for seamless 60fps card movement
    setLocalTasks((prev) =>
      prev.map((t) => (t.taskId === task.taskId ? { ...t, status: targetStatus } : t))
    );
    setUpdatingTaskId(task.taskId);

    try {
      const res = await fetch(`/api/tasks/${task.taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (res.ok) {
        if (targetStatus === "done") {
          toast.success("Task completed!", { description: task.title });
        } else {
          toast.info(`Task status: ${labelMap[targetStatus] || targetStatus}`, {
            description: task.title,
          });
        }
        if (onUpdate) onUpdate();
      } else {
        // Revert on error
        toast.error("Failed to update status", { description: "Reverted to previous column." });
        setLocalTasks((prev) =>
          prev.map((t) => (t.taskId === task.taskId ? { ...t, status: previousStatus } : t))
        );
      }
    } catch (err) {
      console.error("Failed to move task status", err);
      toast.error("Network error while moving task", { description: "Reverted to previous column." });
      // Revert on network exception
      setLocalTasks((prev) =>
        prev.map((t) => (t.taskId === task.taskId ? { ...t, status: previousStatus } : t))
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDropStatus = async (taskId: string, targetStatus: TaskStatus) => {
    const task = localTasks.find((t) => t.taskId === taskId);
    if (!task || task.status === targetStatus) return;
    await handleMoveStatus(null, task, targetStatus);
  };

  const blockedTasks = localTasks.filter((t) => t.status === "blocked");

  const filteredTasks = localTasks.filter((t) => {
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
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md font-bold scale-[1.02]"
                  : "bg-black/[0.04] dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.06]"
              )}
            >
              <span>{f.label}</span>
              <span className={cn("text-[10px]", selectedFilter === f.id ? "text-zinc-300 dark:text-zinc-600 font-bold" : "text-zinc-500 dark:text-zinc-400")}>
                ({f.count})
              </span>
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 hidden sm:block">
          Drag cards to advance status
        </div>
      </div>

      {/* Blocked tasks banner if any exist */}
      {blockedTasks.length > 0 && (
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              <strong>{blockedTasks.length} task(s) currently blocked.</strong> Click any card to inspect or resolve.
            </span>
          </div>
        </div>
      )}

      {/* 3-Column Responsive Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const isDropTarget = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (dragOverCol !== col.id) {
                  setDragOverCol(col.id);
                }
              }}
              onDragLeave={(e) => {
                // Prevent flicker when crossing child cards or tags inside the column
                if (e.currentTarget.contains(e.relatedTarget as Node)) {
                  return;
                }
                setDragOverCol(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
                if (taskId) {
                  handleDropStatus(taskId, col.id);
                }
                setDragOverCol(null);
                setDraggedTaskId(null);
              }}
              className={cn(
                "flex flex-col rounded-3xl border transition-all p-4 min-h-[460px]",
                isDropTarget
                  ? col.dropBorder
                  : "border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215]/80"
              )}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06] dark:border-white/[0.06] text-xs">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", col.dotColor)} />
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{col.title}</span>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-400 border border-black/[0.06] dark:border-white/[0.08] font-semibold tabular-nums">
                  {colTasks.length} {colTasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>

              {/* Tasks List in Column */}
              <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center border border-dashed border-black/[0.08] dark:border-white/[0.06] rounded-2xl text-zinc-500 dark:text-zinc-600 text-xs font-mono p-4 text-center">
                    <span>No {col.title.toLowerCase()} tasks</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-700 mt-1">Drop a card here to transition</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const meta = CATEGORY_META[task.category] || CATEGORY_META.other;
                    const isBusy = updatingTaskId === task.taskId;
                    const isBeingDragged = draggedTaskId === task.taskId;

                    return (
                      <div
                        key={task.taskId}
                        draggable={!isBusy}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", task.taskId);
                          e.dataTransfer.effectAllowed = "move";
                          setDraggedTaskId(task.taskId);
                        }}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDragOverCol(null);
                        }}
                        onClick={() => {
                          if (draggedTaskId) return;
                          onSelectTask(task);
                        }}
                        className={cn(
                          "group rounded-2xl border p-4 transition-all duration-150 ease-out cursor-grab active:cursor-grabbing relative space-y-3 select-none",
                          "hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]",
                          isBeingDragged && "opacity-40 scale-[0.98]",
                          task.status === "done"
                            ? "bg-zinc-100/60 dark:bg-[#101216]/50 border-black/[0.05] dark:border-white/[0.05] text-zinc-500 dark:text-zinc-400 hover:border-emerald-500/30"
                            : task.status === "in_progress"
                            ? "bg-amber-500/[0.06] dark:bg-[#15171D] border-amber-500/30 hover:border-amber-500/60 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                            : "bg-white dark:bg-[#131418] border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/[0.2] shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                        )}
                      >
                        {/* Top Metadata Row: Category & Authoritative Resource Pill & Circular Action Icon */}
                        <div className="flex items-center justify-between gap-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono min-w-0">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border shrink-0",
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
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-300 truncate max-w-[170px] hover:border-black/20 dark:hover:border-white/[0.16] transition-colors"
                                title={`Assigned Resource: ${task.resourceName || task.resourceLabel || task.primaryCourses}`}
                              >
                                {task.resourceCategory === "dsa" || task.category === "dsa" ? (
                                  <Binary className="w-2.5 h-2.5 text-purple-500 dark:text-purple-400 shrink-0" />
                                ) : task.resourceCategory === "architecture" || task.category === "design" ? (
                                  <Layers className="w-2.5 h-2.5 text-blue-500 dark:text-blue-400 shrink-0" />
                                ) : task.resourceCategory === "implementation" || task.category === "implementation" ? (
                                  <Terminal className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400 shrink-0" />
                                ) : task.resourceCategory === "quality" || task.category === "quality" ? (
                                  <ShieldCheck className="w-2.5 h-2.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                                ) : task.resourceCategory === "checkpoint" || task.category === "checkpoint" ? (
                                  <Sparkles className="w-2.5 h-2.5 text-rose-500 dark:text-rose-400 shrink-0" />
                                ) : (
                                  <BookOpen className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                )}
                                <span className="truncate">{task.resourceLabel || task.primaryCourses}</span>
                              </span>
                            )}
                          </div>

                          {/* Circular Action Button */}
                          <div
                            className="w-6 h-6 rounded-full bg-black/[0.06] dark:bg-white/[0.06] group-hover:bg-zinc-900 dark:group-hover:bg-white text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-950 flex items-center justify-center transition-colors duration-150 shrink-0 shadow-sm"
                            title="Inspect details"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                          </div>
                        </div>

                        {/* Title */}
                        <h4
                          className={cn(
                            "text-xs sm:text-sm font-bold leading-snug transition-colors duration-150 group-hover:text-black dark:group-hover:text-white break-words [overflow-wrap:anywhere]",
                            task.status === "done" ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-100"
                          )}
                        >
                          {task.title}
                        </h4>

                        {/* Description Preview */}
                        {task.description && (
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400/90 line-clamp-2 leading-relaxed font-normal break-words [overflow-wrap:anywhere]">
                            {task.description}
                          </p>
                        )}

                        {/* Card Footer: Quick Actions & Status Advance */}
                        <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.04] flex items-center justify-between text-xs">
                          {/* Confidence or DSA Tag */}
                          <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                            {task.confidence ? (
                              <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400">
                                <Star className="w-2.5 h-2.5 fill-amber-400" />
                                <span>{task.confidence}/5</span>
                              </div>
                            ) : task.dsaTargetCount ? (
                              <span className="text-purple-600 dark:text-purple-400 font-semibold">
                                {task.dsaTargetCount} problems
                              </span>
                            ) : (
                              <span className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
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
                                className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
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
                                  className="p-1 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-all cursor-pointer active:scale-95"
                                  title="Revert to To Do"
                                >
                                  <ArrowLeft className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={(e) => handleMoveStatus(e, task, "done")}
                                  className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
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
                                className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
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
