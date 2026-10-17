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
  { href: "/", label: "Overview & Today", icon: Compass, exact: true },
  { href: "/roadmap", label: "Full Roadmap", icon: Layers },
  { href: "/courses", label: "Our Courses", icon: GraduationCap },
  { href: "/dsa", label: "DSA Practice", icon: Binary },
  { href: "/sessions", label: "Time Log", icon: Clock },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/import", label: "Import & Export", icon: ArrowUpDown },
  { href: "/profile", label: "Profile & Settings", icon: User },
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
    <div className="min-h-screen bg-[#F4F2F7] dark:bg-[#0C0D10] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-[#C8B6FF]/30 selection:text-white transition-colors duration-200">
      {/* Outer Studio Container */}
      <div className="flex-1 w-full max-w-[1640px] mx-auto p-2 sm:p-4 md:p-6 lg:p-7 flex flex-col">
        {/* Floating LMS Application Card (Inspired by learnspring & mobile designs) */}
        <div className="flex-1 bg-white dark:bg-[#131418] border border-black/[0.08] dark:border-white/[0.07] rounded-[24px] sm:rounded-[32px] shadow-xl dark:shadow-2xl overflow-hidden flex flex-col lg:flex-row relative transition-all duration-300">
          
          {/* ========================================================= */}
          {/* LEFT SIDEBAR NAVIGATION RAIL (COLLAPSIBLE)                 */}
          {/* ========================================================= */}
          <aside
            className={cn(
              "hidden lg:flex flex-col justify-between p-5 border-r border-black/[0.06] dark:border-white/[0.06] bg-[#FBFBFC] dark:bg-[#111215]/95 shrink-0 select-none transition-all duration-300 ease-in-out relative",
              isCollapsed ? "w-20 items-center" : "w-64 xl:w-72"
            )}
          >
            <div className="space-y-7 w-full">
              {/* Brand Logo Header & Collapse Toggle */}
              <div className="flex items-center justify-between gap-2">
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-3 group",
                    isCollapsed && "justify-center w-full"
                  )}
                  title="StudyDock Dashboard"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
                    <BookOpen className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  {!isCollapsed && (
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                          StudyDock
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] shrink-0" />
                      </div>
                      <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block tracking-wide truncate">
                        Product Engineer 33w
                      </span>
                    </div>
                  )}
                </Link>

                {/* Collapse / Expand Button */}
                {!isCollapsed && (
                  <button
                    type="button"
                    onClick={toggleCollapsed}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
                    title="Collapse sidebar"
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* If collapsed, show expand button below logo */}
              {isCollapsed && (
                <div className="flex justify-center w-full">
                  <button
                    type="button"
                    onClick={toggleCollapsed}
                    className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                    title="Expand sidebar"
                    aria-label="Expand sidebar"
                  >
                    <PanelLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Navigation Menu */}
              <nav className="space-y-1.5 w-full">
                {!isCollapsed && (
                  <div className="px-3 pb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    Curriculum Nav
                  </div>
                )}
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center rounded-2xl text-xs font-semibold transition-all duration-200 group",
                        isCollapsed
                          ? "justify-center w-10 h-10 mx-auto"
                          : "gap-3.5 px-4 py-3 w-full",
                        isActive
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md font-bold"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive
                            ? "text-white dark:text-zinc-950"
                            : "text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white"
                        )}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Promo / Companion Card */}
            {!isCollapsed ? (
              <div className="p-4 rounded-3xl bg-[#FFE6A3]/25 dark:bg-[#FFE6A3]/10 border border-[#FFE6A3]/50 dark:border-[#FFE6A3]/20 text-[#6B4E00] dark:text-[#FFE6A3] relative overflow-hidden group">
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/10 dark:bg-[#FFE6A3]/20 text-zinc-800 dark:text-[#FFE6A3] text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#7C3AED] dark:text-[#FFE6A3]" />
                      <span>Focus Mode</span>
                    </div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white pt-1">
                      Study Time Tracker
                    </h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
                      Log deep work intervals & pomodoros
                    </p>
                  </div>
                  <Link
                    href="/sessions"
                    className="w-8 h-8 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md shrink-0"
                    title="Open Study Sessions"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                href="/sessions"
                className="w-10 h-10 rounded-2xl bg-[#FFE6A3]/30 dark:bg-[#FFE6A3]/15 text-[#7C3AED] dark:text-[#FFE6A3] flex items-center justify-center hover:scale-110 transition-transform shadow-sm mx-auto"
                title="Focus Study Timer"
              >
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </Link>
            )}
          </aside>

          {/* ========================================================= */}
          {/* MAIN WORKBENCH CANVAS                                      */}
          {/* ========================================================= */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#131418] transition-colors duration-200">
            
            {/* Top Navigation & Global Header */}
            <header className="px-5 sm:px-8 py-4 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-4 bg-white/80 dark:bg-[#131418]/80 backdrop-blur-md sticky top-0 z-40">
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
                    className="w-48 xl:w-60 pl-9 pr-4 py-2 text-xs rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] transition-all"
                  />
                </div>

                {/* Dark / Light Theme Toggle Button */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                  title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-label="Toggle Theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
                  ) : (
                    <Moon className="w-4 h-4 text-purple-600 stroke-[2.2]" />
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
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C8B6FF] to-[#D2E4D6] p-[2px] shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {profile.avatarInitials || "PE"}
                    </div>
                  </div>
                  <div className="hidden xl:block text-left">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium leading-none">
                      Good Day,
                    </span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-[#4F46E5] transition-colors">
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

            {/* Page Main Content Area */}
            <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>

        {/* Footer info ribbon */}
        <footer className="mt-4 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-500 font-mono">
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
