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
          <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase block mb-1">
            Product Engineer Track • Week {activeWeek?.weekNumber || 1}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Your Progress Today
          </h2>
        </div>
        <Link
          href={`/weeks/${activeWeek?.weekId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors group"
        >
          <span>View Full Week Syllabus</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4-Card Bento Grid (Directly modeled on mobile designs Image 1 & 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Lavender / Soft Purple Week in Flight Card */}
        <div className="md:col-span-2 lg:col-span-2 bg-[#C8B6FF] text-[#19142B] rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#19142B]/10 text-[#19142B] text-[10px] font-bold uppercase tracking-wider">
                Current Sprint · Week {activeWeek?.weekNumber}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#19142B] leading-tight pt-1">
                {activeWeek?.title || "JavaScript Reboot & Syntax"}
              </h3>
              <p className="text-xs font-medium text-[#19142B]/80 leading-snug line-clamp-1">
                {activeWeek?.primaryCourses || "Core Syllabus"} • {activeWeek?.targetHours}h weekly goal
              </p>
            </div>

            {/* Circular Black Action Button with Angled Arrow */}
            <Link
              href={`/weeks/${activeWeek?.weekId}`}
              className="btn-circle-action group-hover:scale-110"
              title="Inspect Week Details"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Progress bar container (from screenshot) */}
          <div className="pt-6 relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#19142B]">
              <span>Sprint Progress</span>
              <span className="font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#19142B]/15 rounded-full h-3 p-0.5 overflow-hidden">
              <div
                className="bg-[#19142B] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(progressPercent, 4)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Sage Green Course Card */}
        <div className="md:col-span-2 lg:col-span-2 bg-[#D2E4D6] text-[#132317] rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/70 text-[#132317] text-[10px] font-bold uppercase tracking-wider">
                  Full Course
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/50 text-[#132317] text-[10px] font-semibold">
                  {activeWeek?.targetHours}h : 00m target
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#132317] leading-snug">
                {activeWeek?.primaryCourses || "JavaScript: The Hard Parts v3"}
              </h3>
              <p className="text-xs font-medium text-[#132317]/80 line-clamp-1">
                Phase: {activeWeek?.phaseTitle || "Syntax & Call Stack Mastery"}
              </p>
            </div>

            {/* Circular Black Action Button with Play / Arrow */}
            <Link
              href="/courses"
              className="btn-circle-action group-hover:scale-110"
              title="Open Course Syllabus"
            >
              <Play className="w-3.5 h-3.5 fill-white stroke-none ml-0.5" />
            </Link>
          </div>

          {/* Bottom Avatars / Tags */}
          <div className="pt-4 flex items-center justify-between text-xs text-[#132317]/80 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-white/80 border border-[#D2E4D6] flex items-center justify-center text-[10px] font-bold text-zinc-800">
                  JS
                </div>
                <div className="w-6 h-6 rounded-full bg-[#FFE6A3] border border-[#D2E4D6] flex items-center justify-center text-[10px] font-bold text-zinc-800">
                  TS
                </div>
                <div className="w-6 h-6 rounded-full bg-[#C8B6FF] border border-[#D2E4D6] flex items-center justify-center text-[10px] font-bold text-zinc-800">
                  +5
                </div>
              </div>
              <span className="text-[11px] font-medium ml-1">Frontend Masters & Books</span>
            </div>
            <span className="text-[11px] font-mono font-bold">Primary Lecture</span>
          </div>
        </div>

        {/* Card 3: Butter Yellow Stat Card (Tasks Done) */}
        <div className="bg-[#FFE6A3] text-[#281F08] rounded-3xl p-5 shadow-md flex flex-col justify-between min-h-[140px] group">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center text-[#281F08]">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
            </div>
            <Link
              href="/roadmap"
              className="btn-circle-action w-7 h-7 group-hover:scale-110"
              title="View Roadmap"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
          <div>
            <span className="text-xs font-bold text-[#281F08]/80 block">
              Week Tasks
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-[#281F08] tabular-nums">
                {completedTasks}
              </span>
              <span className="text-xs font-semibold text-[#281F08]/70">
                / {totalTasks} done
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Lilac / Soft Purple Stat Card (Hours Studied) */}
        <div className="bg-[#E2D9F3] text-[#221A33] rounded-3xl p-5 shadow-md flex flex-col justify-between min-h-[140px] group">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center text-[#221A33]">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
            <Link
              href="/sessions"
              className="btn-circle-action w-7 h-7 group-hover:scale-110"
              title="Open Focus Timer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
          <div>
            <span className="text-xs font-bold text-[#221A33]/80 block">
              Logged Hours
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-[#221A33] tabular-nums">
                {metrics?.totalHoursStudied || 0}
              </span>
              <span className="text-xs font-semibold text-[#221A33]/70">
                / {activeWeek?.targetHours || 16}h target
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Overall 33-Week Completion Rate */}
        <div className="bg-[#18191E] border border-white/[0.08] text-white rounded-3xl p-5 shadow-md flex flex-col justify-between min-h-[140px] group">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-300">
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
            <span className="text-xs font-semibold text-zinc-400 block">
              33w Program
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
                {metrics?.completedWeeksCount || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-400">
                of 33 weeks
              </span>
            </div>
          </div>
        </div>

        {/* Card 6: DSA Problem Bank Solved */}
        <div className="bg-[#18191E] border border-white/[0.08] text-white rounded-3xl p-5 shadow-md flex flex-col justify-between min-h-[140px] group">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <Sparkles className="w-4 h-4 text-purple-400 stroke-[2.2]" />
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
            <span className="text-xs font-semibold text-zinc-400 block">
              DSA Solved
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
                {metrics?.distinctDsaSolvedCount || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-400">
                unique drills
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
