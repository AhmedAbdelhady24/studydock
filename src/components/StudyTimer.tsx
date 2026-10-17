"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Check, Clock, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyTimerProps {
  currentWeekId?: string;
  onSessionLogged?: () => void;
}

export function StudyTimer({ currentWeekId, onSessionLogged }: StudyTimerProps) {
  const [mode, setMode] = useState<"timer" | "manual">("timer");
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [notes, setNotes] = useState("");
  const [weekId, setWeekId] = useState(currentWeekId || "w01");
  const [courseId, setCourseId] = useState("");
  const [manualMinutes, setManualMinutes] = useState("60");
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveTimerSession = async () => {
    if (seconds < 60) {
      alert("Session must be at least 1 minute to record.");
      return;
    }
    const durationMinutes = Math.max(1, Math.round(seconds / 60));
    await submitSession(durationMinutes, new Date().toISOString().split("T")[0]);
    resetTimer();
  };

  const handleSaveManualSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(manualMinutes, 10);
    if (isNaN(duration) || duration <= 0) {
      alert("Please enter a valid positive number of minutes.");
      return;
    }
    await submitSession(duration, manualDate);
    setNotes("");
  };

  const submitSession = async (durationMinutes: number, date: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId: weekId || undefined,
          courseId: courseId || undefined,
          durationMinutes,
          date,
          notes: notes.trim() || undefined,
        }),
      });

      if (res.ok) {
        setSuccessMessage(`Logged ${durationMinutes} minutes successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
        if (onSessionLogged) onSessionLogged();
      }
    } catch (err) {
      console.error("Failed to log study session", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Study Time Tracker
          </h3>
        </div>

        <div className="flex items-center bg-secondary/80 rounded-lg p-0.5 border border-border text-xs">
          <button
            type="button"
            onClick={() => setMode("timer")}
            className={cn(
              "px-2.5 py-1 rounded-md font-medium transition-all",
              mode === "timer"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Stopwatch
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={cn(
              "px-2.5 py-1 rounded-md font-medium transition-all",
              mode === "manual"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Manual Entry
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {mode === "timer" ? (
        <div className="mt-4 flex flex-col items-center justify-center">
          {/* Live digital readout */}
          <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-foreground tabular-nums py-3">
            {formatTime(seconds)}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={toggleTimer}
              className={cn(
                "px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 shadow-sm transition-all",
                isActive
                  ? "bg-amber-500 hover:bg-amber-600 text-zinc-950"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? "Pause" : "Start"}</span>
            </button>

            <button
              type="button"
              onClick={resetTimer}
              disabled={seconds === 0}
              className="p-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-all disabled:opacity-40"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSaveTimerSession}
              disabled={seconds < 60 || isSubmitting}
              className="px-4 py-2 rounded-lg font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-40"
            >
              <Check className="w-4 h-4" />
              <span>Record</span>
            </button>
          </div>

          {/* Week & Notes tag */}
          <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">Associate Week:</label>
              <select
                value={weekId}
                onChange={(e) => setWeekId(e.target.value)}
                className="w-full font-mono bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              >
                {Array.from({ length: 33 }, (_, i) => {
                  const num = i + 1;
                  const val = `product-engineer-33-week-w${num.toString().padStart(2, "0")}`;
                  return (
                    <option key={val} value={val}>
                      Week {num.toString().padStart(2, "0")}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">Notes / Topic:</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Dynamic Programming memoization"
                className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveManualSession} className="mt-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Duration (minutes):
              </label>
              <input
                type="number"
                min="1"
                value={manualMinutes}
                onChange={(e) => setManualMinutes(e.target.value)}
                className="w-full font-mono bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Date:
              </label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full font-mono bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Week (optional):
              </label>
              <select
                value={weekId}
                onChange={(e) => setWeekId(e.target.value)}
                className="w-full font-mono bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              >
                <option value="">None / General Study</option>
                {Array.from({ length: 33 }, (_, i) => {
                  const num = i + 1;
                  const val = `product-engineer-33-week-w${num.toString().padStart(2, "0")}`;
                  return (
                    <option key={val} value={val}>
                      Week {num.toString().padStart(2, "0")}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Course ID (optional):
              </label>
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="e.g. ts-pro"
                className="w-full font-mono bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Notes & What Was Accomplished:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Completed NeetCode Two-Pointer set"
              className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg font-semibold text-xs bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Study Session</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
