"use client";

import React, { useEffect, useState } from "react";
import {
  Binary,
  PlusCircle,
  CheckCircle2,
  ExternalLink,
  Clock,
  Filter,
  Flame,
  Award,
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
        fetchDsaData();
      }
    } catch (err) {
      console.error("Failed to log DSA attempt", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAttempts =
    patternFilter === "all"
      ? attempts
      : attempts.filter((a) => a.pattern === patternFilter);

  const independentCount = attempts.filter((a) => a.solved && a.solvedIndependently).length;
  const totalSolved = attempts.filter((a) => a.solved).length;
  const independentRate = totalSolved > 0 ? Math.round((independentCount / totalSolved) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Data Structures & Algorithms Tracker
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Log coding problem attempts, pattern mastery, and independent solve rates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? "Close Form" : "Log Problem Attempt"}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Distinct Solved"
          value={distinctSolved}
          subtitle="Unique problem solutions"
          icon={Binary}
        />
        <StatCard
          title="Total Attempts Logged"
          value={attempts.length}
          subtitle="Includes repetitions & reviews"
          icon={Clock}
        />
        <StatCard
          title="Independent Rate"
          value={`${independentRate}%`}
          subtitle={`${independentCount} solved without editorial`}
          icon={Flame}
        />
      </div>

      {/* Add Attempt Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateAttempt}
          className="rounded-xl border border-primary/40 bg-card p-5 shadow-sm space-y-4"
        >
          <h3 className="text-sm font-bold text-foreground">Log DSA Problem</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Problem Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 3Sum, LRU Cache, Trapping Rain Water"
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Pattern / Category:
              </label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Difficulty:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary capitalize"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Minutes Spent:
              </label>
              <input
                type="number"
                min="0"
                value={minutesSpent}
                onChange={(e) => setMinutesSpent(e.target.value)}
                className="w-full font-mono bg-background border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Problem URL (LeetCode/NeetCode):
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={solved}
                onChange={(e) => setSolved(e.target.checked)}
                className="rounded border-border accent-primary"
              />
              <span className="text-foreground">Solved Successfully</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={solvedIndependently}
                onChange={(e) => setSolvedIndependently(e.target.checked)}
                className="rounded border-border accent-primary"
              />
              <span className="text-foreground">Solved Independently (no editorial)</span>
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Time & Space Complexity / Key Insights:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. O(N) time with HashMap, two-pointer trick to avoid extra memory..."
              rows={2}
              className="w-full text-xs font-mono bg-background border border-border rounded-md p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold rounded bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Attempt
            </button>
          </div>
        </form>
      )}

      {/* Attempts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            Logged Problems ({filteredAttempts.length})
          </h2>
        </div>

        {filteredAttempts.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-border bg-card text-xs text-muted-foreground">
            No DSA attempts logged yet. Click "Log Problem Attempt" above to record your first problem!
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredAttempts.map((a) => {
              const diffColor =
                a.difficulty === "easy"
                  ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/50"
                  : a.difficulty === "hard"
                  ? "text-rose-400 bg-rose-950/40 border-rose-800/50"
                  : "text-amber-400 bg-amber-950/40 border-amber-800/50";

              return (
                <div
                  key={a.id}
                  className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold",
                          diffColor
                        )}
                      >
                        {a.difficulty}
                      </span>
                      <span className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded border border-border text-muted-foreground">
                        {a.pattern}
                      </span>
                      {a.solvedIndependently && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.2 rounded border border-emerald-800/30">
                          Independent
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        {a.problemTitle}
                      </h4>
                      {a.url && (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {a.notes && (
                      <p className="text-xs font-mono text-muted-foreground">
                        {a.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground shrink-0 self-end sm:self-center">
                    {a.minutesSpent > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{a.minutesSpent}m</span>
                      </span>
                    )}
                    <span>{new Date(a.attemptedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
