"use client";

import React, { useState } from "react";
import { Check, ShieldCheck, Lock, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckpointBannerProps {
  weekId: string;
  exitCriteria: string;
  allRequiredTasksCompleted: boolean;
  isPassed: boolean;
  passedAt?: Date | string | null;
  evidenceNotes?: string | null;
  onAttestationUpdated?: () => void;
}

export function CheckpointBanner({
  weekId,
  exitCriteria,
  allRequiredTasksCompleted,
  isPassed,
  passedAt,
  evidenceNotes: initialEvidence,
  onAttestationUpdated,
}: CheckpointBannerProps) {
  const [evidenceNotes, setEvidenceNotes] = useState(initialEvidence || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const handleAttest = async (passed: boolean) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/checkpoints/${weekId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passed,
          evidenceNotes: evidenceNotes.trim() || null,
        }),
      });

      if (res.ok && onAttestationUpdated) {
        onAttestationUpdated();
      }
    } catch (err) {
      console.error("Failed to attest checkpoint", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-3xl border p-6 transition-all text-sm shadow-sm",
        isPassed
          ? "border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/15 text-emerald-900 dark:text-emerald-200"
          : allRequiredTasksCompleted
          ? "border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#121419] text-zinc-900 dark:text-zinc-200"
          : "border-black/[0.06] dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0E1014]/60 text-zinc-600 dark:text-zinc-400"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              {isPassed ? (
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              ) : allRequiredTasksCompleted ? (
                <Edit3 className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
              )}
              <span>Week Exit Criteria</span>
            </span>

            {isPassed ? (
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                Verified
              </span>
            ) : allRequiredTasksCompleted ? (
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 font-semibold">
                Ready to Sign Off
              </span>
            ) : (
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                (locked until all tasks done)
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {exitCriteria || "Complete all week exercises and pass the practical check."}
          </p>

          {isPassed && passedAt && (
            <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400/80 font-semibold">
              Signed off on {new Date(passedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {isPassed ? (
            <button
              type="button"
              onClick={() => handleAttest(false)}
              disabled={isSubmitting}
              className="px-3.5 py-2 text-xs text-zinc-500 hover:text-rose-500 transition-colors font-medium cursor-pointer"
            >
              Revoke Sign-off
            </button>
          ) : (
            <button
              type="button"
              disabled={!allRequiredTasksCompleted || isSubmitting}
              onClick={() => handleAttest(true)}
              className={cn(
                "px-5 py-2.5 text-xs font-bold rounded-2xl flex items-center gap-2 transition-all cursor-pointer",
                allRequiredTasksCompleted
                  ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-md hover:scale-105 active:scale-95"
                  : "bg-black/[0.04] dark:bg-white/[0.04] text-zinc-400 dark:text-zinc-500 cursor-not-allowed border border-black/[0.06] dark:border-white/[0.06]"
              )}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Attest & Sign Off</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
