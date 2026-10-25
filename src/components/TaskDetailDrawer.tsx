"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  ExternalLink,
  ShieldCheck,
  FileText,
  Binary,
  Layers,
  Terminal,
  Sparkles,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskStatus, TaskCategory } from "@/lib/types";
import { toast } from "sonner";

interface TaskDetailDrawerProps {
  task: any | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const CATEGORY_META: Record<
  string,
  { label: string; dot: string; text: string; bg: string }
> = {
  dsa: {
    label: "DSA / Algorithms",
    dot: "bg-indigo-500",
    text: "text-zinc-700 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-white/[0.06] border-black/[0.08] dark:border-white/[0.08]",
  },
  design: {
    label: "Architecture & Design",
    dot: "bg-blue-500",
    text: "text-zinc-700 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-white/[0.06] border-black/[0.08] dark:border-white/[0.08]",
  },
  implementation: {
    label: "Coding & Implementation",
    dot: "bg-amber-500",
    text: "text-zinc-700 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-white/[0.06] border-black/[0.08] dark:border-white/[0.08]",
  },
  course: {
    label: "Course & Core Lessons",
    dot: "bg-emerald-500",
    text: "text-zinc-700 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-white/[0.06] border-black/[0.08] dark:border-white/[0.08]",
  },
  quality: {
    label: "Code Review & Quality Gate",
    dot: "bg-indigo-500",
    text: "text-zinc-700 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-white/[0.06] border-black/[0.08] dark:border-white/[0.08]",
  },
  checkpoint: {
    label: "Exit Competency Checkpoint",
    dot: "bg-rose-500",
    text: "text-zinc-700 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-white/[0.06] border-black/[0.08] dark:border-white/[0.08]",
  },
  other: {
    label: "Exercise Task",
    dot: "bg-zinc-400",
    text: "text-zinc-700 dark:text-zinc-300",
    bg: "bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08]",
  },
};

export function TaskDetailDrawer({
  task,
  isOpen,
  onClose,
  onUpdate,
}: TaskDetailDrawerProps) {
  const [status, setStatus] = useState<TaskStatus>("not_started");
  const [confidence, setConfidence] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task) {
      setStatus(task.status || "not_started");
      setConfidence(task.confidence || 0);
      setNotes(task.notes || "");
      setSaveSuccess(false);
    }
  }, [task]);

  // Trap focus inside drawer when open & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!drawerRef.current) return;
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on close button
    const timer = setTimeout(() => {
      drawerRef.current?.querySelector<HTMLElement>('button[aria-label="Close details"]')?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const meta = CATEGORY_META[task.category] || CATEGORY_META.other;

  const handleStatusChange = async (nextStatus: TaskStatus) => {
    setStatus(nextStatus);
    await saveTaskUpdate({ status: nextStatus });
    const labelMap: Record<string, string> = {
      not_started: "To Do",
      in_progress: "In Flight",
      done: "Done",
      blocked: "Blocked",
    };
    toast.success(`Task moved to ${labelMap[nextStatus] || nextStatus}`, {
      description: task.title,
    });
  };

  const handleConfidenceChange = async (level: number) => {
    const newConf = confidence === level ? 0 : level;
    setConfidence(newConf);
    await saveTaskUpdate({ confidence: newConf || null });
    if (newConf > 0) {
      toast.info(`Confidence set to ${newConf}/5`, {
        description: task.title,
      });
    }
  };

  const handleSaveNotes = async () => {
    await saveTaskUpdate({ notes });
    setSaveSuccess(true);
    toast.success("Notes saved", {
      description: "Your study notes and key takeaways were saved locally.",
    });
    setTimeout(() => setSaveSuccess(false), 2000);
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
      toast.error("Failed to update task", {
        description: "Please check your database connection.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isDsa = task.category === "dsa" || task.resourceCategory === "dsa";
  const isArch = task.category === "design" || task.resourceCategory === "architecture";
  const isCoding = task.category === "implementation" || task.resourceCategory === "implementation";
  const isQuality = task.category === "quality" || task.resourceCategory === "quality";
  const isCheckpoint = task.category === "checkpoint" || task.resourceCategory === "checkpoint";

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-task-title"
        className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0E1014] border-l border-black/[0.1] dark:border-white/[0.1] shadow-2xl dark:shadow-[inset_1px_0_0_rgba(255,255,255,0.06)] flex flex-col h-[100dvh] animate-in slide-in-from-right duration-250 ease-out text-zinc-900 dark:text-zinc-100"
      >
        {/* Header */}
        <div className="p-6 border-b border-black/[0.08] dark:border-white/[0.08] space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase bg-black/[0.05] dark:bg-white/[0.06] text-zinc-800 dark:text-zinc-200 border border-black/[0.08] dark:border-white/[0.1] px-2.5 py-0.5 rounded-full">
                Week {task.weekNumber ? task.weekNumber.toString().padStart(2, "0") : "01"}
              </span>
              <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] px-2.5 py-0.5 rounded-full font-medium">
                {isDsa
                  ? "Algorithms Track"
                  : isArch
                  ? "Architecture Track"
                  : isCoding
                  ? "Practical Lab"
                  : isQuality
                  ? "Quality Gate"
                  : isCheckpoint
                  ? "Milestone Gate"
                  : task.phaseTitle || "Curriculum"}
              </span>
              {task.topicBadge && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] px-2.5 py-0.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>{task.topicBadge}</span>
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/[0.06] dark:bg-white/[0.06] hover:bg-black/[0.12] dark:hover:bg-white/[0.12] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors duration-150 cursor-pointer active:scale-90"
              title="Close (Esc)"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2
              id="drawer-task-title"
              className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-snug break-words [overflow-wrap:anywhere]"
            >
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-2.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-0.5 rounded-full border font-semibold shrink-0",
                  meta.bg,
                  meta.text
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />
                <span>{meta.label}</span>
              </span>

              <span className="text-[11px] font-mono text-zinc-500 font-semibold tabular-nums">
                {task.weekNumber ? `W${task.weekNumber.toString().padStart(2, "0")} · Task ${task.sortOrder || 1}` : task.taskId}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-zinc-700 dark:text-zinc-300 overscroll-contain">
          {task.video && (
            <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 space-y-2">
              <p className="font-semibold">Measured viewing time: {(task.video.durationSeconds / 60).toFixed(1)} min at 1×</p>
              <p className="break-all text-zinc-500">{task.video.relativePath}</p>
              <p>Exercises and review need additional time. Duration metadata does not verify full playback.</p>
            </div>
          )}
          {/* Quick Status Bar */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block font-semibold">
              Execution Status
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-100 dark:bg-[#121419] rounded-2xl border border-black/[0.08] dark:border-white/[0.08]">
              {(
                [
                  { id: "not_started", label: "To Do", color: "text-zinc-700 dark:text-zinc-300" },
                  { id: "in_progress", label: "In Flight", color: "text-amber-600 dark:text-amber-400" },
                  { id: "done", label: "Done", color: "text-emerald-600 dark:text-emerald-400" },
                  { id: "blocked", label: "Blocked", color: "text-rose-600 dark:text-rose-400" },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStatusChange(s.id)}
                  disabled={isSaving}
                  className={cn(
                    "py-2 rounded-xl font-mono text-[11px] font-bold transition-colors duration-150 active:scale-95 text-center cursor-pointer",
                    status === s.id
                      ? "bg-white dark:bg-white/[0.1] text-zinc-950 dark:text-white shadow-sm border border-black/10 dark:border-white/[0.15]"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                  )}
                >
                  <span className={status === s.id ? s.color : ""}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Authoritative Resource & Reference Attribution */}
          <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111317] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-200 font-bold text-xs">
                {isDsa ? (
                  <Binary className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                ) : isArch ? (
                  <Layers className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                ) : isCoding ? (
                  <Terminal className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                ) : isQuality ? (
                  <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                ) : isCheckpoint ? (
                  <Sparkles className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                ) : (
                  <BookOpen className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                )}
                <span>Task Learning Resource & Reference</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500 uppercase font-semibold">
                {task.resourceCategory || task.category}
              </span>
            </div>

            {/* Dedicated Task Resource */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] space-y-2 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">
                    Primary Learning Resource
                  </span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                    {task.resourceName || task.resourceLabel || task.primaryCourses || "Core Syllabus"}
                  </p>
                </div>
                {task.referenceUrl && (
                  <a
                    href={task.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-black/20 dark:hover:border-white/[0.2] transition-colors shrink-0"
                    title="Open official resource in new tab"
                  >
                    <ExternalLink className="w-4 h-4 stroke-[2.2]" />
                  </a>
                )}
              </div>
            </div>

            {/* Category-Specific Concepts Tag List */}
            {((task.taskConcepts && task.taskConcepts.length > 0) || (task.category === "course" && task.concepts)) && (
              <div>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Concepts & Topics Covered
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(task.taskConcepts || (task.concepts ? task.concepts.split(",") : [])).map((c: string, idx: number) => (
                    <span
                      key={idx}
                      className="font-mono text-[11px] bg-white dark:bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 font-medium"
                    >
                      {c.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description & Deliverables */}
          <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111317] p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-200">Task Deliverable</span>
              <span className="text-[11px] font-mono text-zinc-500 font-semibold">
                {task.required ? "Required for Week Pass" : "Optional Enhancement"}
              </span>
            </div>

            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm break-words [overflow-wrap:anywhere]">
              {task.description || task.title}
            </p>

            {task.dsaTargetCount && (
              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 text-xs font-mono font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>Target: Solve at least {task.dsaTargetCount} problems independently without editor peek.</span>
              </div>
            )}
          </div>

          {/* Week Exit Checkpoint Connection */}
          {task.exitCriteria && (
            <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111317] p-5 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-300 font-bold text-xs border-b border-black/[0.06] dark:border-white/[0.06] pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Week Exit Criteria Gatekeeper</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed break-words [overflow-wrap:anywhere]">
                {task.exitCriteria}
              </p>
            </div>
          )}

          {/* Confidence Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                Understanding & Confidence
              </label>
              <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
                {confidence > 0 ? `${confidence} / 5 stars` : "Unrated"}
              </span>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-50 dark:bg-[#111317] border border-black/[0.08] dark:border-white/[0.08] shadow-sm">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleConfidenceChange(lvl)}
                  disabled={isSaving}
                  className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  title={`Rate confidence ${lvl}/5`}
                >
                  <Star
                    className={cn(
                      "w-4 h-4 transition-colors",
                      confidence >= lvl
                        ? "fill-amber-400 text-amber-500"
                        : "text-zinc-300 dark:text-zinc-600 hover:text-amber-400"
                    )}
                  />
                </button>
              ))}
              <span className="ml-auto text-[11px] text-zinc-500 font-mono">
                {confidence === 5
                  ? "Can explain & solve independently"
                  : confidence >= 3
                  ? "Solid working understanding"
                  : confidence > 0
                  ? "Needs review / repetition"
                  : "Click to rate"}
              </span>
            </div>
          </div>

          {/* Evidence, PR Link & Retrospective Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                Evidence, PR Link & Notes
              </label>
              {saveSuccess && (
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 animate-in fade-in flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Saved successfully</span>
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste Git commit SHA, PR link, or retrospective note..."
                rows={4}
                className="w-full rounded-2xl bg-zinc-50 dark:bg-[#111317] border border-black/[0.08] dark:border-white/[0.08] p-4 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white font-mono resize-none shadow-sm"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">
                  Persisted in PostgreSQL task_progress
                </span>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Notes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
