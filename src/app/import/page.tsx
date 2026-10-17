"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  FileJson,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImportExportPage() {
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [courseFile, setCourseFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<any[]>([]);

  const handlePreviewUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planFile) {
      alert("Please select a Plan CSV file to preview.");
      return;
    }

    try {
      setLoadingPreview(true);
      setErrors([]);
      setPreview(null);
      setResultMessage(null);

      const formData = new FormData();
      formData.append("planFile", planFile);
      if (courseFile) {
        formData.append("courseFile", courseFile);
      }

      const res = await fetch("/api/import/preview", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrors(json.errors || [{ message: json.error || "Preview failed" }]);
      } else {
        setPreview(json);
      }
    } catch (err: any) {
      setErrors([{ message: err.message || "Failed to parse files" }]);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!preview) return;

    try {
      setIsExecuting(true);
      setResultMessage(null);

      const res = await fetch("/api/import/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planRows: preview.planRows,
          courseRows: preview.courseRows,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrors(json.errors || [{ message: json.error || "Import failed" }]);
      } else {
        setResultMessage(json.message);
        setPreview(null);
        setPlanFile(null);
        setCourseFile(null);
      }
    } catch (err: any) {
      setErrors([{ message: err.message || "Import execution failed" }]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/60">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Learning Plan Import & Backup Export
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Import revised roadmaps with 100% progress preservation. Export your data anytime in CSV or JSON.
        </p>
      </div>

      {resultMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <strong className="block font-semibold">Import Complete</strong>
            <span>{resultMessage}</span>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Validation Errors Found:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 font-mono text-[11px]">
            {errors.map((e, idx) => (
              <li key={idx}>
                {e.row ? `Row ${e.row} [${e.column}]: ` : ""}
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Import Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">
            Import Learning Plan CSV
          </h2>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Upload your <code className="font-mono text-primary">plan_import.csv</code> and optional <code className="font-mono text-primary">course_targets.csv</code>.
          Existing completed tasks, notes, DSA logs, and study sessions are strictly preserved.
        </p>

        <form onSubmit={handlePreviewUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/80 p-4 bg-background/50 space-y-2">
              <label className="block text-xs font-semibold text-foreground">
                Plan Tasks CSV (Required):
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setPlanFile(e.target.files?.[0] || null)}
                className="w-full text-xs font-mono text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              <span className="text-[11px] text-muted-foreground block">
                33 weeks • 231 tasks format
              </span>
            </div>

            <div className="rounded-lg border border-border/80 p-4 bg-background/50 space-y-2">
              <label className="block text-xs font-semibold text-foreground">
                Course Targets CSV (Optional):
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCourseFile(e.target.files?.[0] || null)}
                className="w-full text-xs font-mono text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 cursor-pointer"
              />
              <span className="text-[11px] text-muted-foreground block">
                16 course targets inventory
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-muted-foreground font-mono">
              Schema: v1.0 • Stable Task IDs
            </span>
            <button
              type="submit"
              disabled={loadingPreview || !planFile}
              className="px-4 py-2 rounded-lg font-semibold text-xs bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 transition-all disabled:opacity-40 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingPreview ? "Validating..." : "Validate & Preview Diff"}</span>
            </button>
          </div>
        </form>

        {/* Diff Preview Modal / Box */}
        {preview && (
          <div className="mt-6 pt-6 border-t border-border space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Preview Validation Summary</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <span className="text-muted-foreground block">Total Weeks</span>
                <span className="text-base font-bold font-mono text-foreground">
                  {preview.preview.totalWeeks}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <span className="text-muted-foreground block">Total Tasks</span>
                <span className="text-base font-bold font-mono text-foreground">
                  {preview.preview.totalTasks}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <span className="text-muted-foreground block">Preserved Existing</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {preview.preview.existingTasksCount}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <span className="text-muted-foreground block">New Tasks Added</span>
                <span className="text-base font-bold font-mono text-primary">
                  {preview.preview.newTasksCount}
                </span>
              </div>
            </div>

            {preview.preview.warnings && preview.preview.warnings.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs space-y-1">
                <strong className="block">Plan Diff Warnings:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {preview.preview.warnings.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isExecuting}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-sm transition-all"
              >
                <span>{isExecuting ? "Importing to Database..." : "Confirm & Execute Import"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">
            Data Portability & Full Backups
          </h2>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Export your learning progress anytime. CSV exports are automatically sanitized against spreadsheet formula injection.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <a
            href="/api/export?format=plan-csv"
            download
            className="p-3.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/60 flex items-center justify-between text-xs transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <span className="font-semibold text-foreground block group-hover:text-primary">
                  Export Plan CSV
                </span>
                <span className="text-[11px] text-muted-foreground">Tasks & checked status</span>
              </div>
            </div>
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
          </a>

          <a
            href="/api/export?format=courses-csv"
            download
            className="p-3.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/60 flex items-center justify-between text-xs transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
              <div className="text-left">
                <span className="font-semibold text-foreground block group-hover:text-primary">
                  Course Targets CSV
                </span>
                <span className="text-[11px] text-muted-foreground">16 course objectives</span>
              </div>
            </div>
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
          </a>

          <a
            href="/api/export?format=json"
            download
            className="p-3.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/60 flex items-center justify-between text-xs transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <FileJson className="w-4 h-4 text-purple-400" />
              <div className="text-left">
                <span className="font-semibold text-foreground block group-hover:text-primary">
                  Full Backup JSON
                </span>
                <span className="text-[11px] text-muted-foreground">Complete database dump</span>
              </div>
            </div>
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
          </a>
        </div>
      </div>
    </div>
  );
}
