import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  progress?: number;
  icon?: any;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  badge,
  progress,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215] p-5 text-zinc-900 dark:text-zinc-100 transition-all hover:shadow-md hover:border-black/20 dark:hover:border-white/[0.18]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold tracking-tight">
          {title}
        </span>
        {badge && (
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 border border-black/[0.06] dark:border-white/[0.08] font-medium">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight tabular-nums text-zinc-900 dark:text-white">
          {value}
        </span>
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
          {subtitle}
        </p>
      )}

      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-black/[0.06] dark:bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
