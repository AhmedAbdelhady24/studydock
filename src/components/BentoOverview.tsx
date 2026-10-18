"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  Sparkles,
  Layers,
  GraduationCap,
  Play,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoOverviewProps {
  activeWeek: any;
  metrics: any;
}

export function BentoOverview({ activeWeek, metrics }: BentoOverviewProps) {
  const activeTasks = activeWeek?.tasks || [];
  const completedTasks = activeTasks.filter((t: any) => t.status === "done").length;
  const totalTasks = activeTasks.length || 7;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <section className="space-y-4">
      {/* Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase block mb-1">
            Product Engineer Track • Week {activeWeek?.weekNumber || 1}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Your Progress Today
          </h2>
        </div>
        <Link
          href={`/weeks/${activeWeek?.weekId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors group"
        >
          <span>View Full Week Syllabus</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4-Card Bento Grid (Directly modeled on mobile designs Image 1 & 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Primary Sprint in Flight (Flagship Card) */}
        <div className="md:col-span-2 lg:col-span-2 bg-zinc-950 dark:bg-[#13151A] text-white rounded-3xl p-6 border border-black/[0.1] dark:border-white/[0.08] shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-200 text-[11px] font-mono font-semibold uppercase tracking-wider border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Current Sprint · Week {activeWeek?.weekNumber}</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight pt-1">
                {activeWeek?.title || "JavaScript Reboot & Syntax"}
              </h3>
              <p className="text-xs font-medium text-zinc-400 leading-snug line-clamp-1">
                {activeWeek?.primaryCourses || "Core Syllabus"} • {activeWeek?.targetHours}h weekly goal
              </p>
            </div>

            {/* Circular Action Button with Angled Arrow */}
            <Link
              href={`/weeks/${activeWeek?.weekId}`}
              className="w-9 h-9 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-all duration-150 shrink-0 shadow-sm active:scale-95 group-hover:scale-105"
              title="Inspect Week Details"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Progress bar container */}
          <div className="pt-6 relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider">Sprint Progress</span>
              <span className="font-mono text-white tabular-nums">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 p-0.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(progressPercent, 4)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Primary Course Focus */}
        <div className="md:col-span-2 lg:col-span-2 bg-white dark:bg-[#121418] text-zinc-900 dark:text-white rounded-3xl p-6 border border-black/[0.08] dark:border-white/[0.08] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-black/20 dark:hover:border-white/20 transition-all">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border border-black/[0.06] dark:border-white/[0.08] text-[11px] font-mono font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Primary Course</span>
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 text-[11px] font-mono font-semibold border border-black/[0.06] dark:border-white/[0.08]">
                  {activeWeek?.targetHours}h target
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-snug">
                {activeWeek?.primaryCourses || "JavaScript: The Hard Parts v3"}
              </h3>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1">
                Phase: {activeWeek?.phaseTitle || "Syntax & Call Stack Mastery"}
              </p>
            </div>

            {/* Circular Action Button */}
            <Link
              href="/courses"
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 flex items-center justify-center transition-all duration-150 shrink-0 shadow-sm active:scale-95 group-hover:scale-105"
              title="Open Course Syllabus"
            >
              <Play className="w-3.5 h-3.5 fill-current stroke-none ml-0.5" />
            </Link>
          </div>

          {/* Bottom Avatars / Tags */}
          <div className="pt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium border-t border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">Frontend Masters & Books</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300">Core Lecture</span>
          </div>
        </div>

        {/* Card 3: Sprint Tasks */}
        <div className="bg-white dark:bg-[#121418] text-zinc-900 dark:text-white border border-black/[0.08] dark:border-white/[0.08] rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px] group hover:border-black/20 dark:hover:border-white/20 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
            </div>
            <Link
              href="/roadmap"
              className="w-7 h-7 rounded-full bg-black/[0.05] dark:bg-white/[0.06] hover:bg-zinc-900 dark:hover:bg-white text-zinc-700 dark:text-zinc-300 hover:text-white dark:hover:text-zinc-950 flex items-center justify-center transition-all duration-150 group-hover:scale-105 active:scale-95"
              title="View Roadmap"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
              Week Tasks
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white tabular-nums">
                {completedTasks}
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                / {totalTasks} done
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Hours Studied */}
        <div className="bg-white dark:bg-[#121418] text-zinc-900 dark:text-white border border-black/[0.08] dark:border-white/[0.08] rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px] group hover:border-black/20 dark:hover:border-white/20 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
            <Link
              href="/sessions"
              className="w-7 h-7 rounded-full bg-black/[0.05] dark:bg-white/[0.06] hover:bg-zinc-900 dark:hover:bg-white text-zinc-700 dark:text-zinc-300 hover:text-white dark:hover:text-zinc-950 flex items-center justify-center transition-all duration-150 group-hover:scale-105 active:scale-95"
              title="Open Focus Timer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
              Logged Hours
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white tabular-nums">
                {metrics?.totalHoursStudied || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                / {activeWeek?.targetHours || 16}h target
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Overall 33-Week Completion Rate */}
        <div className="bg-white dark:bg-[#18191E] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white rounded-3xl p-5 shadow-sm dark:shadow-md flex flex-col justify-between min-h-[140px] group transition-all">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Layers className="w-4 h-4 stroke-[2.2]" />
            </div>
            <Link
              href="/roadmap"
              className="btn-circle-action w-7 h-7 group-hover:scale-110"
              title="All 33 Weeks"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
              33w Program
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white tabular-nums">
                {metrics?.completedWeeksCount || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                of 33 weeks
              </span>
            </div>
          </div>
        </div>

        {/* Card 6: DSA Problem Bank Solved */}
        <div className="bg-white dark:bg-[#18191E] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white rounded-3xl p-5 shadow-sm dark:shadow-md flex flex-col justify-between min-h-[140px] group transition-all">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
            </div>
            <Link
              href="/dsa"
              className="btn-circle-action w-7 h-7 group-hover:scale-110"
              title="DSA Bank"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
              DSA Solved
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white tabular-nums">
                {metrics?.distinctDsaSolvedCount || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                unique drills
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
