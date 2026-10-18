"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Layers,
  GraduationCap,
  Binary,
  Clock,
  BarChart3,
  ArrowUpDown,
  Search,
  Bell,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Sun,
  Moon,
  User,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { NotificationDropdown } from "@/components/NotificationDropdown";

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/", label: "Today", icon: Compass, exact: true },
  { href: "/roadmap", label: "Roadmap", icon: Layers },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/dsa", label: "DSA practice", icon: Binary },
  { href: "/sessions", label: "Time Log", icon: Clock },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/import", label: "Import & Export", icon: ArrowUpDown },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Read saved collapsed state
  useEffect(() => {
    const saved = localStorage.getItem("studydock_sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("studydock_sidebar_collapsed", next ? "true" : "false");
  };

  // Determine breadcrumb based on current path
  const getBreadcrumbs = () => {
    if (pathname === "/") {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Week 01", href: "/" },
        { label: "JavaScript Reboot" },
      ];
    }
    if (pathname.startsWith("/roadmap")) {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Curriculum", href: "/roadmap" },
        { label: "33-Week Roadmap" },
      ];
    }
    if (pathname.startsWith("/courses")) {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Curriculum", href: "/roadmap" },
        { label: "Primary Video Courses" },
      ];
    }
    if (pathname.startsWith("/dsa")) {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Practice", href: "/dsa" },
        { label: "DSA & Problem Bank" },
      ];
    }
    if (pathname.startsWith("/sessions")) {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Tracking", href: "/sessions" },
        { label: "Deep Work Sessions" },
      ];
    }
    if (pathname.startsWith("/analytics")) {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Insights", href: "/analytics" },
        { label: "Pacing & Metrics" },
      ];
    }
    if (pathname.startsWith("/import")) {
      return [
        { label: "Dashboard", href: "/" },
        { label: "System", href: "/import" },
        { label: "Import & Export" },
      ];
    }
    if (pathname.startsWith("/profile")) {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Account", href: "/profile" },
        { label: "Engineer Profile" },
      ];
    }
    if (pathname.startsWith("/weeks/")) {
      return [
        { label: "Roadmap", href: "/roadmap" },
        { label: "Week Syllabus" },
      ];
    }
    return [{ label: "Dashboard", href: "/" }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0E1014] text-zinc-900 dark:text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR NAVIGATION RAIL (COLLAPSIBLE)                 */}
      {/* ========================================================= */}
      <aside
        className={cn(
          "hidden lg:flex flex-col justify-between p-5 border-r border-black/[0.06] dark:border-white/[0.06] bg-[#FBFBFC] dark:bg-[#111215]/95 shrink-0 select-none transition-[width] duration-200 ease-out relative h-screen sticky top-0 z-40",
          isCollapsed ? "w-20 items-center" : "w-64 xl:w-72"
        )}
      >
        <div className="space-y-7 w-full">
          {/* Brand Logo Header */}
          <div className="relative flex items-center group w-full">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3",
                isCollapsed && "justify-center w-full"
              )}
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold border border-zinc-800 dark:border-zinc-200 shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
                <BookOpen className="w-4 h-4 stroke-[2.2]" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="flex items-center">
                    <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                      StudyDock
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block tracking-wide truncate">
                    Product Engineer 33w
                  </span>
                </div>
              )}
            </Link>
            {isCollapsed && (
              <div className="absolute left-[60px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 z-50 flex items-center">
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-zinc-900 dark:border-r-zinc-100" />
                <span>StudyDock</span>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 w-full">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <div key={item.href} className="relative flex items-center group w-full">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-xl text-xs font-medium transition-colors duration-150 relative",
                      isCollapsed
                        ? "justify-center w-9 h-9 mx-auto"
                        : "gap-3 px-3.5 py-2.5 w-full",
                      isActive
                        ? "bg-zinc-100 dark:bg-zinc-800/90 text-zinc-950 dark:text-white font-semibold border border-zinc-200/90 dark:border-zinc-700/80 shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-white"
                      )}
                    />
                    {!isCollapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
                  </Link>

                  {/* Custom On-Hover Tooltip when Collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-[60px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 z-50 flex items-center">
                      <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-zinc-900 dark:border-r-zinc-100" />
                      <span>{item.label}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Section (Focus Mode Card + Bottom Collapse/Expand Toggle) */}
        <div className="w-full space-y-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
          {!isCollapsed ? (
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 relative overflow-hidden group">
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium">
                    <Clock className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                    <span>Focus Mode</span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 pt-1">
                    Study Time Tracker
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                    Log deep work intervals & pomodoros
                  </p>
                </div>
                <Link
                  href="/sessions"
                  className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0"
                  title="Open Study Sessions"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center group mx-auto w-full justify-center">
              <Link
                href="/sessions"
                className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm mx-auto"
              >
                <Clock className="w-4 h-4 stroke-[2]" />
              </Link>
              <div className="absolute left-[60px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 z-50 flex items-center">
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-zinc-900 dark:border-r-zinc-100" />
                <span>Focus Study Timer</span>
              </div>
            </div>
          )}

          {/* Bottom Collapse / Expand Button */}
          {!isCollapsed ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer group"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <span className="truncate">Collapse sidebar</span>
              <PanelLeftClose className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-white transition-colors shrink-0" />
            </button>
          ) : (
            <div className="relative flex items-center group mx-auto w-full justify-center">
              <button
                type="button"
                onClick={toggleCollapsed}
                className="w-9 h-9 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
              <div className="absolute left-[60px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 z-50 flex items-center">
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-zinc-900 dark:border-r-zinc-100" />
                <span>Expand sidebar</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN WORKBENCH CANVAS (FULL WIDTH)                         */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-white dark:bg-[#131418] transition-colors duration-200">
        
        {/* Top Navigation & Global Header */}
        <header className="px-5 sm:px-8 lg:px-10 py-4 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-4 bg-white/80 dark:bg-[#131418]/80 backdrop-blur-md sticky top-0 z-30">
          {/* Mobile Menu Button + Brand on Small Screens */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <span className="font-bold text-zinc-900 dark:text-white text-sm">StudyDock</span>
          </div>

          {/* Breadcrumbs Trail (Desktop) */}
          <nav
            className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-zinc-400 dark:text-zinc-600">/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-zinc-900 dark:text-zinc-200 font-semibold truncate max-w-[240px]">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Top Right: Search Pill & Theme Toggle & Profile Greeting */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Search Bar Pill */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics or concepts..."
                className="w-48 xl:w-60 pl-9 pr-4 py-2 text-xs rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-shadow duration-150"
              />
            </div>

            {/* Dark / Light Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer shadow-sm"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700 stroke-[2.2]" />
              )}
            </button>

            {/* Notification Dropdown */}
            <NotificationDropdown />

            {/* User Greeting & Round Avatar (Clickable to /profile) */}
            <Link
              href="/profile"
              className="flex items-center gap-3 pl-2 sm:border-l sm:border-black/[0.08] dark:sm:border-white/[0.08] group cursor-pointer"
              title="View and Edit Profile"
            >
              <div className="w-9 h-9 rounded-full border border-black/[0.1] dark:border-white/[0.15] bg-zinc-900 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                {profile.avatarInitials || "PE"}
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium leading-none">
                  Good Day,
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {profile.name || "Engineer"}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden p-4 border-b border-black/[0.08] dark:border-white/[0.08] bg-[#FBFBFC] dark:bg-[#111215] space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all",
                    isActive
                      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Page Main Content Area (Full Width) */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 w-full overflow-y-auto">
          {children}
        </main>

        {/* Footer info ribbon */}
        <footer className="border-t border-black/[0.06] dark:border-white/[0.06] px-5 sm:px-8 lg:px-10 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono bg-[#FBFBFC] dark:bg-[#0E1014]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>StudyDock Studio • 33-Week Product Engineer Track</span>
          </div>
          <div>PostgreSQL 16 Local-first • Zero External Telemetry</div>
        </footer>
      </div>
    </div>
  );
}
