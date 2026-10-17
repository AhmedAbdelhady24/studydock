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
        "rounded-lg border border-white/[0.08] bg-[#101216] p-4 text-zinc-100 transition-colors hover:border-white/[0.15]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-400 font-medium">
          {title}
        </span>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight tabular-nums text-white">
          {value}
        </span>
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-zinc-500 leading-normal">
          {subtitle}
        </p>
      )}

      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
            <div
              className="bg-emerald-500 h-1 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
