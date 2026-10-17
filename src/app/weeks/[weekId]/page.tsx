"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Award,
  Binary,
  Layers,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { TaskItem } from "@/components/TaskItem";
import { CheckpointBanner } from "@/components/CheckpointBanner";
import { cn } from "@/lib/utils";

export default function WeekDetailPage() {
  const params = useParams();
  const weekId = params.weekId as string;
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/plan");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [weekId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-muted-foreground">Loading week details...</p>
      </div>
    );
  }

  const weeks = data?.weeks || [];
  const currentWeekIndex = weeks.findIndex((w: any) => w.weekId === weekId);
  const currentWeek = weeks[currentWeekIndex] || weeks[0];

  if (!currentWeek) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground">Week not found: {weekId}</p>
        <Link href="/roadmap" className="text-xs text-primary hover:underline">
          Return to Roadmap
        </Link>
      </div>
    );
  }

  const prevWeek = currentWeekIndex > 0 ? weeks[currentWeekIndex - 1] : null;
  const nextWeek =
    currentWeekIndex < weeks.length - 1 ? weeks[currentWeekIndex + 1] : null;

  const tasksList = currentWeek.tasks || [];
  const requiredTasks = tasksList.filter((t: any) => t.required);
  const allRequiredDone =
    requiredTasks.length > 0 &&
    requiredTasks.every((t: any) => t.status === "done");

  const filteredTasks =
    categoryFilter === "all"
      ? tasksList
      : tasksList.filter((t: any) => t.category === categoryFilter);

  const categories = Array.from(new Set(tasksList.map((t: any) => t.category)));

  return (
    <div className="space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
        <Link
          href="/roadmap"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 33-Week Roadmap</span>
        </Link>

        <div className="flex items-center gap-2">
          {prevWeek && (
            <Link
              href={`/weeks/${prevWeek.weekId}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Week {prevWeek.weekNumber}</span>
            </Link>
          )}
          {nextWeek && (
            <Link
              href={`/weeks/${nextWeek.weekId}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
            >
              <span>Week {nextWeek.weekNumber}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Week Header Banner */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary uppercase bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                Week {currentWeek.weekNumber.toString().padStart(2, "0")} • {currentWeek.weekId.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-muted-foreground uppercase bg-secondary px-2 py-0.5 rounded border border-border">
                {currentWeek.phaseTitle}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-2">
              {currentWeek.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-secondary/80 border border-border px-3.5 py-2 text-right">
              <span className="text-[10px] text-muted-foreground block uppercase font-mono">
                Target Hours
              </span>
              <span className="text-sm font-bold font-mono text-foreground flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{currentWeek.targetHours}h / week</span>
              </span>
            </div>

            <div className="rounded-lg bg-secondary/80 border border-border px-3.5 py-2 text-right">
              <span className="text-[10px] text-muted-foreground block uppercase font-mono">
                Tasks Completed
              </span>
              <span className="text-sm font-bold font-mono text-foreground">
                {currentWeek.completedTasksCount} / {currentWeek.tasksCount}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Courses & Concepts */}
        <div className="pt-3 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground font-medium block mb-1">
              Primary Courses:
            </span>
            <p className="text-foreground leading-relaxed">
              {currentWeek.primaryCourses || "Standard Systems Engineering"}
            </p>
          </div>

          {currentWeek.concepts && (
            <div>
              <span className="text-muted-foreground font-medium block mb-1">
                Key Concepts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentWeek.concepts.split(",").map((c: string, idx: number) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] bg-secondary px-2 py-0.5 rounded border border-border/70 text-foreground"
                  >
                    {c.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exit Checkpoint Gatekeeper */}
      <CheckpointBanner
        weekId={currentWeek.weekId}
        exitCriteria={currentWeek.exitCriteria}
        allRequiredTasksCompleted={allRequiredDone}
        isPassed={currentWeek.checkpointPassed || false}
        passedAt={currentWeek.checkpointPassedAt}
        evidenceNotes={currentWeek.checkpointEvidence}
        onAttestationUpdated={loadData}
      />

      {/* Task List Header & Category Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">
              Week Action Items & Exercises ({filteredTasks.length})
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setCategoryFilter("all")}
              className={cn(
                "px-2.5 py-1 rounded font-medium transition-colors border",
                categoryFilter === "all"
                  ? "bg-secondary text-foreground border-primary/40 shadow-sm"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              All Categories
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-2.5 py-1 rounded font-medium transition-colors border capitalize",
                  categoryFilter === cat
                    ? "bg-secondary text-foreground border-primary/40 shadow-sm"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-2.5">
          {filteredTasks.map((t: any) => (
            <TaskItem key={t.taskId} task={t} onUpdate={loadData} />
          ))}
        </div>
      </div>
    </div>
  );
}
