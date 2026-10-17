"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Sparkles,
  Clock,
  Shield,
  Save,
  Check,
  Moon,
  Sun,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { profile, updateProfile, loading } = useProfile();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [avatarInitials, setAvatarInitials] = useState(profile.avatarInitials);
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(profile.weeklyTargetHours);
  const [bio, setBio] = useState(profile.bio || "");
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setTitle(profile.title);
    setAvatarInitials(profile.avatarInitials);
    setWeeklyTargetHours(profile.weeklyTargetHours);
    setBio(profile.bio || "");
    setSelectedTheme(theme);
  }, [profile, theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const success = await updateProfile({
      name,
      title,
      avatarInitials,
      weeklyTargetHours: Number(weeklyTargetHours),
      bio,
      theme: selectedTheme,
    });

    if (success) {
      setTheme(selectedTheme as "dark" | "light");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] dark:border-white/[0.08]">
        <div>
          <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase block mb-1">
            Account & Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Engineer Profile
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Local PostgreSQL Sync</span>
          </span>
        </div>
      </div>

      {/* Live Preview Bento Card (Matching mobile & LMS aesthetic) */}
      <div className="bg-[#C8B6FF] text-[#181329] rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#18191E] text-white flex items-center justify-center text-xl font-extrabold shadow-md border-2 border-white/20 shrink-0">
              {avatarInitials || "PE"}
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#181329]/70 block font-mono">
                Live Studio Identity
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#181329]">
                Good Day, {name || "Engineer"}
              </h2>
              <p className="text-xs font-semibold text-[#181329]/80">
                {title || "Product Engineer"} • {weeklyTargetHours || 16}h Weekly Study Target
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-black/10 px-3 py-1.5 rounded-2xl text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#181329]" />
            <span>33-Week Product Engineer Track</span>
          </div>
        </div>

        {bio && (
          <div className="mt-4 pt-4 border-t border-black/10 text-xs font-medium text-[#181329]/85 italic">
            "{bio}"
          </div>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  const parts = e.target.value.trim().split(/\s+/);
                  if (parts.length > 0 && parts[0]) {
                    setAvatarInitials(
                      parts.length === 1
                        ? parts[0].slice(0, 2).toUpperCase()
                        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                    );
                  }
                }}
                placeholder="e.g. John Bruno or Ahmed"
                required
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] transition-all"
              />
              <span className="text-[10px] text-zinc-500">
                This name appears on your dashboard greeting and milestones.
              </span>
            </div>

            {/* Title / Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Role / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Product Engineer or Full-Stack"
                required
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] transition-all"
              />
              <span className="text-[10px] text-zinc-500">
                Your current engineering specialty or target career role.
              </span>
            </div>

            {/* Avatar Initials */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Avatar Initials (2 characters)
              </label>
              <input
                type="text"
                maxLength={3}
                value={avatarInitials}
                onChange={(e) => setAvatarInitials(e.target.value.toUpperCase())}
                placeholder="e.g. AA or JB"
                className="w-full px-4 py-2.5 text-xs font-mono font-bold uppercase rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] transition-all"
              />
            </div>

            {/* Weekly Target Hours */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Weekly Target Study Hours: <span className="text-[#4F46E5] dark:text-[#C8B6FF] font-mono">{weeklyTargetHours}h</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={weeklyTargetHours}
                  onChange={(e) => setWeeklyTargetHours(Number(e.target.value))}
                  className="flex-1 accent-[#4F46E5] cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 w-8 text-right">
                  {weeklyTargetHours}h
                </span>
              </div>
              <span className="text-[10px] text-zinc-500">
                Curriculum syllabus standard is 16h per week.
              </span>
            </div>
          </div>

          {/* Bio / Learning Mission */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Learning Mission & Goals
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Mastering Full-Stack TypeScript, NestJS, and System Design to ship scalable products."
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] transition-all resize-none"
            />
          </div>

          {/* Theme Preference Selection */}
          <div className="space-y-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
              Color Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-3 sm:w-80">
              <button
                type="button"
                onClick={() => setSelectedTheme("dark")}
                className={cn(
                  "p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer",
                  selectedTheme === "dark"
                    ? "bg-[#18191E] text-white border-white/30 shadow-md ring-2 ring-[#C8B6FF]"
                    : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 border-transparent hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <Moon className="w-4 h-4 text-purple-400" />
                <span>Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTheme("light")}
                className={cn(
                  "p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer",
                  selectedTheme === "light"
                    ? "bg-white text-zinc-950 border-black/30 shadow-md ring-2 ring-[#C8B6FF]"
                    : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 border-transparent hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between gap-4">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Profile updated successfully!</span>
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
