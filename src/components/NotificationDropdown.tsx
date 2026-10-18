"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Check,
  Clock,
  BookOpen,
  ShieldCheck,
  Binary,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "curriculum" | "timer" | "checkpoint" | "dsa" | "system";
  unread: boolean;
  href?: string;
  actionLabel?: string;
}

export function NotificationDropdown() {
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initialNotifications: NotificationItem[] = [
    {
      id: "notif-1",
      title: "Week 01: JavaScript Reboot",
      message: "Curriculum sprint is active. 7 deliverables scheduled for this week.",
      time: "Just now",
      type: "curriculum",
      unread: true,
      href: "/weeks/product-engineer-33-week-w01",
      actionLabel: "View Syllabus",
    },
    {
      id: "notif-2",
      title: "Weekly Cadence & Focus Hours",
      message: `Your weekly target is ${profile.weeklyTargetHours || 16}h. Start a deep work interval to log progress.`,
      time: "2h ago",
      type: "timer",
      unread: true,
      href: "/sessions",
      actionLabel: "Start Stopwatch",
    },
    {
      id: "notif-3",
      title: "Exit Milestone Attestation Gate",
      message: "Explain & trace code, write 5 functions with edge cases without AI to unlock signing.",
      time: "1d ago",
      type: "checkpoint",
      unread: true,
      href: "/weeks/product-engineer-33-week-w01",
      actionLabel: "Exit Criteria",
    },
    {
      id: "notif-4",
      title: "DSA Problem Bank Ready",
      message: "Target: Solve at least 3 algorithmic exercises without editor peek.",
      time: "2d ago",
      type: "dsa",
      unread: false,
      href: "/dsa",
      actionLabel: "DSA Practice",
    },
  ];

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Load read status from localStorage
  useEffect(() => {
    try {
      const readIds = JSON.parse(localStorage.getItem("studydock_read_notifications") || "[]");
      if (Array.isArray(readIds) && readIds.length > 0) {
        setNotifications((prev) =>
          prev.map((n) => (readIds.includes(n.id) ? { ...n, unread: false } : n))
        );
      }
    } catch {
      // fallback
    }
  }, []);

  // Save read status to localStorage
  const saveReadStatus = (updated: NotificationItem[]) => {
    const readIds = updated.filter((n) => !n.unread).map((n) => n.id);
    localStorage.setItem("studydock_read_notifications", JSON.stringify(readIds));
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    saveReadStatus(updated);
    toast.success("Notifications marked as read");
  };

  const markSingleAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
    setNotifications(updated);
    saveReadStatus(updated);
  };

  const dismissNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    toast("Notification dismissed");
  };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => n.unread) : notifications;

  const getTypeIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "curriculum":
        return <BookOpen className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />;
      case "timer":
        return <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />;
      case "checkpoint":
        return <ShieldCheck className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />;
      case "dsa":
        return <Binary className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-150 relative cursor-pointer active:scale-95",
          isOpen
            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-sm"
            : "bg-zinc-100 dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
        )}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 absolute top-2 right-2 ring-2 ring-white dark:ring-[#131418]" />
        )}
      </button>

      {/* Flyout Popover Panel (Origin-aware: scales from top-right trigger) */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[340px] sm:w-[400px] rounded-3xl bg-white dark:bg-[#111215] border border-black/[0.08] dark:border-white/[0.1] shadow-2xl dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-150 text-zinc-900 dark:text-zinc-100 overscroll-contain">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm tracking-tight">Notifications</span>
              {unreadCount > 0 ? (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-zinc-500">
                  All caught up
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-black/[0.04] dark:border-white/[0.04] bg-zinc-50/60 dark:bg-white/[0.02] flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "px-3 py-1 rounded-full font-semibold transition-colors duration-150 cursor-pointer",
                filter === "all"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={cn(
                "px-3 py-1 rounded-full font-semibold transition-colors duration-150 cursor-pointer",
                filter === "unread"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications Scroll Area */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 flex items-center justify-center mx-auto">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {filter === "unread" ? "No unread notifications" : "No notifications"}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  You are up to speed with your curriculum and study intervals.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markSingleAsRead(notif.id)}
                  className={cn(
                    "p-4 transition-colors group relative flex items-start gap-3",
                    notif.unread
                      ? "bg-blue-500/[0.03] dark:bg-blue-500/[0.04] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                      : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  )}
                >
                  {/* Icon badge */}
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                    {getTypeIcon(notif.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={cn(
                          "text-xs truncate",
                          notif.unread
                            ? "font-bold text-zinc-900 dark:text-white"
                            : "font-semibold text-zinc-700 dark:text-zinc-300"
                        )}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
                        {notif.time}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    {/* Action Link & Unread Dot */}
                    <div className="flex items-center justify-between pt-1.5">
                      {notif.href ? (
                        <Link
                          href={notif.href}
                          onClick={() => {
                            markSingleAsRead(notif.id);
                            setIsOpen(false);
                          }}
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 group/link"
                        >
                          <span>{notif.actionLabel || "View"}</span>
                          <ChevronRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-2">
                        {notif.unread && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                            title="Unread"
                          />
                        )}
                        <button
                          type="button"
                          onClick={(e) => dismissNotification(e, notif.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-opacity"
                          title="Dismiss"
                          aria-label="Dismiss notification"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] flex items-center justify-between text-[11px] text-zinc-500 px-4">
            <span className="font-mono">Telemetry: Local-first</span>
            <Link
              href="/roadmap"
              onClick={() => setIsOpen(false)}
              className="font-bold text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Full Curriculum →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
