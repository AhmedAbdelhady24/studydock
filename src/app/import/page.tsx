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
  GraduationCap,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLAN_COLUMNS = [
  { name: "plan_slug", required: true, type: "string (slug)", desc: "Lowercase URL-safe identifier (e.g. my-learning-track)", example: "product-engineer" },
  { name: "week_id", required: true, type: "string", desc: "Unique week slug across the plan", example: "product-engineer-w01" },
  { name: "week_number", required: true, type: "integer", desc: "Sequential week number (1, 2, 3...)", example: "1" },
  { name: "week_title", required: true, type: "string", desc: "Human-readable week title", example: "Foundations & Syntax" },
  { name: "phase", required: true, type: "string", desc: "Phase Roman numeral or code", example: "I" },
  { name: "phase_title", required: true, type: "string", desc: "Phase topic name", example: "Core Principles" },
  { name: "task_id", required: true, type: "string", desc: "Stable unique task ID for idempotent progress tracking", example: "pe-w01-task-01" },
  { name: "category", required: true, type: "enum", desc: "course | implementation | dsa | design | quality | checkpoint | other", example: "implementation" },
  { name: "task_title", required: true, type: "string", desc: "Short action title for the task", example: "Build CLI Task Manager" },
  { name: "description", required: false, type: "string", desc: "Detailed deliverable instructions or problem link", example: "Implement pure functions..." },
  { name: "required", required: true, type: "boolean", desc: "true | false (must pass to complete the week)", example: "true" },
  { name: "sort_order", required: false, type: "integer", desc: "Display sequence within the week (1, 2...)", example: "1" },
  { name: "exit_criteria", required: false, type: "string", desc: "Milestone requirements to attest and sign off week", example: "Pass 5 unit tests without AI" },
  { name: "target_hours", required: false, type: "number", desc: "Estimated study hours for the week", example: "16" },
  { name: "primary_courses", required: false, type: "string", desc: "Course reference or textbook attribution", example: "Clean Code & Docs" },
  { name: "concepts", required: false, type: "string", desc: "Comma-separated concept tags", example: "Arrays, Closures, Async" },
  { name: "dsa_target_count", required: false, type: "number", desc: "Minimum problems to solve independently", example: "2" },
  { name: "initial_checked", required: false, type: "boolean", desc: "Whether task starts completed (true | false)", example: "false" },
];

const COURSE_COLUMNS = [
  { name: "plan_slug", required: true, type: "string", desc: "Matching plan_slug from the plan CSV", example: "product-engineer" },
  { name: "course_id", required: true, type: "string", desc: "Unique identifier for the course", example: "course-clean-code" },
  { name: "course_title", required: true, type: "string", desc: "Full display name of course or textbook", example: "Clean Code Architecture" },
  { name: "planned_weeks", required: false, type: "string", desc: "Weeks in which this course is studied", example: "1–4" },
  { name: "coverage_kind", required: true, type: "enum", desc: "percentage | count | text", example: "percentage" },
  { name: "target_min", required: false, type: "number", desc: "Minimum target value", example: "80" },
  { name: "target_max", required: false, type: "number", desc: "Maximum target value", example: "100" },
  { name: "target_unit", required: false, type: "string", desc: "Unit symbol (% or problems)", example: "%" },
  { name: "reference_url", required: false, type: "string (url)", desc: "Web link to syllabus or video course", example: "https://example.com" },
];

export default function ImportExportPage() {
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [courseFile, setCourseFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showSchemaGuide, setShowSchemaGuide] = useState(false);
  const [schemaTab, setSchemaTab] = useState<"plan" | "courses">("plan");

  const copyHeaderRow = (type: "plan" | "courses") => {
    const header =
      type === "plan"
        ? "plan_slug,week_id,week_number,week_title,phase,phase_title,primary_courses,concepts,exit_criteria,target_hours,source_anchor,task_id,category,task_title,description,required,sort_order,dsa_target_count,initial_checked"
        : "plan_slug,course_id,course_title,planned_weeks,coverage_kind,target_min,target_max,target_unit,coverage_note,reference_url";

    navigator.clipboard.writeText(header);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="pb-5 border-b border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Curriculum Data & Portability
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Import custom curriculum CSVs with stable task IDs, download verified templates, or export full backups.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-semibold shrink-0">
            Schema v1.0 • Idempotent
          </span>
        </div>
      </div>

      {resultMessage && (
        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <strong className="block font-bold text-sm">Import Completed Successfully</strong>
            <span className="text-xs">{resultMessage}</span>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Validation Errors Detected:</span>
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

      {/* ========================================================= */}
      {/* SECTION 1: DOWNLOAD TEMPLATES & STARTER KITS               */}
      {/* ========================================================= */}
      <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-6 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                Download CSV Templates & Starter Blueprints
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Start with a verified CSV format to import your own custom weeks, categories, and targets.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSchemaGuide(!showSchemaGuide)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showSchemaGuide ? "Hide Column Guide" : "View Column Guide"}</span>
            {showSchemaGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 3-Card Template Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Plan Tasks Template */}
          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-zinc-50/70 dark:bg-[#15171D] p-4 flex flex-col justify-between space-y-4 hover:border-black/20 dark:hover:border-white/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  Required Format
                </span>
                <span className="text-[10px] font-mono text-zinc-400">.csv</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Plan Tasks Template
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Standard syllabus template with week titles, deliverables, exit criteria, and category tags.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-black/[0.05] dark:border-white/[0.05]">
              <a
                href="/templates/plan_template.csv"
                download="plan_template.csv"
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download plan_template.csv</span>
              </a>
              <button
                type="button"
                onClick={() => copyHeaderRow("plan")}
                className="w-full py-1.5 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedKey === "plan" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Headers Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Header Row</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Course Targets Template */}
          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-zinc-50/70 dark:bg-[#15171D] p-4 flex flex-col justify-between space-y-4 hover:border-black/20 dark:hover:border-white/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  Optional Targets
                </span>
                <span className="text-[10px] font-mono text-zinc-400">.csv</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Course Targets Template
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Define courses, books, target completion percentages (%), or problem counts across weeks.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-black/[0.05] dark:border-white/[0.05]">
              <a
                href="/templates/courses_template.csv"
                download="courses_template.csv"
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download courses_template.csv</span>
              </a>
              <button
                type="button"
                onClick={() => copyHeaderRow("courses")}
                className="w-full py-1.5 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedKey === "courses" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Headers Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Header Row</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 3: 4-Week Starter Blueprint */}
          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-zinc-50/70 dark:bg-[#15171D] p-4 flex flex-col justify-between space-y-4 hover:border-black/20 dark:hover:border-white/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                  Ready Starter Kit
                </span>
                <span className="text-[10px] font-mono text-zinc-400">4 Weeks</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                4-Week Curriculum Starter
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Full 4-week sample curriculum pre-filled with DSA drills, coding labs, and exit milestone criteria.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-black/[0.05] dark:border-white/[0.05]">
              <a
                href="/templates/starter_curriculum_template.csv"
                download="starter_curriculum_template.csv"
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Download 4-Week Starter</span>
              </a>
              <span className="text-[10px] font-mono text-zinc-400 text-center block pt-1">
                Upload directly to test the app
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible Column Reference Guide */}
        {showSchemaGuide && (
          <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSchemaTab("plan")}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                    schemaTab === "plan"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  )}
                >
                  Plan Tasks Columns ({PLAN_COLUMNS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSchemaTab("courses")}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                    schemaTab === "courses"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  )}
                >
                  Course Targets Columns ({COURSE_COLUMNS.length})
                </button>
              </div>

              <span className="text-[11px] font-mono text-zinc-500">
                UTF-8 encoded • Header row required
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-black/[0.08] dark:border-white/[0.08]">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 dark:bg-white/[0.04] text-[11px] font-mono text-zinc-500 border-b border-black/[0.06] dark:border-white/[0.06]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Column</th>
                    <th className="py-2.5 px-3 font-semibold">Required</th>
                    <th className="py-2.5 px-3 font-semibold">Type</th>
                    <th className="py-2.5 px-3 font-semibold">Description / Allowed Values</th>
                    <th className="py-2.5 px-3 font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                  {(schemaTab === "plan" ? PLAN_COLUMNS : COURSE_COLUMNS).map((col) => (
                    <tr key={col.name} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-2 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-200">
                        {col.name}
                      </td>
                      <td className="py-2 px-3">
                        {col.required ? (
                          <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-400">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-zinc-500 dark:text-zinc-400">
                        {col.type}
                      </td>
                      <td className="py-2 px-3 text-zinc-700 dark:text-zinc-300">
                        {col.desc}
                      </td>
                      <td className="py-2 px-3 font-mono text-zinc-500 text-[11px]">
                        {col.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: IMPORT YOUR CUSTOM PLAN CSV                     */}
      {/* ========================================================= */}
      <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                Import Learning Plan CSV
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Upload your custom curriculum CSV. Existing completed tasks, notes, DSA logs, and focus sessions are strictly preserved.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Preserves All Progress
          </span>
        </div>

        <form onSubmit={handlePreviewUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plan File Input */}
            <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-4 bg-zinc-50/60 dark:bg-[#14161B] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-200">
                  Plan Tasks CSV (Required)
                </label>
                {planFile && (
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {(planFile.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setPlanFile(e.target.files?.[0] || null)}
                className="w-full text-xs font-mono text-zinc-600 dark:text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-900 file:text-white dark:file:bg-white dark:file:text-zinc-950 hover:file:opacity-90 cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block">
                Custom syllabus • Dynamic weeks & tasks format
              </span>
            </div>

            {/* Course Targets Input */}
            <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-4 bg-zinc-50/60 dark:bg-[#14161B] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-200">
                  Course Targets CSV (Optional)
                </label>
                {courseFile && (
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {(courseFile.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCourseFile(e.target.files?.[0] || null)}
                className="w-full text-xs font-mono text-zinc-600 dark:text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-black/[0.06] file:text-zinc-800 dark:file:bg-white/[0.08] dark:file:text-zinc-200 hover:file:opacity-90 cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block">
                Optional course syllabus & progress targets
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
              className="px-4 py-2 rounded-xl font-bold text-xs bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 flex items-center gap-2 transition-opacity disabled:opacity-40 shadow-sm cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{loadingPreview ? "Validating CSV Schema..." : "Validate & Preview Diff"}</span>
            </button>
          </div>
        </form>

        {/* Diff Preview Box */}
        {preview && (
          <div className="mt-5 pt-5 border-t border-black/[0.06] dark:border-white/[0.06] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Validation Diff Summary</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Ready to apply
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#14161B]">
                <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono block">Total Weeks</span>
                <span className="text-lg font-bold font-mono text-zinc-900 dark:text-white">
                  {preview.preview.totalWeeks}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#14161B]">
                <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono block">Total Tasks</span>
                <span className="text-lg font-bold font-mono text-zinc-900 dark:text-white">
                  {preview.preview.totalTasks}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#14161B]">
                <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono block">Preserved Existing</span>
                <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {preview.preview.existingTasksCount}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#14161B]">
                <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono block">New Tasks Added</span>
                <span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
                  {preview.preview.newTasksCount}
                </span>
              </div>
            </div>

            {preview.preview.warnings && preview.preview.warnings.length > 0 && (
              <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs space-y-1.5">
                <strong className="block text-xs font-bold">Plan Diff Warnings:</strong>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px] font-mono">
                  {preview.preview.warnings.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isExecuting}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                <span>{isExecuting ? "Importing Curriculum..." : "Confirm & Execute Import"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: DATA BACKUPS & EXPORT                           */}
      {/* ========================================================= */}
      <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                Data Backups & Export
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Export your active learning progress anytime. CSV exports are sanitized against spreadsheet formula injection.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Sanitized CSV & JSON
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <a
            href="/api/export?format=plan-csv"
            download
            className="p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 bg-zinc-50/60 dark:bg-[#14161B] flex items-center justify-between text-xs transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-200 block group-hover:text-black dark:group-hover:text-white transition-colors">
                  Export Plan CSV
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Tasks & checked status</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
          </a>

          <a
            href="/api/export?format=courses-csv"
            download
            className="p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 bg-zinc-50/60 dark:bg-[#14161B] flex items-center justify-between text-xs transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-200 block group-hover:text-black dark:group-hover:text-white transition-colors">
                  Course Targets CSV
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Curriculum course targets</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
          </a>

          <a
            href="/api/export?format=json"
            download
            className="p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 bg-zinc-50/60 dark:bg-[#14161B] flex items-center justify-between text-xs transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-200 block group-hover:text-black dark:group-hover:text-white transition-colors">
                  Full Backup JSON
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Complete database dump</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
