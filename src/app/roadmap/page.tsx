"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoadmapPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "in_progress" | "completed" | "remaining">("all");

  useEffect(() => {
    fetch("/api/plan")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-zinc-500">Loading curriculum roadmap...</p>
      </div>
    );
  }

  if (!data?.plan) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111317] text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-black/[0.05] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          No Active Curriculum Loaded
        </h2>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Import your 33-week Product Engineer roadmap CSV to explore the full curriculum.
        </p>
        <Link
          href="/import"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-md hover:scale-105 transition-all"
        >
          <span>Go to Import</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const { weeks, metrics } = data;

  // Group weeks by phase
  const phasesMap = new Map<string, { code: string; title: string; weeks: any[] }>();

  for (const w of weeks) {
    const pCode = w.phase || "phase_1";
    if (!phasesMap.has(pCode)) {
      phasesMap.set(pCode, {
        code: pCode,
        title: w.phaseTitle || pCode.toUpperCase(),
        weeks: [],
      });
    }
    phasesMap.get(pCode)!.weeks.push(w);
  }

  const phaseList = Array.from(phasesMap.values());

  // Filter helper
  const filterWeeks = (wList: any[]) => {
    if (filter === "completed") {
      return wList.filter((w) => w.isCompleted);
    }
    if (filter === "in_progress") {
      return wList.filter((w) => !w.isCompleted && w.completedTasksCount > 0);
    }
    if (filter === "remaining") {
      return wList.filter((w) => !w.isCompleted);
    }
    return wList;
  };

  const completedWeeksTotal = metrics?.completedWeeksCount ?? 0;
  const inProgressWeeksTotal = weeks.filter((w: any) => !w.isCompleted && w.completedTasksCount > 0).length;
  const remainingWeeksTotal = weeks.length - completedWeeksTotal;

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase block mb-1">
            Curriculum Structure • 33 Sprints
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Curriculum Roadmap
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            33 structured engineering weeks divided across 4 deep phases. Every week requires 100% core task execution and verified exit attestation.
          </p>
        </div>

        {/* Filter Pills (Matching Image 1 & 2 design) */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-xs self-start sm:self-auto overflow-x-auto">
          {[
            { id: "all", label: "All Weeks", count: 33 },
            { id: "in_progress", label: "In Flight", count: inProgressWeeksTotal },
            { id: "completed", label: "Passed", count: completedWeeksTotal },
            { id: "remaining", label: "Remaining", count: remainingWeeksTotal },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id as any)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0",
                filter === f.id
                  ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm font-bold scale-[1.02]"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <span>{f.label}</span>
              <span className="text-[10px] opacity-70 ml-1">({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Phase Progression Bento Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {phaseList.map((p, idx) => {
          const passed = p.weeks.filter((w) => w.isCompleted).length;
          const total = p.weeks.length;
          const pct = Math.round((passed / total) * 100);
          const isComplete = passed === total;
          const isStarted = passed > 0 || p.weeks.some((w) => w.completedTasksCount > 0);

          return (
            <div
              key={p.code}
              className={cn(
                "p-4 rounded-3xl border transition-all duration-200 flex flex-col justify-between min-h-[120px]",
                isComplete
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/40"
                  : isStarted
                  ? "bg-white dark:bg-[#18191E] border-black/[0.08] dark:border-white/[0.12] text-zinc-900 dark:text-white shadow-sm"
                  : "bg-zinc-50 dark:bg-[#111215]/60 border-black/[0.05] dark:border-white/[0.06] text-zinc-500 dark:text-zinc-400"
              )}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                  PHASE 0{idx + 1}
                </span>
                <span className="tabular-nums">
                  {passed}/{total} passed
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm tracking-tight truncate">
                  {p.title}
                </h3>
              </div>

              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                  <span>Phase Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden p-0.5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isComplete ? "bg-emerald-600 dark:bg-emerald-500" : "bg-blue-600 dark:bg-blue-500"
                    )}
                    style={{ width: `${Math.max(pct, isStarted ? 6 : 0)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase Sections & Week Cards */}
      <div className="space-y-10">
        {phaseList.map((phaseData, pIdx) => {
          const visibleWeeks = filterWeeks(phaseData.weeks);
          if (visibleWeeks.length === 0) return null;

          const phaseCompletedWeeks = phaseData.weeks.filter((w) => w.isCompleted).length;
          const phasePercent = Math.round((phaseCompletedWeeks / phaseData.weeks.length) * 100);

          return (
            <div key={phaseData.code} className="space-y-4">
              {/* Phase Header Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12] px-2.5 py-0.5 rounded-full uppercase">
                    PHASE 0{pIdx + 1}
                  </span>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {phaseData.title}
                  </h2>
                  <span className="text-xs font-mono text-zinc-500">
                    ({phaseData.weeks.length} Weeks)
                  </span>
                </div>

                <div className="text-xs font-mono font-semibold text-zinc-500">
                  {phaseCompletedWeeks} of {phaseData.weeks.length} passed ({phasePercent}%)
                </div>
              </div>

              {/* Weeks Cards Grid (Bento style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleWeeks.map((w: any) => {
                  const isDone = w.isCompleted;
                  const isStarted = w.completedTasksCount > 0;
                  const taskPercent =
                    w.tasksCount > 0
                      ? Math.round((w.completedTasksCount / w.tasksCount) * 100)
                      : 0;

                  return (
                    <Link
                      key={w.weekId}
                      href={`/weeks/${w.weekId}`}
                      className={cn(
                        "group block rounded-3xl border p-5 transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md cursor-pointer",
                        isDone
                          ? "bg-zinc-50 dark:bg-[#101216]/60 border-black/[0.06] dark:border-white/[0.06] hover:border-emerald-500/30"
                          : isStarted
                          ? "bg-white dark:bg-[#14151B] border-black/[0.1] dark:border-white/[0.15] hover:border-black/[0.25] dark:hover:border-white/[0.3]"
                          : "bg-white dark:bg-[#111215]/80 border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.18] dark:hover:border-white/[0.18]"
                      )}
                    >
                      {/* Top status & week tag & circular button */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-extrabold text-zinc-900 dark:text-zinc-200">
                            WEEK {w.weekNumber.toString().padStart(2, "0")}
                          </span>

                          {isDone ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 border border-black/[0.08] dark:border-white/[0.08] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span>Passed</span>
                            </span>
                          ) : w.checkpointPassed ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 border border-black/[0.08] dark:border-white/[0.08] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span>Attested</span>
                            </span>
                          ) : isStarted ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 border border-black/[0.08] dark:border-white/[0.08] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                              <span>{taskPercent}% done</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.04] text-zinc-500 border border-black/[0.06] dark:border-white/[0.06]">
                              Pending
                            </span>
                          )}
                        </div>

                        {/* Circular Action Button (Matching mobile design ↗) */}
                        <div className="btn-circle-action w-7 h-7 group-hover:scale-110" title="Inspect Week">
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </div>

                      {/* Week Title */}
                      <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
                        {w.title}
                      </h3>

                      {/* Primary Course & Focus */}
                      <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 leading-relaxed">
                        {w.primaryCourses ? w.primaryCourses : w.concepts || "Core curriculum exercises"}
                      </p>

                      {/* Footer: tasks count & target hours */}
                      <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold">
                          {w.completedTasksCount}/{w.tasksCount} tasks done
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
                          <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <span>{w.targetHours}h target</span>
                        </span>
                      </div>

                      {/* Hairline Progress Indicator at Card Bottom */}
                      <div className="mt-2.5 w-full bg-black/5 dark:bg-white/[0.06] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            isDone ? "bg-emerald-500" : isStarted ? "bg-blue-500" : "bg-transparent"
                          )}
                          style={{ width: `${taskPercent}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
