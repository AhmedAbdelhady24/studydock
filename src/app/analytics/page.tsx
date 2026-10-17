"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, Clock, Binary, Award, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#ef4444"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [dsaData, setDsaData] = useState<any>(null);
  const [sessionsData, setSessionsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/plan").then((r) => r.json()),
      fetch("/api/dsa").then((r) => r.json()),
      fetch("/api/sessions").then((r) => r.json()),
    ])
      .then(([planRes, dsaRes, sessRes]) => {
        setData(planRes);
        setDsaData(dsaRes);
        setSessionsData(sessRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-muted-foreground">Generating learning analytics...</p>
      </div>
    );
  }

  if (!data?.plan) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No active plan loaded. Import a learning plan to view analytics.
      </div>
    );
  }

  const { metrics, weeks } = data;

  // Chart 1: Phase Completion
  const phaseData = (metrics?.phases || []).map((p: any) => ({
    name: p.title,
    Completed: p.completedWeeks,
    Remaining: p.totalWeeks - p.completedWeeks,
    percentage: p.percentage,
  }));

  // Chart 2: Category Distribution
  const categoryCounts: Record<string, number> = {};
  weeks.forEach((w: any) => {
    w.tasks?.forEach((t: any) => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });
  });

  const categoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat.replace(/_/g, " "),
    count,
  }));

  // Chart 3: First 8 Weeks Hours vs Actual (or all weeks)
  const weekHoursData = weeks.slice(0, 12).map((w: any) => {
    const weekSessions = (sessionsData?.sessions || []).filter(
      (s: any) => s.weekId === w.weekId
    );
    const actualMins = weekSessions.reduce((acc: number, s: any) => acc + s.durationMinutes, 0);
    return {
      name: `W${w.weekNumber}`,
      Target: Number(w.targetHours) || 20,
      Actual: Math.round((actualMins / 60) * 10) / 10,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-border/60">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Analytics & Performance Velocity
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Detailed telemetry on phase completion, weekly study pace, and algorithm distribution.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Completion"
          value={`${metrics?.overallPercentage}%`}
          subtitle={`${metrics?.completedTasksCount} of ${metrics?.totalTasksCount} tasks`}
          icon={TrendingUp}
          progress={metrics?.overallPercentage}
        />
        <StatCard
          title="Weeks Attested"
          value={`${metrics?.completedWeeksCount} / ${metrics?.totalWeeksCount}`}
          subtitle="Passed exit criteria"
          icon={Award}
        />
        <StatCard
          title="Actual Hours Studied"
          value={`${metrics?.totalHoursStudied}h`}
          subtitle="Real logged sessions"
          icon={Clock}
        />
        <StatCard
          title="Unique DSA Solved"
          value={metrics?.distinctDsaSolvedCount ?? 0}
          subtitle={`${dsaData?.totalAttemptsCount ?? 0} total attempts`}
          icon={Binary}
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phase Breakdown Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground">
            Phase Completion (Weeks Completed vs Remaining)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Remaining" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Hours: Target vs Actual */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground">
            Weekly Study Pace: Planned vs Actual Hours
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Target" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Roadmap Integrity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground">
            Task Categories
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-muted-foreground pt-1">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="truncate">{c.name}: {c.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            <span>Integrity Guard & Invariant Status</span>
          </h3>
          <div className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
            <div className="p-3 rounded-lg bg-secondary/40 border border-border">
              <strong className="text-foreground block mb-0.5">
                Deterministic Progress Preservation
              </strong>
              Tasks are permanently indexed by immutable IDs (<code className="text-primary font-mono">w01_t01</code> to <code className="text-primary font-mono">w33_t07</code>).
              Re-importing CSV revisions preserves all completed checkboxes, confidence ratings, and notes. Missing tasks are archived without data loss.
            </div>
            <div className="p-3 rounded-lg bg-secondary/40 border border-border">
              <strong className="text-foreground block mb-0.5">
                Strict Gatekeeping Metric
              </strong>
              A week is only counted as completed when all active required tasks are finished <span className="text-foreground font-semibold">AND</span> the Exit Checkpoint has been formally attested.
            </div>
            <div className="p-3 rounded-lg bg-secondary/40 border border-border">
              <strong className="text-foreground block mb-0.5">
                Auditable Time Accounting
              </strong>
              Total hours studied are derived purely from individual study sessions logged by the learner, preventing misleading target-based gamification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
