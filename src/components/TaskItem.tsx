"use client";

import React, { useState } from "react";
import { Check, Clock, AlertCircle, Circle, Star, ChevronDown, ChevronUp, FileText, CheckCircle2 } from "lucide-react";
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

const CATEGORY_STYLES: Record<
  TaskCategory,
  { label: string; bg: string; text: string; border: string }
> = {
  dsa: {
    label: "DSA",
    bg: "bg-purple-950/40",
    text: "text-purple-300",
    border: "border-purple-800/50",
  },
  design: {
    label: "Architecture",
    bg: "bg-blue-950/40",
    text: "text-blue-300",
    border: "border-blue-800/50",
  },
  implementation: {
    label: "Independent",
    bg: "bg-amber-950/40",
    text: "text-amber-300",
    border: "border-amber-800/50",
  },
  course: {
    label: "Course",
    bg: "bg-emerald-950/40",
    text: "text-emerald-300",
    border: "border-emerald-800/50",
  },
  quality: {
    label: "Review",
    bg: "bg-indigo-950/40",
    text: "text-indigo-300",
    border: "border-indigo-800/50",
  },
  checkpoint: {
    label: "Checkpoint",
    bg: "bg-rose-950/40",
    text: "text-rose-300",
    border: "border-rose-800/50",
  },
  other: {
    label: "Other",
    bg: "bg-secondary",
    text: "text-muted-foreground",
    border: "border-border",
  },
};

export function TaskItem({ task, onUpdate }: TaskItemProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [confidence, setConfidence] = useState<number>(task.confidence || 0);
  const [notes, setNotes] = useState<string>(task.notes || "");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const catStyle = CATEGORY_STYLES[task.category] || {
    label: task.category,
    bg: "bg-secondary",
    text: "text-muted-foreground",
    border: "border-border",
  };

  const handleToggleStatus = async () => {
    const nextStatus: TaskStatus = status === "done" ? "not_started" : "done";
    setStatus(nextStatus);
    await saveTaskUpdate({ status: nextStatus });
  };

  const handleSelectStatus = async (newStatus: TaskStatus) => {
    setStatus(newStatus);
    await saveTaskUpdate({ status: newStatus });
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
        "rounded-lg border bg-card transition-all p-3.5 sm:p-4 text-card-foreground",
        isDone
          ? "border-emerald-900/40 bg-emerald-950/10"
          : isBlocked
          ? "border-rose-900/50 bg-rose-950/10"
          : "border-border hover:border-border/80"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Status Toggle Box */}
        <button
          onClick={handleToggleStatus}
          disabled={isSaving}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
            isDone
              ? "bg-emerald-500 border-emerald-400 text-white shadow-sm"
              : isInProgress
              ? "border-amber-400 bg-amber-500/20 text-amber-300"
              : isBlocked
              ? "border-rose-500 bg-rose-500/20 text-rose-300"
              : "border-border hover:border-primary/50 text-transparent"
          )}
          title={`Status: ${status} (click to toggle completed)`}
        >
          {isDone ? (
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          ) : isInProgress ? (
            <Clock className="h-3 w-3" />
          ) : isBlocked ? (
            <AlertCircle className="h-3 w-3" />
          ) : null}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={cn(
                "text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold",
                catStyle.bg,
                catStyle.text,
                catStyle.border
              )}
            >
              {catStyle.label}
            </span>

            {task.required ? (
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Required
              </span>
            ) : (
              <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">
                Optional
              </span>
            )}

            {task.dsaTargetCount ? (
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/30 px-1.5 py-0.2 rounded border border-purple-800/40">
                Target: {task.dsaTargetCount} problems
              </span>
            ) : null}

            <span className="text-[10px] font-mono text-muted-foreground/50 ml-auto">
              {task.taskId}
            </span>
          </div>

          <h4
            className={cn(
              "text-sm font-medium leading-snug transition-all",
              isDone ? "text-muted-foreground line-through decoration-emerald-500/50" : "text-foreground"
            )}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {task.description}
            </p>
          )}

          {/* Quick status bar / controls */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs text-muted-foreground">
            {/* Status Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] mr-1">Status:</span>
              <button
                onClick={() => handleSelectStatus("not_started")}
                className={cn(
                  "px-2 py-0.5 rounded text-[11px] font-medium transition-colors",
                  status === "not_started" ? "bg-secondary text-foreground border border-border" : "hover:text-foreground"
                )}
              >
                Todo
              </button>
              <button
                onClick={() => handleSelectStatus("in_progress")}
                className={cn(
                  "px-2 py-0.5 rounded text-[11px] font-medium transition-colors",
                  status === "in_progress" ? "bg-amber-950/60 text-amber-300 border border-amber-800/50" : "hover:text-foreground"
                )}
              >
                In Progress
              </button>
              <button
                onClick={() => handleSelectStatus("done")}
                className={cn(
                  "px-2 py-0.5 rounded text-[11px] font-medium transition-colors",
                  status === "done" ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50" : "hover:text-foreground"
                )}
              >
                Done
              </button>
              <button
                onClick={() => handleSelectStatus("blocked")}
                className={cn(
                  "px-2 py-0.5 rounded text-[11px] font-medium transition-colors",
                  status === "blocked" ? "bg-rose-950/60 text-rose-300 border border-rose-800/50" : "hover:text-foreground"
                )}
              >
                Blocked
              </button>
            </div>

            {/* Confidence & Notes Toggle */}
            <div className="flex items-center gap-3">
              {/* Confidence Stars */}
              <div className="flex items-center gap-0.5" title="Confidence rating (1-5)">
                <span className="text-[10px] text-muted-foreground/70 mr-1 hidden sm:inline">Confidence:</span>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleConfidenceClick(lvl)}
                    className="p-0.5 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={cn(
                        "w-3.5 h-3.5",
                        confidence >= lvl
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/40 hover:text-amber-400/50"
                      )}
                    />
                  </button>
                ))}
              </div>

              {/* Notes Accordion Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-[11px] hover:text-foreground transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-primary/80" />
                <span>{notes ? "Notes (saved)" : "Add Notes"}</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Expanded Notes & Evidence Editor */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-border/40">
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Implementation Notes & Evidence Links (GitHub PRs, LeetCode URLs, Repos):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Paste code links, commit SHAs, or notes..."
                className="w-full text-xs font-mono rounded-md border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="px-3 py-1 text-xs font-medium rounded bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-colors"
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
