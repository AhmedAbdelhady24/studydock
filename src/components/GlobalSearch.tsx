"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  Command,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Code2,
  CornerDownLeft,
  Sparkles,
} from "lucide-react";
import { SearchResultItem } from "@/lib/search";
import { cn } from "@/lib/utils";

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  if (tokens.length === 0) return text;

  // Escape regex special chars
  const pattern = new RegExp(
    `(${tokens.map((t) => t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")})`,
    "gi"
  );

  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark
        key={i}
        className="bg-amber-200/60 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold rounded-sm px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Mounted state for SSR safety with portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect OS for keyboard shortcut display
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
    }
  }, []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (window.innerWidth < 768) {
          setIsMobileModalOpen(true);
        } else {
          setIsOpen(true);
          inputRef.current?.focus();
          inputRef.current?.select();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener for desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus mobile input on modal open
  useEffect(() => {
    if (isMobileModalOpen) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 50);
    }
  }, [isMobileModalOpen]);

  // Fetch debounced search results
  useEffect(() => {
    if (!isOpen && !isMobileModalOpen) return;

    let active = true;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Search request failed");
        const json = await res.json();
        if (active) {
          setResults(json.results || []);
          setSelectedIndex(0);
        }
      } catch (err) {
        if (active) {
          console.error("Search fetch error:", err);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, isOpen, isMobileModalOpen]);

  // Handle navigation to selected item
  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setIsMobileModalOpen(false);
    setQuery("");
    router.push(item.url);
  };

  // Keyboard navigation inside search dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0 ? (prev + 1) % results.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0
          ? (prev - 1 + results.length) % results.length
          : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setIsMobileModalOpen(false);
      inputRef.current?.blur();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: {
      type: SearchResultItem["type"];
      label: string;
      icon: any;
      items: { item: SearchResultItem; originalIndex: number }[];
    }[] = [
      { type: "nav", label: "Quick Navigation", icon: Compass, items: [] },
      { type: "week", label: "Weeks & Syllabus", icon: Calendar, items: [] },
      { type: "course", label: "Courses & Targets", icon: BookOpen, items: [] },
      { type: "task", label: "Tasks & Deliverables", icon: Code2, items: [] },
    ];

    results.forEach((item, index) => {
      const group = groups.find((g) => g.type === item.type);
      if (group) {
        group.items.push({ item, originalIndex: index });
      }
    });

    return groups.filter((g) => g.items.length > 0);
  }, [results]);

  const renderItemContent = (item: SearchResultItem, isSelected: boolean) => {
    const isTask = item.type === "task";
    const isWeek = item.type === "week";
    const isCourse = item.type === "course";
    const isNav = item.type === "nav";

    return (
      <div
        className={cn(
          "w-full text-left px-3.5 py-2.5 rounded-xl transition-colors duration-100 flex items-start gap-3 cursor-pointer group select-none",
          isSelected
            ? "bg-zinc-100 dark:bg-white/[0.08] text-zinc-900 dark:text-white"
            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
        )}
      >
        {/* Leading Icon / Status Indicator */}
        <div className="mt-0.5 shrink-0">
          {isNav && (
            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              <Compass className="w-4 h-4" />
            </div>
          )}
          {isWeek && (
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
          )}
          {isCourse && (
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
          )}
          {isTask && (
            <div
              className={cn(
                "w-7 h-7 rounded-lg border flex items-center justify-center",
                item.status === "done"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400"
                  : item.status === "in_progress"
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400"
                  : "bg-zinc-100 dark:bg-white/[0.05] border-black/[0.06] dark:border-white/[0.06] text-zinc-400"
              )}
            >
              {item.status === "done" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : item.status === "in_progress" ? (
                <Clock className="w-4 h-4" />
              ) : (
                <Code2 className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        {/* Main Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
              {highlightMatch(item.title, query)}
            </span>

            {/* Badge */}
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0",
                item.badge === "DSA"
                  ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
                  : item.badge === "Week"
                  ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50"
                  : item.badge === "Course"
                  ? "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50"
                  : item.badge === "Checkpoint"
                  ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                  : "bg-zinc-100 dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 border border-black/[0.06] dark:border-white/[0.06]"
              )}
            >
              {item.badge}
            </span>
          </div>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
            {item.subtitle}
          </p>

          {/* Snippet preview if matched in description/concepts */}
          {item.matchSnippet && (
            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 italic bg-black/[0.03] dark:bg-white/[0.03] px-2 py-0.5 rounded mt-1 border-l-2 border-zinc-400 dark:border-zinc-600 truncate">
              {highlightMatch(item.matchSnippet, query)}
            </p>
          )}
        </div>

        {/* Enter selection icon indicator */}
        <div className="shrink-0 self-center text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
          <CornerDownLeft
            className={cn(
              "w-3.5 h-3.5 transition-opacity",
              isSelected ? "opacity-100 text-zinc-800 dark:text-zinc-200" : "opacity-0 group-hover:opacity-60"
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Search Trigger Button (< md) */}
      <button
        type="button"
        onClick={() => setIsMobileModalOpen(true)}
        className="md:hidden w-9 h-9 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white active:scale-95 transition-transform"
        title="Search"
        aria-label="Open Search"
      >
        <Search className="w-4 h-4 stroke-[2.2]" />
      </button>

      {/* Desktop Search Bar Pill & Dropdown (>= md) */}
      <div ref={containerRef} className="relative hidden md:block">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search topics, tasks..."
            className={cn(
              "w-56 sm:w-64 xl:w-72 focus:w-80 xl:focus:w-96 pl-10 pr-14 h-9 py-2 text-xs rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 placeholder:truncate truncate focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all duration-200"
            )}
          />

          {/* Right Icon / Clear / Shortcut Badge */}
          <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
            ) : query.length > 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="pointer-events-auto p-0.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                title="Clear query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.06] text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                {isMac ? (
                  <>
                    <Command className="w-2.5 h-2.5" />
                    <span>K</span>
                  </>
                ) : (
                  <span>Ctrl K</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Anchored Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-[440px] xl:w-[480px] max-w-[90vw] max-h-[520px] bg-white dark:bg-[#15161A] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
          >
            {/* Header info */}
            <div className="px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-50/60 dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {query.trim().length > 0
                    ? `Results for "${query}"`
                    : "Quick Shortcuts & Suggestions"}
                </span>
              </div>
              <span>{results.length} found</span>
            </div>

            {/* Results scrollable list */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-2 space-y-3 max-h-[420px]"
            >
              {results.length === 0 && !isLoading ? (
                <div className="py-12 px-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] mx-auto flex items-center justify-center text-zinc-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                    Try searching for a topic like &ldquo;Two Pointers&rdquo;, a week like &ldquo;Week 4&rdquo;, or a course name.
                  </p>
                </div>
              ) : (
                groupedResults.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.type} className="space-y-1">
                      <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                        <Icon className="w-3 h-3" />
                        <span>{group.label}</span>
                      </div>
                      <div className="space-y-0.5">
                        {group.items.map(({ item, originalIndex }) => (
                          <div
                            key={item.id}
                            data-index={originalIndex}
                            onClick={() => handleSelect(item)}
                          >
                            {renderItemContent(
                              item,
                              selectedIndex === originalIndex
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer keyboard hints */}
            <div className="px-4 py-2 border-t border-black/[0.06] dark:border-white/[0.06] bg-zinc-50/80 dark:bg-white/[0.02] flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
              <span>Local-first DB</span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search Modal (< md) */}
      {mounted &&
        isMobileModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] md:hidden bg-[#FBFBFC] dark:bg-[#111215] flex flex-col animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#15161A] border-b border-black/[0.08] dark:border-white/[0.08] p-4 flex items-center gap-3 shadow-sm shrink-0">
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, tasks..."
                className="flex-1 text-sm bg-transparent border-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 placeholder:truncate focus:outline-none"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileModalOpen(false)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.08] text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
            </div>

            {/* Mobile Results Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-[#FBFBFC] dark:bg-[#111215]">
              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                </div>
              ) : results.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                groupedResults.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.type} className="space-y-1">
                      <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                        <Icon className="w-3 h-3" />
                        <span>{group.label}</span>
                      </div>
                      <div className="bg-white dark:bg-[#18191E] rounded-xl border border-black/[0.06] dark:border-white/[0.06] overflow-hidden divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                        {group.items.map(({ item, originalIndex }) => (
                          <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                          >
                            {renderItemContent(item, false)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
