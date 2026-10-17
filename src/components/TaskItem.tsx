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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskCategory, TaskStatus } from "@/lib/types";

interface TaskItemProps {
  task: {
    id: number;
    taskId: string;
    weekId: string;
    category: TaskCategory;
    title: string;
    description: string;
    required: boolean;
    sortOrder: number;
    dsaTargetCount?: number | null;
    status: TaskStatus;
    completedAt?: Date | string | null;
    confidence?: number | null;
    notes?: string | null;
  };
  onUpdate?: () => void;
}

const CATEGORY_META: Record<
  TaskCategory,
  { label: string; dot: string; text: string }
> = {
  dsa: {
    label: "DSA",
    dot: "bg-purple-400",
    text: "text-purple-300",
  },
  design: {
    label: "Architecture",
    dot: "bg-blue-400",
    text: "text-blue-300",
  },
  implementation: {
    label: "Coding",
    dot: "bg-amber-400",
    text: "text-amber-300",
  },
  course: {
    label: "Course",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
  },
  quality: {
    label: "Review",
    dot: "bg-indigo-400",
    text: "text-indigo-300",
  },
  checkpoint: {
    label: "Checkpoint",
    dot: "bg-rose-400",
    text: "text-rose-300",
  },
  other: {
    label: "Task",
    dot: "bg-zinc-400",
    text: "text-zinc-300",
  },
};

export function TaskItem({ task, onUpdate }: TaskItemProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [confidence, setConfidence] = useState<number>(task.confidence || 0);
  const [notes, setNotes] = useState<string>(task.notes || "");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const meta = CATEGORY_META[task.category] || CATEGORY_META.other;

  const handleToggleDone = async () => {
    const nextStatus: TaskStatus = status === "done" ? "not_started" : "done";
    setStatus(nextStatus);
    await saveTaskUpdate({ status: nextStatus });
  };

  const handleConfidenceClick = async (level: number) => {
    const newConf = confidence === level ? 0 : level;
    setConfidence(newConf);
    await saveTaskUpdate({ confidence: newConf || null });
  };

  const handleSaveNotes = async () => {
    await saveTaskUpdate({ notes });
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
        "group rounded-lg border transition-all text-sm",
        isDone
          ? "border-white/[0.04] bg-[#0E1014]/60 text-zinc-400"
          : isBlocked
          ? "border-rose-900/30 bg-rose-950/10 text-zinc-200"
          : "border-white/[0.08] bg-[#111317] hover:border-white/[0.14] text-zinc-200"
      )}
    >
      <div className="flex items-start gap-3 p-3.5 sm:px-4 sm:py-3">
        {/* Sleek Tactile Checkbox */}
        <button
          type="button"
          onClick={handleToggleDone}
          disabled={isSaving}
          className={cn(
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all",
            isDone
              ? "bg-emerald-500 border-emerald-400 text-black"
              : isInProgress
              ? "border-amber-400/80 bg-amber-500/10 text-amber-400"
              : isBlocked
              ? "border-rose-400 bg-rose-500/10 text-rose-400"
              : "border-zinc-700 bg-zinc-900/60 hover:border-zinc-500 text-transparent"
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
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* Category tag */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", meta.dot)} />
              <span>{meta.label}</span>
            </span>

            {task.dsaTargetCount ? (
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                {task.dsaTargetCount} problems
              </span>
            ) : null}

            {!task.required && (
              <span className="text-[10px] text-zinc-500 italic">
                optional
              </span>
            )}

            <span className="text-[10px] font-mono text-zinc-600 ml-auto hidden sm:inline">
              {task.taskId.replace(/^product-engineer-33-week-/, "")}
            </span>
          </div>

          <p
            className={cn(
              "font-medium leading-relaxed transition-all",
              isDone ? "text-zinc-500 line-through decoration-zinc-600" : "text-zinc-100"
            )}
          >
            {task.title}
          </p>

          {task.description && (
            <p className="mt-1 text-xs text-zinc-400/90 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Footer Controls: Confidence & Notes Drawer */}
          <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-zinc-400">
            {/* Confidence Rating */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-zinc-500 mr-1 hidden sm:inline">
                Confidence:
              </span>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleConfidenceClick(lvl)}
                  className="p-0.5 hover:scale-110 transition-transform"
                  title={`Rate confidence ${lvl}/5`}
                >
                  <Star
                    className={cn(
                      "w-3 h-3",
                      confidence >= lvl
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-700 hover:text-amber-400/40"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* Notes Trigger */}
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
