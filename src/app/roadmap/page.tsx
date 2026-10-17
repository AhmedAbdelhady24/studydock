"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
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
        <div className="w-6 h-6 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
        <p className="text-xs font-mono text-zinc-500">Loading syllabus...</p>
      </div>
    );
  }

  if (!data?.plan) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        No active curriculum found. Please import a learning plan first.
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Curriculum Roadmap
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            33-week syllabus across 4 progressive engineering phases. Each week requires 100% task completion and verified exit attestation.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-[#101216] p-1 rounded-lg border border-white/[0.08] text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1 rounded font-medium transition-colors",
              filter === "all"
                ? "bg-white/[0.1] text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            All (33)
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={cn(
              "px-3 py-1 rounded font-medium transition-colors",
              filter === "in_progress"
                ? "bg-white/[0.1] text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            In Flight ({inProgressWeeksTotal})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={cn(
              "px-3 py-1 rounded font-medium transition-colors",
              filter === "completed"
                ? "bg-white/[0.1] text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Passed ({completedWeeksTotal})
          </button>
          <button
            onClick={() => setFilter("remaining")}
            className={cn(
              "px-3 py-1 rounded font-medium transition-colors",
              filter === "remaining"
                ? "bg-white/[0.1] text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Remaining ({remainingWeeksTotal})
          </button>
        </div>
      </div>

      {/* Phase Progression Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                "p-3.5 rounded-lg border text-xs transition-colors",
                isComplete
                  ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-200"
                  : isStarted
                  ? "border-white/[0.12] bg-[#111317] text-zinc-200"
                  : "border-white/[0.06] bg-[#0E1014]/60 text-zinc-400"
              )}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                <span>PHASE 0{idx + 1}</span>
                <span className="tabular-nums font-semibold text-zinc-300">
                  {passed}/{total} wks
                </span>
              </div>
              <h3 className="font-semibold text-zinc-100 truncate text-sm">
                {p.title}
              </h3>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-white/[0.06] rounded-full h-1 overflow-hidden">
                  <div
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      isComplete ? "bg-emerald-400" : "bg-blue-500"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono tabular-nums text-zinc-400">
                  {pct}%
                </span>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-mono font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                    PHASE 0{pIdx + 1}
                  </span>
                  <h2 className="text-sm font-semibold text-zinc-100">
                    {phaseData.title}
                  </h2>
                  <span className="text-xs text-zinc-500">
                    ({phaseData.weeks.length} Weeks)
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                  <span>
                    {phaseCompletedWeeks} of {phaseData.weeks.length} passed ({phasePercent}%)
                  </span>
                </div>
              </div>

              {/* Weeks Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                        "group block rounded-lg border p-4 transition-all duration-150 relative overflow-hidden",
                        isDone
                          ? "bg-[#0E1014]/60 border-white/[0.04] hover:border-emerald-500/30"
                          : isStarted
                          ? "bg-[#111317] border-white/[0.12] hover:border-white/[0.2]"
                          : "bg-[#0E1014]/40 border-white/[0.06] hover:border-white/[0.12]"
                      )}
                    >
                      {/* Top status & week tag */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-zinc-300">
                          WEEK {w.weekNumber.toString().padStart(2, "0")}
                        </span>

                        {isDone ? (
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            <span>Passed</span>
                          </span>
                        ) : w.checkpointPassed ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Check signed (tasks open)
                          </span>
                        ) : isStarted ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {taskPercent}% done
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-500 border border-white/[0.06]">
                            Pending
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {w.title}
                      </h3>

                      <p className="mt-1 text-xs text-zinc-400/90 line-clamp-1 leading-relaxed">
                        {w.primaryCourses ? w.primaryCourses : w.concepts || "Standard curriculum exercises"}
                      </p>

                      {/* Footer: tasks count & target hours */}
                      <div className="mt-4 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                        <span>
                          {w.completedTasksCount}/{w.tasksCount} tasks
                        </span>
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>{w.targetHours}h</span>
                        </span>
                      </div>

                      {/* Hairline Progress Indicator at Card Bottom */}
                      <div className="mt-2 w-full bg-white/[0.04] rounded-full h-1 overflow-hidden">
                        <div
                          className={cn(
                            "h-1 rounded-full transition-all duration-300",
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
