"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  CheckSquare,
  GraduationCap,
  Binary,
  Clock,
  BarChart3,
  ArrowUpDown,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Today", icon: Compass },
  { href: "/roadmap", label: "Roadmap", icon: Layers },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/dsa", label: "DSA Tracker", icon: Binary },
  { href: "/sessions", label: "Sessions", icon: Clock },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/import", label: "Import & Export", icon: ArrowUpDown },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold shadow-sm group-hover:border-primary/60 transition-all">
              <CheckSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-foreground text-base">
                  StudyDock
                </span>
                <span className="text-[10px] font-mono uppercase bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/30">
                  Local-First
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                33-Week Product Engineer Roadmap
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
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
                    "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-secondary text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions & Status */}
        <div className="flex items-center gap-3">
          <Link
            href="/sessions"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md bg-secondary/80 hover:bg-secondary border border-border text-foreground transition-all hover:border-primary/40"
          >
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Log Study</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
