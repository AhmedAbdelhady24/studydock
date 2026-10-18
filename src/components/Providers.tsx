"use client";

import React from "react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { Toaster } from "sonner";

function AppToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      richColors
      closeButton
      position="bottom-right"
      duration={3500}
      style={{ zIndex: 99999 }}
      toastOptions={{
        className: "font-sans text-xs rounded-2xl shadow-2xl border border-black/[0.08] dark:border-white/[0.1]",
      }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ProfileProvider>
        {children}
        <AppToaster />
      </ProfileProvider>
    </ThemeProvider>
  );
}
