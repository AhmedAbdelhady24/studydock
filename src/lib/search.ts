export type SearchResultType = "task" | "week" | "course" | "nav";

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  url: string;
  badge: string;
  category?: string;
  status?: string;
  weekId?: string;
  weekNumber?: number;
  taskId?: string;
  matchSnippet?: string;
  score?: number;
}

export interface NavShortcut {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  keywords: string[];
}

export const NAV_SHORTCUTS: NavShortcut[] = [
  {
    id: "nav-library",
    title: "Verified Video Library & Workload",
    subtitle: "Measured video durations, weekly estimates, coverage and DSA proposals",
    url: "/library",
    keywords: ["library", "videos", "duration", "workload", "catalog", "coverage", "verified"],
  },
  {
    id: "nav-today",
    title: "Today's Workbench",
    subtitle: "Active focus tasks, pomodoro timer, and daily velocity",
    url: "/",
    keywords: ["today", "dashboard", "home", "sprint", "focus", "workbench", "active", "daily"],
  },
  {
    id: "nav-roadmap",
    title: "Roadmap & Syllabus",
    subtitle: "Full multi-week learning plan, milestones, and phases",
    url: "/roadmap",
    keywords: ["roadmap", "syllabus", "weeks", "curriculum", "timeline", "phases", "overview", "plan"],
  },
  {
    id: "nav-courses",
    title: "Courses & Targets",
    subtitle: "Primary learning courses, books, and target progress",
    url: "/courses",
    keywords: ["courses", "books", "classes", "learning materials", "targets", "reading", "study"],
  },
  {
    id: "nav-dsa",
    title: "DSA Practice Tracker",
    subtitle: "LeetCode problem logging, difficulty breakdown, and patterns",
    url: "/dsa",
    keywords: ["dsa", "leetcode", "practice", "algorithms", "data structures", "problems", "blind 75", "neetcode"],
  },
  {
    id: "nav-sessions",
    title: "Time Log & Sessions",
    subtitle: "Historical focus sessions, study logs, and duration records",
    url: "/sessions",
    keywords: ["time log", "sessions", "timer", "pomodoro", "study log", "hours", "duration", "focus time"],
  },
  {
    id: "nav-analytics",
    title: "Analytics & Velocity",
    subtitle: "Completion pace, burndown charts, and study metrics",
    url: "/analytics",
    keywords: ["analytics", "metrics", "charts", "stats", "velocity", "completion", "insights", "streaks"],
  },
  {
    id: "nav-import",
    title: "Import & Export",
    subtitle: "CSV/JSON syllabus backups, data export, and imports",
    url: "/import",
    keywords: ["import", "export", "backup", "restore", "csv", "json", "data", "sync", "download"],
  },
  {
    id: "nav-profile",
    title: "Profile & Settings",
    subtitle: "Engineer info, target weekly hours, and preferences",
    url: "/profile",
    keywords: ["profile", "settings", "engineer", "account", "preferences", "avatar", "hours"],
  },
];

function extractSnippet(text: string, queryWords: string[]): string | undefined {
  if (!text) return undefined;
  const lowerText = text.toLowerCase();
  for (const word of queryWords) {
    if (word.length < 2) continue;
    const idx = lowerText.indexOf(word);
    if (idx !== -1) {
      const start = Math.max(0, idx - 25);
      const end = Math.min(text.length, idx + word.length + 35);
      const prefix = start > 0 ? "…" : "";
      const suffix = end < text.length ? "…" : "";
      return prefix + text.slice(start, end).trim() + suffix;
    }
  }
  return undefined;
}

export function executeSearch({
  query,
  weeks,
  tasks,
  taskProgressMap,
  courses,
  courseProgressMap,
  limit = 20,
}: {
  query: string;
  weeks: any[];
  tasks: any[];
  taskProgressMap: Map<string, any>;
  courses: any[];
  courseProgressMap?: Map<string, any>;
  limit?: number;
}): SearchResultItem[] {
  const cleanQuery = (query || "").trim().toLowerCase();
  const queryTokens = cleanQuery.split(/\s+/).filter((t) => t.length > 0);

  // If query is empty, return quick navigation and upcoming/active tasks
  if (queryTokens.length === 0) {
    const defaultNav: SearchResultItem[] = NAV_SHORTCUTS.slice(0, 4).map((nav) => ({
      id: nav.id,
      type: "nav",
      title: nav.title,
      subtitle: nav.subtitle,
      url: nav.url,
      badge: "Shortcut",
    }));

    const activeTasks: SearchResultItem[] = tasks
      .filter((t) => !t.archivedAt)
      .slice(0, 4)
      .map((t) => {
        const prog = taskProgressMap.get(t.taskId);
        const w = weeks.find((wk) => wk.weekId === t.weekId);
        return {
          id: `task-${t.taskId}`,
          type: "task",
          title: t.title,
          subtitle: `Week ${w?.weekNumber ?? "?"}: ${w?.title ?? ""} • ${t.category}`,
          url: `/weeks/${t.weekId}?taskId=${t.taskId}`,
          badge: "Task",
          category: t.category,
          status: prog?.status || "not_started",
          weekId: t.weekId,
          weekNumber: w?.weekNumber,
          taskId: t.taskId,
        };
      });

    return [...defaultNav, ...activeTasks];
  }

  const results: SearchResultItem[] = [];

  // 1. Search Nav Shortcuts
  for (const nav of NAV_SHORTCUTS) {
    let score = 0;
    const titleLower = nav.title.toLowerCase();
    const subLower = nav.subtitle.toLowerCase();

    if (titleLower === cleanQuery) score += 120;
    else if (titleLower.includes(cleanQuery)) score += 80;
    else if (subLower.includes(cleanQuery)) score += 40;

    for (const token of queryTokens) {
      if (titleLower.includes(token)) score += 30;
      if (subLower.includes(token)) score += 15;
      if (nav.keywords.some((kw) => kw.includes(token))) score += 35;
    }

    if (score > 0) {
      results.push({
        id: nav.id,
        type: "nav",
        title: nav.title,
        subtitle: nav.subtitle,
        url: nav.url,
        badge: "Shortcut",
        score,
      });
    }
  }

  // 2. Search Weeks
  for (const w of weeks) {
    if (w.archivedAt) continue;
    let score = 0;
    const titleLower = (w.title || "").toLowerCase();
    const phaseLower = (w.phaseTitle || "").toLowerCase();
    const conceptsLower = (w.concepts || "").toLowerCase();
    const coursesLower = (w.primaryCourses || "").toLowerCase();
    const exitLower = (w.exitCriteria || "").toLowerCase();
    const weekIdLower = (w.weekId || "").toLowerCase();
    const weekNumStr = `week ${w.weekNumber}`;

    if (titleLower === cleanQuery || weekNumStr === cleanQuery || weekIdLower === cleanQuery) {
      score += 150;
    } else if (titleLower.includes(cleanQuery) || weekNumStr.includes(cleanQuery)) {
      score += 80;
    }

    for (const token of queryTokens) {
      if (weekNumStr.includes(token)) score += 50;
      if (weekIdLower === token) score += 50;
      if (titleLower.includes(token)) score += 30;
      if (phaseLower.includes(token)) score += 20;
      if (conceptsLower.includes(token)) score += 25;
      if (coursesLower.includes(token)) score += 20;
      if (exitLower.includes(token)) score += 15;
    }

    if (score > 0) {
      const snippet =
        extractSnippet(w.concepts || "", queryTokens) ||
        extractSnippet(w.exitCriteria || "", queryTokens) ||
        extractSnippet(w.primaryCourses || "", queryTokens);

      results.push({
        id: `week-${w.weekId}`,
        type: "week",
        title: `Week ${w.weekNumber}: ${w.title}`,
        subtitle: `${w.phaseTitle || "Curriculum Phase"} • Target: ${w.targetHours || 0} hrs`,
        url: `/weeks/${w.weekId}`,
        badge: "Week",
        weekId: w.weekId,
        weekNumber: w.weekNumber,
        matchSnippet: snippet,
        score,
      });
    }
  }

  // 3. Search Courses
  for (const c of courses) {
    let score = 0;
    const titleLower = (c.title || "").toLowerCase();
    const courseIdLower = (c.courseId || "").toLowerCase();
    const noteLower = (c.coverageNote || "").toLowerCase();
    const plannedLower = (c.plannedWeeks || "").toLowerCase();

    if (titleLower === cleanQuery || courseIdLower === cleanQuery) score += 130;
    else if (titleLower.includes(cleanQuery)) score += 75;

    for (const token of queryTokens) {
      if (titleLower.includes(token)) score += 35;
      if (courseIdLower.includes(token)) score += 30;
      if (noteLower.includes(token)) score += 20;
      if (plannedLower.includes(token)) score += 15;
    }

    if (score > 0) {
      const snippet = extractSnippet(c.coverageNote || "", queryTokens);
      const prog = courseProgressMap?.get(c.courseId);
      const progressText = prog?.actualPercent ? `${prog.actualPercent}% done` : (c.plannedWeeks || "Planned");

      results.push({
        id: `course-${c.courseId}`,
        type: "course",
        title: c.title,
        subtitle: `Course • ${c.coverageKind} • ${progressText}`,
        url: `/courses#${c.courseId}`,
        badge: "Course",
        matchSnippet: snippet,
        score,
      });
    }
  }

  // 4. Search Tasks
  for (const t of tasks) {
    if (t.archivedAt) continue;
    let score = 0;
    const titleLower = (t.title || "").toLowerCase();
    const descLower = (t.description || "").toLowerCase();
    const catLower = (t.category || "").toLowerCase();
    const taskIdLower = (t.taskId || "").toLowerCase();

    if (titleLower === cleanQuery || taskIdLower === cleanQuery) score += 140;
    else if (titleLower.includes(cleanQuery)) score += 80;
    else if (descLower.includes(cleanQuery)) score += 40;

    for (const token of queryTokens) {
      if (titleLower.includes(token)) score += 35;
      if (descLower.includes(token)) score += 15;
      if (catLower.includes(token)) score += 25;
      if (taskIdLower.includes(token)) score += 30;
    }

    if (score > 0) {
      const w = weeks.find((wk) => wk.weekId === t.weekId);
      const prog = taskProgressMap.get(t.taskId);
      const snippet = extractSnippet(t.description || "", queryTokens);

      results.push({
        id: `task-${t.taskId}`,
        type: "task",
        title: t.title,
        subtitle: `Week ${w?.weekNumber ?? "?"}: ${w?.title ?? ""} • ${t.category.toUpperCase()}`,
        url: `/weeks/${t.weekId}?taskId=${t.taskId}`,
        badge: t.category === "dsa" ? "DSA" : t.category === "checkpoint" ? "Checkpoint" : "Task",
        category: t.category,
        status: prog?.status || "not_started",
        weekId: t.weekId,
        weekNumber: w?.weekNumber,
        taskId: t.taskId,
        matchSnippet: snippet,
        score,
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => (b.score || 0) - (a.score || 0));

  return results.slice(0, limit);
}
