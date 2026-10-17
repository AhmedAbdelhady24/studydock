"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProfileProvider } from "@/context/ProfileContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ProfileProvider>{children}</ProfileProvider>
    </ThemeProvider>
  );
}
