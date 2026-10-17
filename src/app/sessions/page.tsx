"use client";

import React, { useEffect, useState } from "react";
import { Clock, Calendar, BookOpen, Layers, Award, FileText } from "lucide-react";
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-border/60">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Study Time Log & Focus Sessions
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Honest accounting of hours invested. Progress is derived solely from real logged study sessions.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Hours Logged"
          value={`${totalHours} hrs`}
          subtitle={`${totalMinutes} total minutes`}
          icon={Clock}
        />
        <StatCard
          title="Total Sessions"
          value={sessions.length}
          subtitle="Recorded study intervals"
          icon={Layers}
        />
        <StatCard
          title="Average Session"
          value={
            sessions.length > 0
              ? `${Math.round(totalMinutes / sessions.length)} mins`
              : "0 mins"
          }
          subtitle="Time per recorded session"
          icon={Award}
        />
      </div>

      {/* Main Grid: Timer on Left/Top, History on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <StudyTimer onSessionLogged={fetchSessions} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Session History ({sessions.length})</span>
          </h2>

          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-border bg-card text-xs text-muted-foreground">
              No sessions recorded yet. Use the timer or manual form to log your first study block!
            </div>
          ) : (
            <div className="space-y-2.5">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-foreground">
                        {Math.floor(s.durationMinutes / 60) > 0
                          ? `${Math.floor(s.durationMinutes / 60)}h `
                          : ""}
                        {s.durationMinutes % 60}m
                      </span>

                      {s.weekId && (
                        <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-medium">
                          {s.weekId}
                        </span>
                      )}

                      {s.courseId && (
                        <span className="text-[10px] font-mono uppercase bg-secondary text-muted-foreground border border-border px-2 py-0.5 rounded">
                          {s.courseId}
                        </span>
                      )}
                    </div>

                    {s.notes && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {s.notes}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-xs font-mono text-muted-foreground shrink-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Calendar className="w-3.5 h-3.5" />
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
