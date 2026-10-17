"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  ExternalLink,
  Clock,
  ShieldCheck,
  Check,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/StatCard";

const DSA_PATTERNS = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack / Monotonic Stack",
  "Binary Search",
  "Linked List",
  "Trees & BST",
  "Tries",
  "Heap / Priority Queue",
  "Backtracking",
  "Graphs & BFS/DFS",
  "Dynamic Programming 1D/2D",
  "Greedy",
  "Bit Manipulation",
  "Math & Geometry",
];

export default function DsaPage() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [distinctSolved, setDistinctSolved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [patternFilter, setPatternFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "easy" | "medium" | "hard">("all");

  // Form State
  const [title, setTitle] = useState("");
  const [pattern, setPattern] = useState(DSA_PATTERNS[0]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [url, setUrl] = useState("");
  const [solved, setSolved] = useState(true);
  const [solvedIndependently, setSolvedIndependently] = useState(true);
  const [minutesSpent, setMinutesSpent] = useState("30");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDsaData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dsa");
      const json = await res.json();
      setAttempts(json.attempts || []);
      setDistinctSolved(json.distinctSolvedCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDsaData();
  }, []);

  const handleCreateAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/dsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: title.trim(),
          pattern,
          difficulty,
          url: url.trim() || undefined,
          solved,
          solvedIndependently,
          minutesSpent: parseInt(minutesSpent, 10) || 0,
          notes: notes.trim() || undefined,
        }),
      });

      if (res.ok) {
        setTitle("");
        setUrl("");
        setNotes("");
        setShowAddForm(false);
        await fetchDsaData();
      }
    } catch (err) {
      console.error("Failed to log DSA attempt", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAttempts = attempts.filter((a) => {
    const matchesPattern = patternFilter === "all" || a.pattern === patternFilter;
    const matchesDiff = difficultyFilter === "all" || a.difficulty === difficultyFilter;
    return matchesPattern && matchesDiff;
  });

  const independentCount = attempts.filter((a) => a.solved && a.solvedIndependently).length;
  const totalSolved = attempts.filter((a) => a.solved).length;
  const independentRate = totalSolved > 0 ? Math.round((independentCount / totalSolved) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div>
          <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase block mb-1">
            Data Structures & Algorithms
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Algorithm Practice
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Problem tracking, pattern distribution, and editorial-free solve velocity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? "Cancel" : "Log Problem Attempt"}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Distinct Solved"
          value={distinctSolved}
          subtitle="Unique problem solutions"
          badge="Curriculum"
        />
        <StatCard
          title="Total Attempts Logged"
          value={attempts.length}
          subtitle="Includes repetitions & reviews"
          badge="Raw Log"
        />
        <StatCard
          title="Editorial-Free Rate"
          value={`${independentRate}%`}
          subtitle={`${independentCount} solved independently`}
          badge="Quality"
        />
      </div>

      {/* Add Attempt Slide-Down Panel */}
      {showAddForm && (
        <form
          onSubmit={handleCreateAttempt}
          className="rounded-3xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#111215] p-6 sm:p-7 space-y-5 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Record Problem Attempt</h3>
            <span className="text-[11px] font-mono text-zinc-400">Live entry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Problem Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 3Sum, LRU Cache, Trapping Rain Water"
                className="w-full bg-zinc-50 dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Pattern / Category:
              </label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
              >
                {DSA_PATTERNS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Difficulty:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-zinc-50 dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] capitalize"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Minutes Spent:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={minutesSpent}
                  onChange={(e) => setMinutesSpent(e.target.value)}
                  className="w-20 font-mono bg-zinc-50 dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                />
                <div className="flex gap-1.5">
                  {["20", "35", "50"].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setMinutesSpent(mins)}
                      className="px-2.5 py-1 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] text-[10px] font-mono text-zinc-600 dark:text-zinc-400 border border-black/[0.06] dark:border-white/[0.06] font-semibold"
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                URL (LeetCode/NeetCode):
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                className="w-full bg-zinc-50 dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3.5 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-medium">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={solved}
                onChange={(e) => setSolved(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-zinc-800 dark:text-zinc-200">Solved Successfully</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={solvedIndependently}
                onChange={(e) => setSolvedIndependently(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-zinc-800 dark:text-zinc-200">Solved Independently (Zero editorial peeking)</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Complexity & Key Pattern Insights:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. O(N) time with HashMap, two-pointer trick to avoid extra memory..."
              rows={2}
              className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-3 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 transition-opacity shadow-sm"
            >
              Save Problem Log
            </button>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/[0.06] dark:border-white/[0.06] text-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08]">
          {(["all", "easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={cn(
                "px-3.5 py-1 rounded-full font-semibold transition-all duration-200 capitalize",
                difficultyFilter === d
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              )}
            >
              {d === "all" ? `All (${attempts.length})` : d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={patternFilter}
            onChange={(e) => setPatternFilter(e.target.value)}
            className="bg-white dark:bg-[#111215] border border-black/[0.08] dark:border-white/[0.08] rounded-full px-4 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] shadow-sm"
          >
            <option value="all">All Patterns</option>
            {DSA_PATTERNS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attempts List */}
      <div className="space-y-3">
        {filteredAttempts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0E1014]/60 text-xs text-zinc-500">
            No DSA attempts found matching your filter criteria.
          </div>
        ) : (
          filteredAttempts.map((a) => {
            const diffStyle =
              a.difficulty === "easy"
                ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : a.difficulty === "hard"
                ? "text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
                : "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20";

            return (
              <div
                key={a.id}
                className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-5 text-zinc-900 dark:text-zinc-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-semibold",
                        diffStyle
                      )}
                    >
                      {a.difficulty}
                    </span>
                    <span className="text-[10px] font-mono bg-black/[0.04] dark:bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.06] text-zinc-600 dark:text-zinc-400 font-medium">
                      {a.pattern}
                    </span>
                    {a.solvedIndependently && (
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Independent</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                      {a.problemTitle}
                    </h4>
                    {a.url && (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-blue-500 transition-colors"
                        title="Problem Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {a.notes && (
                    <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400/90 leading-relaxed pt-1">
                      {a.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500 shrink-0 self-end sm:self-center">
                  {a.minutesSpent > 0 && (
                    <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{a.minutesSpent}m</span>
                    </span>
                  )}
                  <span>{new Date(a.attemptedAt).toISOString().split("T")[0]}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
