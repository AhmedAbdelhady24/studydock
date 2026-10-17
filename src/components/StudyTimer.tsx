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
    <div className="rounded-lg border border-white/[0.08] bg-[#111317] p-4 text-zinc-200">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <h3 className="text-xs font-semibold text-zinc-200">
            Focus Timer
          </h3>
        </div>

        <div className="flex items-center bg-white/[0.04] rounded p-0.5 border border-white/[0.06] text-xs">
          <button
            type="button"
            onClick={() => setMode("timer")}
            className={cn(
              "px-2 py-0.5 rounded text-[11px] font-medium transition-colors",
              mode === "timer"
                ? "bg-white/[0.08] text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Stopwatch
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={cn(
              "px-2 py-0.5 rounded text-[11px] font-medium transition-colors",
              mode === "manual"
                ? "bg-white/[0.08] text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Manual
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="mt-3 p-2 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {mode === "timer" ? (
        <div className="mt-4 flex flex-col items-center">
          {/* Readout */}
          <div className="text-4xl font-mono font-bold tracking-tight text-white tabular-nums py-2 flex items-center gap-2">
            {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            <span>{formatTime(seconds)}</span>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 my-2">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => addPresetMinutes(mins)}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition-colors"
              >
                +{mins}m
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-2 w-full">
            <button
              type="button"
              onClick={toggleTimer}
              className={cn(
                "flex-1 py-1.5 rounded-md font-medium text-xs flex items-center justify-center gap-1.5 transition-all",
                isActive
                  ? "bg-amber-500 text-black font-semibold hover:bg-amber-400"
                  : "bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.1]"
              )}
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isActive ? "Pause" : "Start"}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveTimerSession}
              disabled={seconds < 60 || isSubmitting}
              className="py-1.5 px-3 rounded-md font-medium text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Log
            </button>

            <button
              type="button"
              onClick={resetTimer}
              disabled={seconds === 0}
              className="p-1.5 rounded-md border border-white/[0.06] hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-30"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Select Week & Notes */}
          <div className="w-full mt-4 space-y-2 text-xs">
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1">Associate Week:</label>
              <select
                value={weekId}
                onChange={(e) => setWeekId(e.target.value)}
                className="w-full font-mono bg-[#090A0C] border border-white/[0.08] rounded px-2 py-1 text-zinc-300 text-xs focus:outline-none focus:border-blue-500"
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
                className="w-full bg-[#090A0C] border border-white/[0.08] rounded px-2 py-1 text-zinc-300 text-xs focus:outline-none focus:border-blue-500 placeholder:text-zinc-600"
              />
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveManualSession} className="mt-3 space-y-2.5 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1">
                Minutes:
              </label>
              <input
                type="number"
                min="1"
                value={manualMinutes}
                onChange={(e) => setManualMinutes(e.target.value)}
                className="w-full font-mono bg-[#090A0C] border border-white/[0.08] rounded px-2 py-1 text-zinc-300 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1">
                Date:
              </label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full font-mono bg-[#090A0C] border border-white/[0.08] rounded px-2 py-1 text-zinc-300 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-zinc-500 mb-1">
              Week:
            </label>
            <select
              value={weekId}
              onChange={(e) => setWeekId(e.target.value)}
              className="w-full font-mono bg-[#090A0C] border border-white/[0.08] rounded px-2 py-1 text-zinc-300 text-xs focus:outline-none focus:border-blue-500"
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
              className="w-full bg-[#090A0C] border border-white/[0.08] rounded px-2 py-1 text-zinc-300 text-xs focus:outline-none focus:border-blue-500 placeholder:text-zinc-600"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-md font-medium text-xs bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.1] transition-all"
            >
              Record Session
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
