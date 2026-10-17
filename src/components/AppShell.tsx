"use client";

import React, { useState } from "react";
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
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="min-h-screen bg-[#0C0D10] text-zinc-100 flex flex-col font-sans selection:bg-[#C8B6FF]/30 selection:text-white">
      {/* Outer Studio Container */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-2 sm:p-4 md:p-6 lg:p-7 flex flex-col">
        {/* Floating LMS Application Card (Inspired by learnspring & mobile designs) */}
        <div className="flex-1 bg-[#131418] border border-white/[0.07] rounded-[24px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
          
          {/* ========================================================= */}
          {/* LEFT SIDEBAR NAVIGATION RAIL                                */}
          {/* ========================================================= */}
          <aside className="hidden lg:flex w-64 xl:w-72 flex-col justify-between p-6 border-r border-white/[0.06] bg-[#111215]/95 shrink-0 select-none">
            <div className="space-y-8">
              {/* Brand Logo Header */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E05353] to-[#FF8A8A] flex items-center justify-center text-white font-bold shadow-lg shadow-[#E05353]/20 group-hover:scale-105 transition-transform duration-200">
                  <Flame className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold tracking-tight text-white">
                      StudyDock
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E05353]" />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-400 block tracking-wide">
                    Product Engineer 33w
                  </span>
                </div>
              </Link>

              {/* Navigation Menu */}
              <nav className="space-y-1.5">
                <div className="px-3 pb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  Curriculum Nav
                </div>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200",
                        isActive
                          ? "bg-white text-zinc-950 shadow-md font-bold"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive ? "text-zinc-950" : "text-zinc-400"
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Promo / Companion Card (from screenshot: Download Mobile App / Focus Sprint) */}
            <div className="p-4 rounded-3xl bg-[#FFE6A3]/10 border border-[#FFE6A3]/20 text-[#FFE6A3] relative overflow-hidden group">
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFE6A3]/20 text-[#FFE6A3] text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Focus Session</span>
                  </div>
                  <h4 className="text-xs font-bold text-white pt-1">
                    Study Time Tracker
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Log deep work intervals & pomodoros
                  </p>
                </div>
                <Link
                  href="/sessions"
                  className="w-8 h-8 rounded-full bg-[#E05353] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md shrink-0"
                  title="Open Study Sessions"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* MAIN WORKBENCH CANVAS                                      */}
          {/* ========================================================= */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#131418]">
            
            {/* Top Navigation & Global Header */}
            <header className="px-5 sm:px-8 py-4 border-b border-white/[0.06] flex items-center justify-between gap-4 bg-[#131418]/80 backdrop-blur-md sticky top-0 z-40">
              {/* Mobile Menu Button + Brand on Small Screens */}
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:text-white"
                  aria-label="Toggle Navigation"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
                <span className="font-bold text-white text-sm">StudyDock</span>
              </div>

              {/* Breadcrumbs Trail (Desktop) */}
              <nav
                className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-400"
                aria-label="Breadcrumb"
              >
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-zinc-600">/</span>}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-white transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-zinc-200 font-semibold truncate max-w-[240px]">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>

              {/* Top Right: Search Pill & User Profile / Greeting */}
              <div className="flex items-center gap-3.5 ml-auto">
                {/* Search Bar Pill */}
                <div className="relative hidden md:block">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics or concepts..."
                    className="w-48 xl:w-64 pl-9 pr-4 py-2 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                  />
                </div>

                {/* Notification Bell with Badge */}
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-[#E05353] absolute top-2 right-2 ring-2 ring-[#131418]" />
                </button>

                {/* User Greeting & Round Avatar (Directly from screenshots) */}
                <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-white/[0.08]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C8B6FF] to-[#D2E4D6] p-[2px] shadow-sm shrink-0">
                    <div className="w-full h-full rounded-full bg-[#18191E] flex items-center justify-center text-xs font-bold text-white uppercase">
                      PE
                    </div>
                  </div>
                  <div className="hidden xl:block text-left">
                    <span className="text-[10px] text-zinc-400 block font-medium leading-none">
                      Good Day,
                    </span>
                    <span className="text-xs font-bold text-white tracking-tight">
                      Engineer
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden p-4 border-b border-white/[0.08] bg-[#111215] space-y-1">
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
                          ? "bg-white text-zinc-950 font-bold"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
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
        <footer className="mt-4 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span>StudyDock Studio • 33-Week Product Engineer Track</span>
          </div>
          <div>PostgreSQL 16 Local-first • Zero External Telemetry</div>
        </footer>
      </div>
    </div>
  );
}
