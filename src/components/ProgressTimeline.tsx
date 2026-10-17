"use client";

import React from "react";
import { Check, Clock, Circle, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTimelineProps {
  tasks: any[];
  weekNumber: number;
  onSelectTask: (task: any) => void;
}

export function ProgressTimeline({
  tasks,
  weekNumber,
  onSelectTask,
}: ProgressTimelineProps) {
  const completedCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215] p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block font-semibold">
            Curriculum Checklist
          </span>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
            Your Progress
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-zinc-800 dark:text-zinc-200">
            {completedCount}/{totalCount}
          </span>
          <span className="text-[11px] font-bold text-[#E05353]">
            {percent}%
          </span>
        </div>
      </div>

      {/* Vertical Connected Stepper List */}
      <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-3 before:w-[2px] before:bg-black/[0.08] dark:before:bg-white/[0.08]">
        {tasks.map((task) => {
          const isDone = task.status === "done";
          const isInProgress = task.status === "in_progress";

          return (
            <div
              key={task.taskId}
              onClick={() => onSelectTask(task)}
              className="relative group cursor-pointer"
            >
              {/* Timeline Node Badge */}
              <div
                className={cn(
                  "absolute -left-[24px] top-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all duration-200 z-10",
                  isDone
                    ? "bg-[#E05353] text-white shadow-md shadow-[#E05353]/30"
                    : isInProgress
                    ? "bg-white dark:bg-[#18191E] ring-2 ring-amber-400 text-amber-500"
                    : "bg-white dark:bg-[#18191E] border-2 border-zinc-300 dark:border-zinc-600 text-transparent group-hover:border-zinc-500"
                )}
              >
                {isDone ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : isInProgress ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                )}
              </div>

              {/* Task Row Content */}
              <div className="p-2 -mr-2 rounded-xl transition-colors group-hover:bg-black/[0.04] dark:group-hover:bg-white/[0.04]">
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className={cn(
                      "text-xs leading-snug transition-colors",
                      isDone
                        ? "font-medium text-zinc-400 line-through"
                        : isInProgress
                        ? "font-bold text-amber-600 dark:text-amber-300"
                        : "font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white"
                    )}
                  >
                    {task.title}
                  </h4>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>

                <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-zinc-500">
                  <span className="capitalize">{task.category}</span>
                  {task.resourceLabel && (
                    <>
                      <span>•</span>
                      <span className="truncate max-w-[150px] text-zinc-600 dark:text-zinc-400">
                        {task.resourceLabel}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
