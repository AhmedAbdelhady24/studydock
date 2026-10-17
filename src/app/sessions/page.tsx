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
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.06]">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Study Sessions
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Logged focus intervals and verified learning time.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StudyTimer onSessionLogged={fetchSessions} />
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-zinc-200">
              Session History ({sessions.length})
            </h2>
            <span className="text-[11px] font-mono text-zinc-500">Chronological</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              Loading session log...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center rounded-lg border border-white/[0.06] bg-[#0E1014]/60 text-xs text-zinc-500">
              No sessions recorded yet. Start the stopwatch or log a manual block to record your time.
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-white/[0.08] bg-[#101216] p-3 text-zinc-200 hover:border-white/[0.14] transition-colors flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold font-mono text-white text-sm">
                        {Math.floor(s.durationMinutes / 60) > 0
                          ? `${Math.floor(s.durationMinutes / 60)}h `
                          : ""}
                        {s.durationMinutes % 60}m
                      </span>

                      {s.weekId && (
                        <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded font-medium">
                          {s.weekId.replace(/^product-engineer-33-week-/, "")}
                        </span>
                      )}

                      {s.courseId && (
                        <span className="text-[10px] font-mono uppercase bg-white/[0.04] text-zinc-400 border border-white/[0.06] px-2 py-0.5 rounded">
                          {s.courseId.replace(/^product-engineer-33-week-course-/, "")}
                        </span>
                      )}
                    </div>

                    {s.notes && (
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {s.notes}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-[11px] font-mono text-zinc-500 shrink-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Calendar className="w-3.5 h-3.5 text-zinc-600" />
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
