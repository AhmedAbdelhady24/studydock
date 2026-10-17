"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  FileJson,
  ArrowRight,
  ShieldCheck,
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.06]">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Data Portability & Plan Management
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Import revised syllabus CSVs with stable task IDs or export full progress backups.
        </p>
      </div>

      {resultMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <strong className="block font-semibold">Import Complete</strong>
            <span>{resultMessage}</span>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Validation Errors:</span>
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
      <div className="rounded-lg border border-white/[0.08] bg-[#101216] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">
              Import Learning Plan CSV
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Schema v1.0 • Idempotent</span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Upload your <code className="font-mono text-blue-400 text-[11px]">plan_import.csv</code> and optional <code className="font-mono text-blue-400 text-[11px]">course_targets.csv</code>.
          Existing completed tasks, notes, DSA logs, and focus sessions are strictly preserved.
        </p>

        <form onSubmit={handlePreviewUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded border border-white/[0.08] p-3.5 bg-[#090A0C] space-y-2">
              <label className="block text-xs font-semibold text-zinc-200">
                Plan Tasks CSV (Required):
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setPlanFile(e.target.files?.[0] || null)}
                className="w-full text-xs font-mono text-zinc-400 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-200 cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500 font-mono block">
                33 weeks • 231 tasks format
              </span>
            </div>

            <div className="rounded border border-white/[0.08] p-3.5 bg-[#090A0C] space-y-2">
              <label className="block text-xs font-semibold text-zinc-200">
                Course Targets CSV (Optional):
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCourseFile(e.target.files?.[0] || null)}
                className="w-full text-xs font-mono text-zinc-400 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white/[0.08] file:text-zinc-200 hover:file:bg-white/[0.12] cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500 font-mono block">
                16 course targets inventory
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-500 font-mono">
              Stable Task ID matching enabled
            </span>
            <button
              type="submit"
              disabled={loadingPreview || !planFile}
              className="px-3.5 py-1.5 rounded-md font-semibold text-xs bg-white text-black hover:bg-zinc-200 flex items-center gap-1.5 transition-colors disabled:opacity-30"
            >
              <span>{loadingPreview ? "Validating..." : "Validate & Preview Diff"}</span>
            </button>
          </div>
        </form>

        {/* Diff Preview Modal / Box */}
        {preview && (
          <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Validation Diff Summary</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Ready to apply</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded border border-white/[0.08] bg-[#090A0C]">
                <span className="text-zinc-500 text-[10px] font-mono block">Total Weeks</span>
                <span className="text-base font-semibold font-mono text-white">
                  {preview.preview.totalWeeks}
                </span>
              </div>
              <div className="p-2.5 rounded border border-white/[0.08] bg-[#090A0C]">
                <span className="text-zinc-500 text-[10px] font-mono block">Total Tasks</span>
                <span className="text-base font-semibold font-mono text-white">
                  {preview.preview.totalTasks}
                </span>
              </div>
              <div className="p-2.5 rounded border border-white/[0.08] bg-[#090A0C]">
                <span className="text-zinc-500 text-[10px] font-mono block">Preserved Existing</span>
                <span className="text-base font-semibold font-mono text-emerald-400">
                  {preview.preview.existingTasksCount}
                </span>
              </div>
              <div className="p-2.5 rounded border border-white/[0.08] bg-[#090A0C]">
                <span className="text-zinc-500 text-[10px] font-mono block">New Tasks Added</span>
                <span className="text-base font-semibold font-mono text-blue-400">
                  {preview.preview.newTasksCount}
                </span>
              </div>
            </div>

            {preview.preview.warnings && preview.preview.warnings.length > 0 && (
              <div className="p-3 rounded border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs space-y-1">
                <strong className="block text-[11px] font-semibold">Plan Diff Warnings:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-[10px] font-mono">
                  {preview.preview.warnings.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isExecuting}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 transition-colors"
              >
                <span>{isExecuting ? "Importing..." : "Confirm & Execute Import"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="rounded-lg border border-white/[0.08] bg-[#101216] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">
              Data Backups & Export
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Sanitized CSV & JSON</span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Export your learning progress anytime. CSV exports are sanitized against spreadsheet formula injection.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <a
            href="/api/export?format=plan-csv"
            download
            className="p-3 rounded border border-white/[0.08] hover:border-white/[0.18] bg-[#090A0C] flex items-center justify-between text-xs transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-semibold text-zinc-200 block group-hover:text-white">
                  Export Plan CSV
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Tasks & checked status</span>
              </div>
            </div>
            <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
          </a>

          <a
            href="/api/export?format=courses-csv"
            download
            className="p-3 rounded border border-white/[0.08] hover:border-white/[0.18] bg-[#090A0C] flex items-center justify-between text-xs transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              <div>
                <span className="font-semibold text-zinc-200 block group-hover:text-white">
                  Course Targets CSV
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">16 course objectives</span>
              </div>
            </div>
            <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
          </a>

          <a
            href="/api/export?format=json"
            download
            className="p-3 rounded border border-white/[0.08] hover:border-white/[0.18] bg-[#090A0C] flex items-center justify-between text-xs transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <FileJson className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-semibold text-zinc-200 block group-hover:text-white">
                  Full Backup JSON
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Complete database dump</span>
              </div>
            </div>
            <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
          </a>
        </div>
      </div>
    </div>
  );
}
