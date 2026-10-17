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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Algorithm Practice
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Problem tracking, pattern distribution, and editorial-free solve velocity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-1.5 rounded-md bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{showAddForm ? "Cancel" : "Log Problem Attempt"}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          className="rounded-lg border border-white/[0.14] bg-[#101216] p-5 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <h3 className="text-sm font-semibold text-white">Record Problem Attempt</h3>
            <span className="text-[11px] font-mono text-zinc-500">Live entry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Problem Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 3Sum, LRU Cache, Trapping Rain Water"
                className="w-full bg-[#090A0C] border border-white/[0.08] rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-blue-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Pattern / Category:
              </label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full bg-[#090A0C] border border-white/[0.08] rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-blue-500"
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
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Difficulty:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-[#090A0C] border border-white/[0.08] rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-blue-500 capitalize"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Minutes Spent:
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  value={minutesSpent}
                  onChange={(e) => setMinutesSpent(e.target.value)}
                  className="w-20 font-mono bg-[#090A0C] border border-white/[0.08] rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-1">
                  {["20", "35", "50"].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setMinutesSpent(mins)}
                      className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] font-mono text-zinc-400 hover:text-zinc-200 border border-white/[0.06]"
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                URL (LeetCode/NeetCode):
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                className="w-full bg-[#090A0C] border border-white/[0.08] rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={solved}
                onChange={(e) => setSolved(e.target.checked)}
                className="rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-zinc-300">Solved Successfully</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={solvedIndependently}
                onChange={(e) => setSolvedIndependently(e.target.checked)}
                className="rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-zinc-300">Solved Independently (Zero editorial peeking)</span>
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
              Complexity & Key Pattern Insights:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. O(N) time with HashMap, two-pointer trick to avoid extra memory..."
              rows={2}
              className="w-full text-xs font-mono bg-[#090A0C] border border-white/[0.08] rounded p-2.5 text-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold rounded bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              Save Problem Log
            </button>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-1 bg-[#101216] p-1 rounded-lg border border-white/[0.08]">
          {(["all", "easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={cn(
                "px-2.5 py-1 rounded font-medium transition-colors capitalize",
                difficultyFilter === d
                  ? "bg-white/[0.1] text-white"
                  : "text-zinc-400 hover:text-zinc-200"
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
            className="bg-[#101216] border border-white/[0.08] rounded px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-white/[0.2]"
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
      <div className="space-y-2">
        {filteredAttempts.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-white/[0.06] bg-[#0E1014]/60 text-xs text-zinc-500">
            No DSA attempts found matching your filter criteria.
          </div>
        ) : (
          filteredAttempts.map((a) => {
            const diffStyle =
              a.difficulty === "easy"
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : a.difficulty === "hard"
                ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                : "text-amber-400 bg-amber-500/10 border-amber-500/20";

            return (
              <div
                key={a.id}
                className="rounded-lg border border-white/[0.08] bg-[#101216] p-3.5 text-zinc-200 hover:border-white/[0.14] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold",
                        diffStyle
                      )}
                    >
                      {a.difficulty}
                    </span>
                    <span className="text-[10px] font-mono bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06] text-zinc-400">
                      {a.pattern}
                    </span>
                    {a.solvedIndependently && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Independent</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <h4 className="text-sm font-semibold text-zinc-100">
                      {a.problemTitle}
                    </h4>
                    {a.url && (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-blue-400 transition-colors"
                        title="Problem Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {a.notes && (
                    <p className="text-[11px] font-mono text-zinc-400/90 leading-relaxed pt-1">
                      {a.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500 shrink-0 self-end sm:self-center">
                  {a.minutesSpent > 0 && (
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Clock className="w-3 h-3 text-zinc-500" />
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
