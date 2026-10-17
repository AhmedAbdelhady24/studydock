"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Clock,
  Binary,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  UploadCloud,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { TaskItem } from "@/components/TaskItem";
import { StudyTimer } from "@/components/StudyTimer";
import { CheckpointBanner } from "@/components/CheckpointBanner";

export default function TodayPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/plan");
      if (!res.ok) throw new Error("Failed to load plan data");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-muted-foreground">Loading StudyDock workspace...</p>
      </div>
    );
  }

  // If no plan is imported in the database yet
  if (!data?.plan) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-2xl border border-border bg-card text-center space-y-6 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <UploadCloud className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Welcome to StudyDock
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your PostgreSQL database is connected, but no learning plan has been imported yet.
            You can import your 33-week Product Engineer roadmap with one click.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/import"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Go to Import & Export</span>
          </Link>
        </div>
      </div>
    );
  }

  const { metrics, weeks } = data;

  // Identify active week (first week that is not yet completed, or w01)
  const activeWeek =
    weeks.find((w: any) => !w.isCompleted) || weeks[0];

  const activeWeekTasks = activeWeek?.tasks || [];
  const requiredTasks = activeWeekTasks.filter((t: any) => t.required);
  const allRequiredDone =
    requiredTasks.length > 0 &&
    requiredTasks.every((t: any) => t.status === "done");

  return (
    <div className="space-y-8">
      {/* Top Banner / Plan Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Today's Overview
            </h1>
            <span className="text-xs font-mono uppercase bg-secondary text-primary px-2 py-0.5 rounded border border-border">
              {activeWeek?.phaseTitle || "Phase 1"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Focus week: <span className="font-semibold text-foreground">{activeWeek?.title}</span> • Target: {activeWeek?.targetHours}h study
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/weeks/${activeWeek?.weekId}`}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-foreground flex items-center gap-1.5 transition-all"
          >
            <span>Open Week {activeWeek?.weekNumber} Detail</span>
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value={`${metrics?.overallPercentage ?? 0}%`}
          subtitle={`${metrics?.completedTasksCount ?? 0} of ${metrics?.totalTasksCount ?? 0} tasks done`}
          icon={TrendingUp}
          progress={metrics?.overallPercentage ?? 0}
        />
        <StatCard
          title="Weeks Completed"
          value={`${metrics?.completedWeeksCount ?? 0} / ${metrics?.totalWeeksCount ?? 33}`}
          subtitle={`${metrics?.totalWeeksCount - metrics?.completedWeeksCount} weeks remaining`}
          icon={Layers}
        />
        <StatCard
          title="Hours Studied"
          value={`${metrics?.totalHoursStudied ?? 0} hrs`}
          subtitle="Honest logged sessions"
          icon={Clock}
        />
        <StatCard
          title="DSA Solved"
          value={metrics?.distinctDsaSolvedCount ?? 0}
          subtitle="Unique problem solutions"
          icon={Binary}
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Week Tasks & Checkpoint (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Week Banner */}
          <div className="rounded-xl border border-border bg-card/60 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
                  Active Week • {activeWeek?.weekId?.toUpperCase()}
                </span>
                <h2 className="text-lg font-bold text-foreground mt-0.5">
                  Week {activeWeek?.weekNumber}: {activeWeek?.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Primary Courses: <span className="text-foreground/90">{activeWeek?.primaryCourses || "General Systems"}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-medium text-muted-foreground">
                  {activeWeekTasks.filter((t: any) => t.status === "done").length} / {activeWeekTasks.length} tasks
                </span>
                <div className="w-24 bg-secondary rounded-full h-1.5 mt-1 overflow-hidden">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{
                      width: `${
                        activeWeekTasks.length > 0
                          ? Math.round(
                              (activeWeekTasks.filter((t: any) => t.status === "done").length /
                                activeWeekTasks.length) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Concepts Tag List */}
            {activeWeek?.concepts && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/40">
                <span className="text-[11px] font-medium text-muted-foreground mr-1">Concepts:</span>
                {activeWeek.concepts.split(",").map((c: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono bg-secondary/80 text-foreground/80 px-2 py-0.5 rounded border border-border/60"
                  >
                    {c.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Task Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Active Tasks ({activeWeekTasks.length})</span>
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                Sort: Default Roadmap Order
              </span>
            </div>

            <div className="space-y-2.5">
              {activeWeekTasks.map((task: any) => (
                <TaskItem
                  key={task.taskId}
                  task={task}
                  onUpdate={fetchPlanData}
                />
              ))}
            </div>
          </div>

          {/* Exit Checkpoint Gatekeeper */}
          <CheckpointBanner
            weekId={activeWeek?.weekId}
            exitCriteria={activeWeek?.exitCriteria}
            allRequiredTasksCompleted={allRequiredDone}
            isPassed={activeWeek?.checkpointPassed || false}
            passedAt={activeWeek?.checkpointPassedAt}
            evidenceNotes={activeWeek?.checkpointEvidence}
            onAttestationUpdated={fetchPlanData}
          />
        </div>

        {/* Right Column: Study Timer & Quick Links (Span 1) */}
        <div className="space-y-6">
          <StudyTimer
            currentWeekId={activeWeek?.weekId}
            onSessionLogged={fetchPlanData}
          />

          {/* Phase Roadmap Snapshot */}
          <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Phase Velocity
              </h3>
              <Link
                href="/roadmap"
                className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
              >
                <span>All 33 Weeks</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {metrics?.phases?.map((p: any) => (
                <div key={p.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{p.title}</span>
                    <span className="font-mono text-muted-foreground">{p.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${p.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm space-y-3">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider pb-1 border-b border-border/60">
              Navigation Shortcuts
            </h3>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <Link
                href="/dsa"
                className="p-3 rounded-lg border border-border hover:border-primary/40 bg-secondary/30 hover:bg-secondary/60 flex items-center justify-between text-xs transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Binary className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-medium text-foreground">DSA Tracker</div>
                    <div className="text-[11px] text-muted-foreground">Log problem attempts & patterns</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link
                href="/courses"
                className="p-3 rounded-lg border border-border hover:border-primary/40 bg-secondary/30 hover:bg-secondary/60 flex items-center justify-between text-xs transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-medium text-foreground">Course Coverage</div>
                    <div className="text-[11px] text-muted-foreground">16 targets vs actual progress</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
