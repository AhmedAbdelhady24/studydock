"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, Layers } from "lucide-react";
import { StudyTimer } from "@/components/StudyTimer";
import { StatCard } from "@/components/StatCard";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sessions");
      const json = await res.json();
      setSessions(json.sessions || []);
      setTotalHours(json.totalHours || 0);
      setTotalMinutes(json.totalMinutes || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const avgMinutes = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
        <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase block mb-1">
          Time Tracking & Cadence
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Study Sessions
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Logged focus intervals and verified learning time.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Hours Logged"
          value={`${totalHours} hrs`}
          subtitle={`${totalMinutes} total minutes`}
          badge="Verified"
        />
        <StatCard
          title="Total Sessions"
          value={sessions.length}
          subtitle="Recorded focus blocks"
          badge="Intervals"
        />
        <StatCard
          title="Average Session"
          value={`${avgMinutes} mins`}
          subtitle="Mean duration per block"
          badge="Cadence"
        />
      </div>

      {/* Main Grid: Timer on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <StudyTimer onSessionLogged={fetchSessions} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Session History ({sessions.length})
            </h2>
            <span className="text-[11px] font-mono text-zinc-400">Chronological</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              Loading session log...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0E1014]/60 text-xs text-zinc-500">
              No sessions recorded yet. Start the stopwatch or log a manual block to record your time.
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-4 text-zinc-900 dark:text-zinc-200 hover:shadow-md transition-all flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold font-mono text-zinc-900 dark:text-white text-base">
                        {Math.floor(s.durationMinutes / 60) > 0
                          ? `${Math.floor(s.durationMinutes / 60)}h `
                          : ""}
                        {s.durationMinutes % 60}m
                      </span>

                      {s.weekId && (
                        <span className="text-[10px] font-mono uppercase bg-black/[0.05] dark:bg-white/[0.06] text-zinc-800 dark:text-zinc-200 border border-black/[0.08] dark:border-white/[0.1] px-2.5 py-0.5 rounded-full font-medium">
                          {s.weekId.replace(/^product-engineer-33-week-/, "")}
                        </span>
                      )}

                      {s.courseId && (
                        <span className="text-[10px] font-mono uppercase bg-black/[0.04] dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 border border-black/[0.06] dark:border-white/[0.06] px-2.5 py-0.5 rounded-full">
                          {s.courseId.replace(/^product-engineer-33-week-course-/, "")}
                        </span>
                      )}
                    </div>

                    {s.notes && (
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                        {s.notes}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-[11px] font-mono text-zinc-500 shrink-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{s.date || new Date(s.createdAt).toISOString().split("T")[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
