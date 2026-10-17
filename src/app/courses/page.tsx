"use client";

import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  ExternalLink,
  Clock,
  CheckCircle,
  Sliders,
  Bookmark,
  ChevronDown,
  ChevronUp,
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

  const handleSavePercent = async (courseId: string) => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          actualPercent: editPercent,
        }),
      });

      if (res.ok) {
        setEditingCourseId(null);
        fetchCourses();
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-muted-foreground">Loading course targets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Course Curriculum & Expected Coverage
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track planned study targets vs actual progress across all 16 foundational courses.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 bg-secondary/60 p-1 rounded-lg border border-border text-xs">
          {["all", "full", "targeted", "selective"].map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={cn(
                "px-2.5 py-1 rounded font-medium transition-colors capitalize",
                filter === k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {k === "all" ? `All (${courses.length})` : k}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((c) => {
          const target = c.targetMin ?? 100;
          const actual = c.actualPercent ?? 0;
          const isTargetMet = actual >= target;
          const isEditing = editingCourseId === c.courseId;

          return (
            <div
              key={c.courseId}
              className={cn(
                "rounded-xl border p-5 bg-card text-card-foreground shadow-sm transition-all space-y-4",
                isTargetMet ? "border-emerald-800/40" : "border-border"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-semibold">
                      {c.courseId}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-secondary text-muted-foreground px-2 py-0.5 rounded border border-border">
                      {c.coverageKind} coverage
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {c.title}
                  </h3>
                </div>

                {c.referenceUrl && (
                  <a
                    href={c.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Course Reference Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Planned Weeks & Target Range */}
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1">
                <span>Weeks: {c.plannedWeeks || "Throughout roadmap"}</span>
                <span>
                  Target: {c.targetMin}%{c.targetMax ? `-${c.targetMax}%` : ""}
                </span>
              </div>

              {/* Visual Progress Bar (Target Marker vs Actual) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Actual Progress:</span>
                  <span className="font-mono font-bold text-foreground">{actual}%</span>
                </div>

                <div className="relative w-full bg-secondary rounded-full h-2 overflow-hidden">
                  {/* Actual Progress Fill */}
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      isTargetMet ? "bg-emerald-500" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, actual))}%` }}
                  />
                  {/* Target Goal Tick */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                    style={{ left: `${Math.min(100, Math.max(0, target))}%` }}
                    title={`Target: ${target}%`}
                  />
                </div>
              </div>

              {/* Progress Update Slider / Controls */}
              {isEditing ? (
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Adjust Progress:</span>
                    <span className="font-mono font-bold text-primary">{editPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editPercent}
                    onChange={(e) => setEditPercent(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingCourseId(null)}
                      className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSavePercent(c.courseId)}
                      disabled={isSaving}
                      className="px-3 py-1 text-xs font-semibold rounded bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(c)}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Update Progress</span>
                  </button>

                  {isTargetMet && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Target Met</span>
                    </span>
                  )}
                </div>
              )}

              {/* Coverage Notes */}
              {c.coverageNote && (
                <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
                  <span className="font-medium text-foreground/80">Strategy:</span> {c.coverageNote}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
