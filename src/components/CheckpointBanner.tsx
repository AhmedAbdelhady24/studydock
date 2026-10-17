"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldAlert, Award, FileCheck2 } from "lucide-react";
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
  const [showNotesModal, setShowNotesModal] = useState(false);

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
        "rounded-xl border p-5 transition-all shadow-sm",
        isPassed
          ? "border-emerald-600/40 bg-emerald-950/20 text-emerald-200"
          : allRequiredTasksCompleted
          ? "border-primary/40 bg-primary/10 text-foreground"
          : "border-border bg-card/60 text-muted-foreground"
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              "rounded-lg p-2.5 shrink-0 border",
              isPassed
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : allRequiredTasksCompleted
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-secondary text-muted-foreground border-border"
            )}
          >
            {isPassed ? (
              <Award className="w-5 h-5" />
            ) : allRequiredTasksCompleted ? (
              <FileCheck2 className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Week Exit Checkpoint
              </h3>
              {isPassed ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  Attested & Passed
                </span>
              ) : allRequiredTasksCompleted ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-medium">
                  Ready for Attestation
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                  Gated by Required Tasks
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-2xl">
              <span className="font-medium text-foreground/80">Criteria:</span>{" "}
              {exitCriteria || "Complete all week objectives and submit code reviews."}
            </p>

            {isPassed && passedAt && (
              <p className="mt-1.5 text-[11px] font-mono text-emerald-400/90">
                Verified on {new Date(passedAt).toLocaleDateString()} at{" "}
                {new Date(passedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {isPassed ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNotesModal(!showNotesModal)}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-colors"
              >
                {showNotesModal ? "Hide Evidence" : "View Evidence"}
              </button>
              <button
                type="button"
                onClick={() => handleAttest(false)}
                disabled={isSubmitting}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-rose-900/50 text-rose-400 hover:bg-rose-950/40 transition-colors"
              >
                Revoke Pass
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!allRequiredTasksCompleted || isSubmitting}
              onClick={() => handleAttest(true)}
              className={cn(
                "px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm",
                allRequiredTasksCompleted
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]"
                  : "bg-secondary text-muted-foreground cursor-not-allowed border border-border"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Attest & Pass Week</span>
            </button>
          )}
        </div>
      </div>

      {/* Evidence Notes Drawer / Modal */}
      {(showNotesModal || (!isPassed && allRequiredTasksCompleted)) && (
        <div className="mt-4 pt-4 border-t border-border/60">
          <label className="block text-xs font-medium text-foreground mb-1">
            Checkpoint Evidence & Reflection Notes:
          </label>
          <textarea
            value={evidenceNotes}
            onChange={(e) => setEvidenceNotes(e.target.value)}
            placeholder="Document how exit criteria were met, add GitHub PR links, code review notes, or test run summaries..."
            rows={2}
            className="w-full text-xs font-mono rounded-md border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {isPassed && (
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleAttest(true)}
                disabled={isSubmitting}
                className="px-3 py-1 text-xs font-medium rounded bg-secondary hover:bg-secondary/80 text-foreground border border-border"
              >
                Update Evidence Notes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
