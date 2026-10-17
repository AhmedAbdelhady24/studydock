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
        "rounded-lg border p-4 transition-all text-sm",
        isPassed
          ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-200"
          : allRequiredTasksCompleted
          ? "border-white/[0.12] bg-[#121419] text-zinc-200"
          : "border-white/[0.06] bg-[#0E1014]/60 text-zinc-400"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
              {isPassed ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : allRequiredTasksCompleted ? (
                <Edit3 className="w-4 h-4 text-zinc-300" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
              )}
              <span>Week Exit Criteria</span>
            </span>

            {isPassed ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified
              </span>
            ) : allRequiredTasksCompleted ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Ready to Sign Off
              </span>
            ) : (
              <span className="text-[10px] font-mono text-zinc-500">
                (locked until all tasks done)
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {exitCriteria || "Complete all week exercises and pass the practical check."}
          </p>

          {isPassed && passedAt && (
            <p className="text-[11px] font-mono text-emerald-400/80">
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
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors"
            >
              Revoke Sign-off
            </button>
          ) : (
            <button
              type="button"
              disabled={!allRequiredTasksCompleted || isSubmitting}
              onClick={() => handleAttest(true)}
              className={cn(
                "px-3.5 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all",
                allRequiredTasksCompleted
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-sm"
                  : "bg-white/[0.04] text-zinc-500 cursor-not-allowed border border-white/[0.06]"
              )}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Attest & Sign Off</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
