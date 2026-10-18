"use client";

import React, { useEffect, useState } from "react";
import {
  ExternalLink,
  CheckCircle,
  Sliders,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editPercent, setEditPercent] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/courses");
      const json = await res.json();
      setCourses(json.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStartEdit = (course: any) => {
    setEditingCourseId(course.courseId);
    setEditPercent(course.actualPercent ?? 0);
  };

  const handleQuickStep = async (courseId: string, currentVal: number, delta: number) => {
    const nextVal = Math.min(100, Math.max(0, currentVal + delta));
    await saveCoursePercent(courseId, nextVal);
  };

  const saveCoursePercent = async (courseId: string, percent: number) => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          actualPercent: percent,
        }),
      });

      if (res.ok) {
        setEditingCourseId(null);
        await fetchCourses();
      }
    } catch (err) {
      console.error("Failed to update course progress", err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCourses =
    filter === "all"
      ? courses
      : courses.filter((c) => c.coverageKind === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-6 h-6 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
        <p className="text-xs font-mono text-zinc-500">Loading course curriculum...</p>
      </div>
    );
  }

  const targetsMetCount = courses.filter((c) => (c.actualPercent ?? 0) >= (c.targetMin ?? 100)).length;
  const fullCoverageCount = courses.filter((c) => c.coverageKind === "full").length;
  const targetedCount = courses.filter((c) => c.coverageKind === "targeted").length;
  const selectiveCount = courses.filter((c) => c.coverageKind === "selective").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div>
          <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase block mb-1">
            Curriculum References
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Course Curriculum
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            16 foundational engineering courses mapped to study phases with target coverage thresholds.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-xs self-start sm:self-auto">
          {["all", "full", "targeted", "selective"].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={cn(
                "px-3.5 py-1 rounded-full font-semibold transition-all duration-200 capitalize",
                filter === k
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              )}
            >
              {k === "all" ? `All (${courses.length})` : k}
            </button>
          ))}
        </div>
      </div>

      {/* Curriculum Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215] shadow-sm hover:shadow-md transition-all">
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 block mb-1 font-semibold uppercase tracking-wider">Targets Met</span>
          <span className="text-2xl font-extrabold font-mono text-zinc-900 dark:text-white tabular-nums">
            {targetsMetCount} / {courses.length}
          </span>
        </div>
        <div className="p-5 rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215] shadow-sm hover:shadow-md transition-all">
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 block mb-1 font-semibold uppercase tracking-wider">Full Coverage (100%)</span>
          <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {fullCoverageCount} courses
          </span>
        </div>
        <div className="p-5 rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215] shadow-sm hover:shadow-md transition-all">
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 block mb-1 font-semibold uppercase tracking-wider">Targeted Coverage</span>
          <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
            {targetedCount} courses
          </span>
        </div>
        <div className="p-5 rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215] shadow-sm hover:shadow-md transition-all">
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 block mb-1 font-semibold uppercase tracking-wider">Selective Coverage</span>
          <span className="text-2xl font-extrabold font-mono text-purple-600 dark:text-purple-400 tabular-nums">
            {selectiveCount} courses
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCourses.map((c) => {
          const target = c.targetMin ?? 100;
          const actual = c.actualPercent ?? 0;
          const isTargetMet = actual >= target;
          const isEditing = editingCourseId === c.courseId;

          return (
            <div
              key={c.courseId}
              className={cn(
                "rounded-3xl border p-6 transition-all duration-200 space-y-4 shadow-sm hover:shadow-md bg-white dark:bg-[#111215]",
                isTargetMet
                  ? "border-emerald-500/30 hover:border-emerald-500/50"
                  : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/[0.2]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-black/[0.04] dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border border-black/[0.06] dark:border-white/[0.08] px-2.5 py-0.5 rounded-full font-semibold truncate max-w-[200px]">
                      {c.courseId.replace(/^product-engineer-33-week-course-/, "")}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 font-medium">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          c.coverageKind === "full"
                            ? "bg-emerald-500"
                            : c.coverageKind === "targeted"
                            ? "bg-blue-500"
                            : "bg-purple-500"
                        )}
                      />
                      <span>{c.coverageKind}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-snug">
                    {c.title}
                  </h3>
                </div>

                {c.referenceUrl && (
                  <a
                    href={c.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-black/20 dark:hover:border-white/[0.2] transition-colors shrink-0"
                    title="Course Syllabus Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Planned Weeks & Target Range */}
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                <span>Weeks: {c.plannedWeeks || "Throughout roadmap"}</span>
                <span>
                  Target: {c.targetMin}%{c.targetMax ? `–${c.targetMax}%` : ""}
                </span>
              </div>

              {/* Progress Dual Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                    Progress: <span className="text-zinc-900 dark:text-zinc-100 font-bold">{actual}%</span>
                  </span>
                  {isTargetMet ? (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Target Met</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                      Goal: {target}%
                    </span>
                  )}
                </div>

                <div className="relative w-full bg-black/[0.06] dark:bg-white/[0.06] rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      isTargetMet ? "bg-emerald-500" : "bg-[#C8B6FF]"
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, actual))}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                    style={{ left: `${Math.min(100, Math.max(0, target))}%` }}
                    title={`Target: ${target}%`}
                  />
                </div>
              </div>

              {/* Progress Controls */}
              {isEditing ? (
                <div className="p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-zinc-50 dark:bg-[#090A0C] space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-600 dark:text-zinc-400">Adjust Progress:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">{editPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editPercent}
                    onChange={(e) => setEditPercent(Number(e.target.value))}
                    className="w-full accent-[#4F46E5] cursor-pointer"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingCourseId(null)}
                      className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => saveCoursePercent(c.courseId, editPercent)}
                      disabled={isSaving}
                      className="px-4 py-1.5 text-xs font-bold rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 transition-opacity shadow-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(c)}
                    className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1.5 font-mono text-[11px] font-medium"
                  >
                    <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Set percentage</span>
                  </button>

                  <div className="flex items-center gap-1 font-mono">
                    <button
                      type="button"
                      onClick={() => handleQuickStep(c.courseId, actual, -5)}
                      disabled={isSaving || actual <= 0}
                      className="p-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors disabled:opacity-30"
                      title="Minus 5%"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStep(c.courseId, actual, 5)}
                      disabled={isSaving || actual >= 100}
                      className="p-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors disabled:opacity-30"
                      title="Plus 5%"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Coverage Strategy Notes */}
              {c.coverageNote && (
                <p className="text-[11px] font-mono text-zinc-500 leading-relaxed pt-2.5 border-t border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-zinc-700 dark:text-zinc-400 font-semibold">Scope: </span>
                  {c.coverageNote}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
