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
import { StatCard } from "@/components/StatCard";

const PALETTE = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#a855f7", // Purple
  "#6366f1", // Indigo
  "#f43f5e", // Rose
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0]?.payload;
    const headerTitle = item?.fullName || label;
    return (
      <div className="rounded-lg border border-white/[0.12] bg-[#0E1014] p-2.5 text-xs shadow-xl space-y-1">
        <p className="font-mono font-semibold text-white">{headerTitle}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 font-mono text-[11px]">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-zinc-400 capitalize">{entry.name}:</span>
            <span className="font-semibold text-zinc-200">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-6 h-6 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
        <p className="text-xs font-mono text-zinc-500">Compiling telemetry...</p>
      </div>
    );
  }

  if (!data?.plan) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        No active plan loaded. Import a learning plan to view analytics.
      </div>
    );
  }

  const { metrics, weeks } = data;

  // Chart 1: Phase Completion
  const phaseData = (metrics?.phases || []).map((p: any, idx: number) => ({
    name: `P${(idx + 1).toString().padStart(2, "0")}`,
    fullName: `Phase 0${idx + 1}: ${p.title.replace(/^Phase \d+: /, "")}`,
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

  // Chart 3: First 12 Weeks Hours vs Actual
  const weekHoursData = weeks.slice(0, 12).map((w: any) => {
    const weekSessions = (sessionsData?.sessions || []).filter(
      (s: any) => s.weekId === w.weekId
    );
    const actualMins = weekSessions.reduce((acc: number, s: any) => acc + s.durationMinutes, 0);
    return {
      name: `W${w.weekNumber.toString().padStart(2, "0")}`,
      fullName: `Week ${w.weekNumber.toString().padStart(2, "0")}: ${w.title}`,
      Target: Number(w.targetHours) || 20,
      Actual: Math.round((actualMins / 60) * 10) / 10,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
        <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase block mb-1">
          Metrics & Velocity
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Learning Telemetry
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Completion velocity, phase milestones, and category balance across the 33-week syllabus.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Curriculum Completion"
          value={`${metrics?.overallPercentage ?? metrics?.taskCompletionPercentage ?? 0}%`}
          subtitle={`${metrics?.completedTasksCount ?? metrics?.doneRequiredTasks ?? 0} of ${metrics?.totalTasksCount ?? metrics?.totalActiveRequiredTasks ?? 0} tasks`}
          progress={metrics?.overallPercentage ?? metrics?.taskCompletionPercentage ?? 0}
          badge="Global"
        />
        <StatCard
          title="Weeks Attested"
          value={`${metrics?.completedWeeksCount ?? metrics?.fullyCompletedWeeks ?? 0} / ${metrics?.totalWeeksCount ?? metrics?.totalWeeks ?? 33}`}
          subtitle="Signed exit milestones"
          badge="Exit Seal"
        />
        <StatCard
          title="Verified Study Hours"
          value={`${metrics?.totalHoursStudied ?? metrics?.totalStudiedHours ?? 0}h`}
          subtitle="Logged stopwatch & sessions"
          badge="Time"
        />
        <StatCard
          title="Unique DSA Solved"
          value={metrics?.distinctDsaSolvedCount ?? 0}
          subtitle={`${dsaData?.totalAttemptsCount ?? 0} total attempts`}
          badge="Algorithms"
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phase Breakdown Chart */}
        <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-6 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Phase Progression (Completed vs Remaining Weeks)
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">P01–P11</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} interval={0} textAnchor="middle" />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="Remaining" fill="#a1a1aa" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Hours: Target vs Actual */}
        <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-6 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Study Pace: Target vs Verified Hours (W01–W12)
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">Target 20h/wk</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekHoursData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Target" fill="#94a3b8" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Task Distribution & Architecture Invariants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-6 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Task Category Balance
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">231 Total</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="count"
                  isAnimationActive={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                />
                <span className="truncate capitalize font-semibold">{c.name}: {c.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-6 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              System Architecture & Progress Invariants
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">Data Guarantees</span>
          </div>

          <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02]">
              <strong className="text-zinc-900 dark:text-zinc-200 block mb-1 font-bold">
                Stable Task Identifiers
              </strong>
              Tasks are keyed by immutable, deterministic IDs (<code className="text-blue-500 font-mono text-[11px] font-semibold">w01_t01</code> .. <code className="text-blue-500 font-mono text-[11px] font-semibold">w33_t07</code>).
              Re-importing CSV revisions preserves all checked items, confidence ratings, and notes without data loss.
            </div>
            <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02]">
              <strong className="text-zinc-900 dark:text-zinc-200 block mb-1 font-bold">
                Gated Phase Milestones
              </strong>
              A week is only marked as fully passed when 100% of required action items are done <span className="text-zinc-900 dark:text-zinc-200 font-bold">and</span> the practical Exit Checkpoint has been attested.
            </div>
            <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02]">
              <strong className="text-zinc-900 dark:text-zinc-200 block mb-1 font-bold">
                Verified Time Accounting
              </strong>
              Study hours reflect actual recorded focus sessions, preventing artificial target-based velocity distortions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
