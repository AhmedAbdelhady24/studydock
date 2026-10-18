"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface UserProfileData {
  name: string;
  title: string;
  avatarInitials: string;
  weeklyTargetHours: number;
  bio?: string;
  theme?: string;
}

interface ProfileContextType {
  profile: UserProfileData;
  loading: boolean;
  updateProfile: (data: Partial<UserProfileData>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const DEFAULT_PROFILE: UserProfileData = {
  name: "Engineer",
  title: "Product Engineer",
  avatarInitials: "PE",
  weeklyTargetHours: 16,
  bio: "33-Week Product Engineer Journey",
  theme: "dark",
};

const ProfileContext = createContext<ProfileContextType>({
  profile: DEFAULT_PROFILE,
  loading: true,
  updateProfile: async () => false,
  refreshProfile: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const json = await res.json();
        if (json && json.name) {
          setProfile({
            name: json.name,
            title: json.title || "Product Engineer",
            avatarInitials: json.avatarInitials || getInitials(json.name),
            weeklyTargetHours: json.weeklyTargetHours || 16,
            bio: json.bio || "",
            theme: json.theme || "dark",
          });
        }
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const updateProfile = async (data: Partial<UserProfileData>): Promise<boolean> => {
    try {
      const initials = data.avatarInitials || (data.name ? getInitials(data.name) : profile.avatarInitials);
      const payload = {
        ...profile,
        ...data,
        avatarInitials: initials,
      };

      setProfile(payload); // optimistic update

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      const updated = await res.json();
      setProfile(updated);
      return true;
    } catch (err) {
      console.error("Failed to update profile", err);
      return false;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        updateProfile,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
