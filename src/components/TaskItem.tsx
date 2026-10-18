"use client";

import React, { useState } from "react";
import {
  Check,
  Clock,
  AlertCircle,
  Star,
  FileText,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Binary,
  Layers,
  Terminal,
  ShieldCheck,
  Sparkles,
  PanelRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskCategory, TaskStatus } from "@/lib/types";
import { toast } from "sonner";

interface TaskItemProps {
  task: {
    id: number;
    taskId: string;
    weekId: string;
    category: TaskCategory | string;
    title: string;
    description: string;
    required: boolean;
    sortOrder: number;
    dsaTargetCount?: number | null;
    status: TaskStatus;
    completedAt?: Date | string | null;
    confidence?: number | null;
    notes?: string | null;
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
  };
  onUpdate?: () => void;
  onSelectTask?: (task: any) => void;
}

const CATEGORY_META: Record<
  string,
  { label: string; dot: string; text: string }
> = {
  dsa: {
    label: "DSA",
    dot: "bg-purple-500",
    text: "text-purple-700 dark:text-purple-300",
  },
  design: {
    label: "Architecture",
    dot: "bg-blue-500",
    text: "text-blue-700 dark:text-blue-300",
  },
  implementation: {
    label: "Coding",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
  },
  course: {
    label: "Course",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  quality: {
    label: "Review",
    dot: "bg-indigo-500",
    text: "text-indigo-700 dark:text-indigo-300",
  },
  checkpoint: {
    label: "Checkpoint",
    dot: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-300",
  },
  other: {
    label: "Task",
    dot: "bg-zinc-400",
    text: "text-zinc-700 dark:text-zinc-300",
  },
};

export function TaskItem({ task, onUpdate, onSelectTask }: TaskItemProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [confidence, setConfidence] = useState<number>(task.confidence || 0);
  const [notes, setNotes] = useState<string>(task.notes || "");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const meta = CATEGORY_META[task.category] || CATEGORY_META.other;

  const handleToggleDone = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: TaskStatus = status === "done" ? "not_started" : "done";
    setStatus(nextStatus);
    if (nextStatus === "done") {
      toast.success("Task completed!", { description: task.title });
    } else {
      toast.info("Task marked incomplete", { description: task.title });
    }
    await saveTaskUpdate({ status: nextStatus });
  };

  const handleConfidenceClick = async (e: React.MouseEvent, level: number) => {
    e.stopPropagation();
    const newConf = confidence === level ? 0 : level;
    setConfidence(newConf);
    if (newConf > 0) {
      toast.info(`Confidence set to ${newConf}/5`, { description: task.title });
    }
    await saveTaskUpdate({ confidence: newConf || null });
  };

  const handleSaveNotes = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await saveTaskUpdate({ notes });
    toast.success("Notes saved", { description: "Task notes saved to database." });
  };

  const saveTaskUpdate = async (updates: Partial<{
    status: TaskStatus;
    notes: string | null;
    confidence: number | null;
  }>) => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/tasks/${task.taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok && onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error("Failed to update task", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isDone = status === "done";
  const isInProgress = status === "in_progress";
  const isBlocked = status === "blocked";

  return (
    <div
      className={cn(
        "group rounded-2xl border transition-all text-sm shadow-sm",
        isDone
          ? "border-black/[0.04] dark:border-white/[0.04] bg-zinc-100/60 dark:bg-[#0E1014]/60 text-zinc-500 dark:text-zinc-400"
          : isBlocked
          ? "border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/10 text-zinc-900 dark:text-zinc-200"
          : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111317] hover:border-black/20 dark:hover:border-white/[0.14] text-zinc-900 dark:text-zinc-200"
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Sleek Tactile Checkbox */}
        <button
          type="button"
          onClick={handleToggleDone}
          disabled={isSaving}
          className={cn(
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer",
            isDone
              ? "bg-emerald-500 border-emerald-400 text-white"
              : isInProgress
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950"
              : isBlocked
              ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
              : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-500 text-transparent"
          )}
          title={`Status: ${status} (click to toggle completed)`}
        >
          {isDone ? (
            <Check className="h-3 w-3 stroke-[3]" />
          ) : isInProgress ? (
            <Clock className="h-2.5 w-2.5" />
          ) : isBlocked ? (
            <AlertCircle className="h-2.5 w-2.5" />
          ) : null}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Category tag */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 font-semibold">
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", meta.dot)} />
              <span>{meta.label}</span>
            </span>

            {/* Authoritative Course / Book / Resource Reference Pill */}
            {(task.resourceLabel || task.primaryCourses) && (
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-700 dark:text-zinc-300 bg-black/[0.04] dark:bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] truncate max-w-[260px] group-hover:border-black/20 dark:group-hover:border-white/[0.16] transition-colors"
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

            {task.dsaTargetCount ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-700 dark:text-zinc-300 bg-black/[0.04] dark:bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                <span>{task.dsaTargetCount} problems</span>
              </span>
            ) : null}

            {!task.required && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">
                optional
              </span>
            )}

            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 ml-auto hidden sm:inline">
              {task.taskId.replace(/^product-engineer-33-week-/, "")}
            </span>
          </div>

          <p
            onClick={() => onSelectTask?.(task)}
            className={cn(
              "font-bold leading-relaxed transition-colors duration-150 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 break-words [overflow-wrap:anywhere]",
              isDone ? "text-zinc-400 dark:text-zinc-500 line-through decoration-zinc-400 dark:decoration-zinc-600" : "text-zinc-900 dark:text-zinc-100"
            )}
            title="Click to view full course and task details"
          >
            {task.title}
          </p>

          {task.description && (
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400/90 leading-relaxed font-normal break-words [overflow-wrap:anywhere]">
              {task.description}
            </p>
          )}

          {/* Footer Controls: Confidence & Notes Drawer */}
          <div className="mt-2.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.04] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            {/* Confidence Rating */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-zinc-500 mr-1 hidden sm:inline">
                Confidence:
              </span>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={(e) => handleConfidenceClick(e, lvl)}
                  className="p-0.5 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  title={`Rate confidence ${lvl}/5`}
                >
                  <Star
                    className={cn(
                      "w-3 h-3 transition-colors",
                      confidence >= lvl
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-700 hover:text-amber-400/40"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* Action buttons: Drawer Trigger & Notes Trigger */}
            <div className="flex items-center gap-3">
              {onSelectTask && (
                <button
                  type="button"
                  onClick={() => onSelectTask(task)}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                  title="Open details sidebar"
                >
                  <PanelRight className="w-3 h-3 text-zinc-500" />
                  <span>Details</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <FileText className="w-3 h-3 text-zinc-500" />
                <span>{notes ? "Notes saved" : "Add notes / PR link"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-500" />
                )}
              </button>
            </div>
          </div>

          {/* Expandable Evidence & Notes Area */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Commit link, PR URL, or concept notes..."
                className="w-full text-xs font-mono rounded bg-[#090A0C] border border-white/[0.1] p-2 text-zinc-200 focus:outline-none focus:border-blue-500/80 transition-colors placeholder:text-zinc-600"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="px-3 py-1 text-xs font-medium rounded bg-white/[0.08] hover:bg-white/[0.12] text-zinc-200 transition-colors"
                >
                  {isSaving ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
