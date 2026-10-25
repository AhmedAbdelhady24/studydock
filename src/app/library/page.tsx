"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LearningMetadata } from "@/lib/learning-metadata";

const downloads = [
  ["Product_Engineer_33_Week_Measured_Tracker.md", "Measured roadmap"],
  ["Product_Engineer_33_Week_Resource_Updated_Tracker.md", "Updated resource tracker"],
  ["full_video_catalog.csv", "Full catalog"],
  ["verified_video_catalog.csv", "Detailed measured metadata"],
  ["scheduled_video_metadata.csv", "Scheduled lesson metadata"],
  ["weekly_workload_verified.csv", "Weekly workload"],
  ["practice_allocations_proposed.csv", "Practice estimates"],
  ["course_coverage_verified.csv", "Course coverage"],
  ["supplemental_resources_audit.csv", "Supplemental resources audit"],
  ["dsa_problem_registry_PROPOSAL_ONLY.csv", "Proposed problem registry"],
  ["dsa_count_metadata_patch_PROPOSAL_ONLY.csv", "Source DSA count corrections (applied)"],
  ["scan_failures.csv", "Media scan failures"],
  ["learning_coverage_gaps.md", "Learning gaps"],
  ["IMPORT_NOTES.md", "Source notes"],
];

export default function LibraryPage() {
  const [data, setData] = useState<LearningMetadata | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("videos");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [week, setWeek] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch("/api/library").then(async (response) => {
      if (!response.ok) throw new Error("Could not load the verified library. Please reload to retry.");
      setData(await response.json());
    }).catch((err) => setError(err.message));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!data) return <p role="status">Loading verified learning data…</p>;

  const requiredHours = data.weeks.reduce((sum, row) => sum + row.required_viewing_hours, 0);
  const optionalHours = data.weeks.reduce((sum, row) => sum + row.optional_viewing_hours, 0);
  const filtered = data.videos.filter((video) =>
    (priority === "all" || video.study_priority === priority) &&
    (!week || video.assigned_weeks.split(";").includes(week)) &&
    `${video.full_title} ${video.course_name} ${video.relative_path}`.toLowerCase().includes(query.toLowerCase())
  );
  const control = "rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-zinc-900 px-3 py-2 text-sm";
  const table = "w-full text-left text-sm [&_th]:p-3 [&_td]:p-3 [&_th]:font-semibold [&_tr]:border-b [&_tr]:border-black/10 dark:[&_tr]:border-white/10";

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Verified learning library</h1>
        <p className="text-sm text-zinc-500">Product Engineer · 33-week bundle snapshot · 20 October 2026</p>
        <p className="text-sm">{data.videos.length.toLocaleString()} catalog videos · {data.assignments.length} scheduled assignments · {requiredHours.toFixed(2)}h required viewing · {optionalHours.toFixed(2)}h optional viewing</p>
        <p className="text-xs text-zinc-500">Viewing is measured from video metadata at 1×. Practice hours are estimates. Neither measure represents completed learning or verifies full playback.</p>
      </header>

      <nav aria-label="Learning data views" className="flex flex-wrap gap-2">
        {[["videos", "Video catalog"], ["workload", "Weekly workload"], ["coverage", "Course coverage"], ["dsa", "DSA proposals"]].map(([id, label]) => (
          <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}
            className={`${control} ${tab === id ? "font-bold ring-2 ring-blue-500" : ""}`}>{label}</button>
        ))}
      </nav>

      {tab === "videos" && <section className="space-y-4" aria-label="Video catalog">
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs">Search title, course or path
            <input className={control} value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} placeholder="e.g. TypeScript or NestJS" />
          </label>
          <label className="flex flex-col gap-1 text-xs">Priority
            <select className={control} value={priority} onChange={(e) => { setPriority(e.target.value); setPage(0); }}>
              <option value="all">All videos</option><option value="required">Required in at least one week</option><option value="optional">Optional only</option><option value="reference_only">Reference only</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs">Assigned week
            <select className={control} value={week} onChange={(e) => { setWeek(e.target.value); setPage(0); }}>
              <option value="">Any week</option>{data.weeks.map((row) => <option key={row.week_id} value={row.week_number}>Week {row.week_number}</option>)}
            </select>
          </label>
        </div>
        <p role="status" className="text-sm">{filtered.length.toLocaleString()} matching videos</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <caption className="sr-only">Catalog videos with measured duration, local path and assigned weeks</caption>
            <thead><tr><th scope="col">Lesson & local path</th><th scope="col">Duration</th><th scope="col">Assignments</th></tr></thead>
            <tbody>{filtered.slice(page * 50, (page + 1) * 50).map((video) => <tr key={video.relative_path}>
              <td><p className="font-medium">{video.full_title}</p><p className="text-xs text-zinc-500">{video.course_name}</p><details className="mt-1 text-xs"><summary className="cursor-pointer">Local file path</summary><code className="break-all">{video.relative_path}</code></details></td>
              <td className="whitespace-nowrap">{video.duration_seconds === null ? "Unavailable · invalid media" : `${(video.duration_seconds / 60).toFixed(1)} min`}</td>
              <td><p className="text-xs">{video.study_priority.replaceAll("_", " ")}</p><div className="flex flex-wrap gap-2">{video.assigned_weeks.split(";").filter(Boolean).map((number) => <Link key={number} className="underline text-xs" href={`/weeks/product-engineer-33-week-w${number.padStart(2, "0")}`}>Week {number}</Link>)}</div></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button className={control} disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page + 1} of {Math.max(1, Math.ceil(filtered.length / 50))}</span>
          <button className={control} disabled={(page + 1) * 50 >= filtered.length} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </section>}

      {tab === "workload" && <section className="space-y-3">
        <h2 className="font-semibold">Measured viewing, proposed practice</h2>
        <p className="text-sm text-zinc-500">All 33 weeks remain unverified for actual study pace. Repeated lessons are counted each time. Estimates describe the verified bundle snapshot.</p>
        <div className="overflow-x-auto"><table className={table}>
          <caption className="sr-only">Weekly workload in hours</caption>
          <thead><tr><th scope="col">Week</th><th scope="col">Required video</th><th scope="col">Optional video</th><th scope="col">Estimated practice</th><th scope="col">Proposed required total</th><th scope="col">Target</th></tr></thead>
          <tbody>{data.weeks.map((row) => <tr key={row.week_id}>
            <td><Link href={`/weeks/${row.week_id}`} className="underline">Week {row.week_number}</Link></td>
            {[row.required_viewing_hours, row.optional_viewing_hours, row.allocated_practice_hours, row.required_total_estimated_hours, row.target_hours].map((hours, index) => <td key={index}>{hours.toFixed(2)}h</td>)}
          </tr>)}</tbody>
        </table></div>
      </section>}

      {tab === "coverage" && <section className="space-y-3">
        <h2 className="font-semibold">Course inventory and assigned videos</h2>
        <p className="text-sm text-zinc-500">{data.coverage.length} course and supplemental groups; 16 imported goals. File counts include labeled additional copies. Scheduled videos are separate from <Link className="underline" href="/courses">your course goals and actual progress</Link>.</p>
        <div className="overflow-x-auto"><table className={table}>
          <caption className="sr-only">Course inventory and video assignment counts</caption>
          <thead><tr><th scope="col">Course</th><th scope="col">Available files</th><th scope="col">Required assignments</th><th scope="col">Optional assignments</th><th scope="col">Unique assigned files</th></tr></thead>
          <tbody>{data.coverage.map((row) => <tr key={row.course_name}><td>{row.course_name}</td>{[row.total_unique_cataloged_videos, row.required_scheduled_assignments, row.optional_scheduled_assignments, row.unique_scheduled_videos].map((count, index) => <td key={index}>{count}</td>)}</tr>)}</tbody>
        </table></div>
      </section>}

      {tab === "dsa" && <section className="space-y-3">
        <h2 className="font-semibold">Problem registry — proposal only</h2>
        <p className="text-sm">66 primary problem slots from the existing roadmap and 9 optional extra slots. Problem identities have not been selected; slots are not evidence of distinct solved problems.</p>
        <p className="text-sm text-zinc-500">The app’s five missing numerical targets were filled from the existing two-problems-per-week instructions, giving 66 structured targets. Extra slots do not block weekly completion. Use <Link className="underline" href="/dsa">DSA practice</Link> to record real attempts.</p>
        <details><summary className="cursor-pointer font-medium">Browse all {data.dsaSlots.length} proposed slots</summary><ul className="mt-3 space-y-2 text-sm">{data.dsaSlots.map((slot) => <li key={`${slot.existing_dsa_task_id}-${slot.slot_type}-${slot.slot_number}`}>
          Week {slot.week_number} · {slot.slot_type.includes("EXTRA") ? "Optional extra" : "Primary"} slot {slot.slot_number} · Problem not selected
        </li>)}</ul></details>
      </section>}

      <details className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
        <summary className="cursor-pointer font-medium">Download source reports & roadmap</summary>
        <ul className="mt-3 flex flex-wrap gap-4 text-sm">{downloads.map(([filename, label]) => <li key={filename}><a className="underline" href={`/learning-data/${filename}`} download>{label}</a></li>)}</ul>
      </details>
    </div>
  );
}
