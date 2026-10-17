import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "StudyDock | 33-Week Product Engineer Tracker",
  description:
    "Local-first, single-user learning management dashboard backed by PostgreSQL. Zero external telemetry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/30">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>StudyDock v1.0 • Local-first PostgreSQL Persistence</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>Schema v1.0</span>
              <span>127.0.0.1:3000</span>
              <span>Private Single-User</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
