"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Award,
  Filter,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoadmapPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "in_progress" | "remaining">("all");

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
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-muted-foreground">Loading 33-week roadmap...</p>
      </div>
    );
  }

  if (!data?.plan) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No roadmap loaded. Please import a learning plan first.
      </div>
    );
  }

  const { weeks, metrics } = data;

  // Group weeks by phase
  const phasesMap = new Map<string, { title: string; weeks: any[] }>();

  for (const w of weeks) {
    const pCode = w.phase || "phase_1";
    if (!phasesMap.has(pCode)) {
      phasesMap.set(pCode, {
        title: w.phaseTitle || pCode.toUpperCase(),
        weeks: [],
      });
    }
    phasesMap.get(pCode)!.weeks.push(w);
  }

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            33-Week Product Engineer Roadmap
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Structured into 4 progressive phases. Complete all required tasks and attest exit criteria to pass each week.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-secondary/60 p-1 rounded-lg border border-border text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-2.5 py-1 rounded font-medium transition-colors",
              filter === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All (33)
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={cn(
              "px-2.5 py-1 rounded font-medium transition-colors",
              filter === "in_progress" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={cn(
              "px-2.5 py-1 rounded font-medium transition-colors",
              filter === "completed" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Completed ({metrics?.completedWeeksCount ?? 0})
          </button>
          <button
            onClick={() => setFilter("remaining")}
            className={cn(
              "px-2.5 py-1 rounded font-medium transition-colors",
              filter === "remaining" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Remaining
          </button>
        </div>
      </div>

      {/* Phase Sections */}
      <div className="space-y-10">
        {Array.from(phasesMap.entries()).map(([pCode, phaseData]) => {
          const visibleWeeks = filterWeeks(phaseData.weeks);
          if (visibleWeeks.length === 0) return null;

          const phaseCompletedWeeks = phaseData.weeks.filter((w) => w.isCompleted).length;
          const phasePercent = Math.round((phaseCompletedWeeks / phaseData.weeks.length) * 100);

          return (
            <div key={pCode} className="space-y-4">
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-secondary/40 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs font-mono">
                    {pCode.replace(/[^0-9]/g, "") || "P"}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      {phaseData.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {phaseData.weeks.length} Weeks • {phaseCompletedWeeks} Passed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-foreground">{phasePercent}%</span>
                  </div>
                  <div className="w-24 bg-secondary rounded-full h-2 overflow-hidden border border-border/40">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${phasePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Weeks Cards Grid */}
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
                        "group block rounded-xl border p-4 transition-all hover:scale-[1.01] shadow-sm relative overflow-hidden",
                        isDone
                          ? "bg-emerald-950/15 border-emerald-800/40 hover:border-emerald-700/60"
                          : isStarted
                          ? "bg-card border-primary/30 hover:border-primary/60"
                          : "bg-card border-border hover:border-border/80"
                      )}
                    >
                      {/* Top badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-semibold text-primary uppercase">
                          Week {w.weekNumber.toString().padStart(2, "0")}
                        </span>

                        {isDone ? (
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Passed</span>
                          </span>
                        ) : w.checkpointPassed ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Tasks Incomplete
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                            {taskPercent}% done
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {w.title}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {w.primaryCourses ? `Courses: ${w.primaryCourses}` : w.concepts || "Standard curriculum"}
                      </p>

                      {/* Progress bar and details */}
                      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-mono text-[11px]">
                          {w.completedTasksCount}/{w.tasksCount} tasks
                        </span>

                        <span className="text-[11px] font-mono text-muted-foreground/80 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{w.targetHours}h</span>
                        </span>
                      </div>

                      <div className="mt-2 w-full bg-secondary rounded-full h-1 overflow-hidden">
                        <div
                          className={cn(
                            "h-1 rounded-full transition-all",
                            isDone ? "bg-emerald-500" : "bg-primary"
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
