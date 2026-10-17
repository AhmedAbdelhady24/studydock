"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Check, Clock, Plus } from "lucide-react";
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
  const [weekId, setWeekId] = useState(currentWeekId || "product-engineer-33-week-w01");
  const [courseId, setCourseId] = useState("");
  const [manualMinutes, setManualMinutes] = useState("45");
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

  const addPresetMinutes = (mins: number) => {
    setSeconds((prev) => prev + mins * 60);
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
        setSuccessMessage(`Logged ${durationMinutes}m focus block`);
        setTimeout(() => setSuccessMessage(""), 2500);
        if (onSessionLogged) onSessionLogged();
      }
    } catch (err) {
      console.error("Failed to log study session", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215] p-5 text-zinc-900 dark:text-zinc-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500" />
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-200 tracking-tight">
            Focus Timer
          </h3>
        </div>

        <div className="flex items-center bg-black/[0.04] dark:bg-white/[0.04] rounded-full p-1 border border-black/[0.06] dark:border-white/[0.06] text-xs">
          <button
            type="button"
            onClick={() => setMode("timer")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-semibold transition-all",
              mode === "timer"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            )}
          >
            Stopwatch
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-semibold transition-all",
              mode === "manual"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            )}
          >
            Manual
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {mode === "timer" ? (
        <div className="mt-2 flex flex-col items-center space-y-3">
          {/* Readout */}
          <div className="text-4xl font-mono font-extrabold tracking-tight text-zinc-900 dark:text-white tabular-nums py-2 flex items-center gap-2.5">
            {isActive && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
            <span>{formatTime(seconds)}</span>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => addPresetMinutes(mins)}
                className="px-2.5 py-1 text-[10px] font-mono rounded-full bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 border border-black/[0.06] dark:border-white/[0.06] font-semibold transition-colors"
              >
                +{mins}m
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 pt-1 w-full">
            <button
              type="button"
              onClick={toggleTimer}
              className={cn(
                "flex-1 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm",
                isActive
                  ? "bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400"
                  : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90"
              )}
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isActive ? "Pause" : "Start"}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveTimerSession}
              disabled={seconds < 60 || isSubmitting}
              className="py-2.5 px-4 rounded-2xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            >
              Log
            </button>

            <button
              type="button"
              onClick={resetTimer}
              disabled={seconds === 0}
              className="p-2.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors disabled:opacity-30 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Select Week & Notes */}
          <div className="w-full space-y-2 pt-1 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Associate Week:</label>
              <select
                value={weekId}
                onChange={(e) => setWeekId(e.target.value)}
                className="w-full font-mono bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
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
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you work on? (optional)"
                className="w-full bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveManualSession} className="mt-2 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                Minutes:
              </label>
              <input
                type="number"
                min="1"
                value={manualMinutes}
                onChange={(e) => setManualMinutes(e.target.value)}
                className="w-full font-mono bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                Date:
              </label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full font-mono bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Week:
            </label>
            <select
              value={weekId}
              onChange={(e) => setWeekId(e.target.value)}
              className="w-full font-mono bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
            >
              <option value="">General Study</option>
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
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Session notes..."
              className="w-full bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] placeholder:text-zinc-400"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl font-bold text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition-all shadow-sm cursor-pointer"
            >
              Record Session
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
