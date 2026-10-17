"use client";

import React, { useState, useEffect } from "react";
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
    dot: "bg-purple-400",
    text: "text-purple-300",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  design: {
    label: "Architecture & Design",
    dot: "bg-blue-400",
    text: "text-blue-300",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  implementation: {
    label: "Coding & Implementation",
    dot: "bg-amber-400",
    text: "text-amber-300",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  course: {
    label: "Course & Core Lessons",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  quality: {
    label: "Code Review & Quality Gate",
    dot: "bg-indigo-400",
    text: "text-indigo-300",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  checkpoint: {
    label: "Exit Competency Checkpoint",
    dot: "bg-rose-400",
    text: "text-rose-300",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  other: {
    label: "Exercise Task",
    dot: "bg-zinc-400",
    text: "text-zinc-300",
    bg: "bg-white/[0.04] border-white/[0.08]",
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

  useEffect(() => {
    if (task) {
      setStatus(task.status || "not_started");
      setConfidence(task.confidence || 0);
      setNotes(task.notes || "");
      setSaveSuccess(false);
    }
  }, [task]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const meta = CATEGORY_META[task.category] || CATEGORY_META.other;

  const handleStatusChange = async (nextStatus: TaskStatus) => {
    setStatus(nextStatus);
    await saveTaskUpdate({ status: nextStatus });
  };

  const handleConfidenceChange = async (level: number) => {
    const newConf = confidence === level ? 0 : level;
    setConfidence(newConf);
    await saveTaskUpdate({ confidence: newConf || null });
  };

  const handleSaveNotes = async () => {
    await saveTaskUpdate({ notes });
    setSaveSuccess(true);
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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-lg bg-[#0E1014] border-l border-white/[0.1] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-250 ease-out">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                Week {task.weekNumber ? task.weekNumber.toString().padStart(2, "0") : "01"}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded">
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
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                  {task.topicBadge}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Close (Esc)"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full border",
                  meta.bg,
                  meta.text
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />
                <span>{meta.label}</span>
              </span>

              <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                {task.weekNumber ? `W${task.weekNumber.toString().padStart(2, "0")} · Task ${task.sortOrder || 1}` : task.taskId}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-zinc-300">
          {/* Quick Status Bar */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
              Execution Status
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#121419] rounded-lg border border-white/[0.08]">
              {(
                [
                  { id: "not_started", label: "To Do", color: "text-zinc-300" },
                  { id: "in_progress", label: "In Flight", color: "text-amber-400" },
                  { id: "done", label: "Done", color: "text-emerald-400" },
                  { id: "blocked", label: "Blocked", color: "text-rose-400" },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStatusChange(s.id)}
                  disabled={isSaving}
                  className={cn(
                    "py-1.5 rounded font-mono text-[11px] font-medium transition-all text-center cursor-pointer",
                    status === s.id
                      ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.15]"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <span className={status === s.id ? s.color : ""}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Authoritative Resource & Reference Attribution */}
          <div className="rounded-lg border border-white/[0.08] bg-[#111317] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold text-xs">
                {isDsa ? (
                  <Binary className="w-4 h-4 text-purple-400" />
                ) : isArch ? (
                  <Layers className="w-4 h-4 text-blue-400" />
                ) : isCoding ? (
                  <Terminal className="w-4 h-4 text-amber-400" />
                ) : isQuality ? (
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                ) : isCheckpoint ? (
                  <Sparkles className="w-4 h-4 text-rose-400" />
                ) : (
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                )}
                <span>Task Learning Resource & Reference</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-500 uppercase">
                {task.resourceCategory || task.category}
              </span>
            </div>

            {/* Dedicated Task Resource */}
            <div className="p-4 rounded-2xl bg-[#090A0C] border border-white/[0.08] space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                    Primary Learning Resource
                  </span>
                  <p className="text-sm font-bold text-white leading-snug">
                    {task.resourceName || task.resourceLabel || task.primaryCourses || "Core Syllabus"}
                  </p>
                </div>
                {task.referenceUrl && (
                  <a
                    href={task.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-circle-action group/btn hover:scale-105"
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
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Concepts & Topics Covered
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(task.taskConcepts || (task.concepts ? task.concepts.split(",") : [])).map((c: string, idx: number) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08] text-zinc-300"
                    >
                      {c.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description & Deliverables */}
          <div className="rounded-lg border border-white/[0.08] bg-[#111317] p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="font-semibold text-zinc-200">Task Deliverable</span>
              <span className="text-[10px] font-mono text-zinc-500">
                {task.required ? "Required for Week Pass" : "Optional Enhancement"}
              </span>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm">
              {task.description || task.title}
            </p>

            {task.dsaTargetCount && (
              <div className="p-2.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
                Target: Solve at least {task.dsaTargetCount} problems independently without editor peek.
              </div>
            )}
          </div>

          {/* Week Exit Checkpoint Connection */}
          {task.exitCriteria && (
            <div className="rounded-lg border border-white/[0.08] bg-[#111317] p-4 space-y-2">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold text-xs border-b border-white/[0.06] pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Week Exit Criteria Gatekeeper</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {task.exitCriteria}
              </p>
            </div>
          )}

          {/* Confidence Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Understanding & Confidence
              </label>
              <span className="text-[10px] font-mono text-zinc-500">
                {confidence > 0 ? `${confidence} / 5 stars` : "Unrated"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-[#111317] border border-white/[0.08]">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleConfidenceChange(lvl)}
                  disabled={isSaving}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  title={`Rate confidence ${lvl}/5`}
                >
                  <Star
                    className={cn(
                      "w-4 h-4 transition-colors",
                      confidence >= lvl
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-600 hover:text-zinc-400"
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
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Evidence, PR Link & Notes
              </label>
              {saveSuccess && (
                <span className="text-[10px] font-mono text-emerald-400 animate-in fade-in flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Saved successfully</span>
                </span>
              )}
            </div>

            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste Git commit SHA, PR link, or retrospective note (e.g. 'Struggled with async timeouts, fixed by wrapping AbortController')..."
                rows={4}
                className="w-full rounded-lg bg-[#111317] border border-white/[0.08] p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 font-mono resize-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-600">
                  Persisted in PostgreSQL task_progress
                </span>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="px-3 py-1.5 rounded text-xs font-mono font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
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
