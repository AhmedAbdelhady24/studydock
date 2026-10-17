"use client";

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
  CheckCircle2,
  Anchor,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Today", icon: Compass },
  { href: "/roadmap", label: "Roadmap", icon: Layers },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/dsa", label: "DSA", icon: Binary },
  { href: "/sessions", label: "Time Log", icon: Clock },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/import", label: "Import & Export", icon: ArrowUpDown },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090A0C]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-white font-mono text-xs font-semibold shadow-inner group-hover:border-white/[0.25] transition-colors">
              <Anchor className="w-4 h-4 text-emerald-400 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white text-sm">
                StudyDock
              </span>
              <span className="text-[10px] font-mono text-zinc-500 border-l border-white/[0.1] pl-2 hidden sm:inline">
                33w Roadmap
              </span>
            </div>
          </Link>

          {/* Navigation Items (Segmented Control style) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.06]">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all",
                    isActive
                      ? "bg-white/[0.08] text-white shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-emerald-400" : "text-zinc-500")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/sessions"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white transition-all hover:border-white/[0.15]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Focus Timer</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
