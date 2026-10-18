"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Clock,
  Plus,
  PictureInPicture2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StudyTimerProps {
  currentWeekId?: string;
  onSessionLogged?: () => void;
}

export function StudyTimer({ currentWeekId, onSessionLogged }: StudyTimerProps) {
  const [mode, setMode] = useState<"timer" | "manual">("timer");
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [notes, setNotes] = useState("");
  const [weekId, setWeekId] = useState(currentWeekId || "product-engineer-33-week-w01");
  const [courseId, setCourseId] = useState("");
  const [manualMinutes, setManualMinutes] = useState("45");
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Picture-in-Picture State & Hardware Refs
  const [isPipActive, setIsPipActive] = useState(false);
  const [autoPipEnabled, setAutoPipEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Wall-Clock Timing Refs (Guarantees zero-drift & immune to background tab throttling)
  const startTimeRef = useRef<number | null>(null);
  const accumulatedSecondsRef = useRef(0);
  const isActiveRef = useRef(false);
  isActiveRef.current = isActive;
  const secondsRef = useRef(0);
  secondsRef.current = seconds;

  // Load auto-pip preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("studydock_timer_autopip");
    if (saved !== null) {
      setAutoPipEnabled(saved === "true");
    }
  }, []);

  const toggleAutoPip = (enabled: boolean) => {
    setAutoPipEnabled(enabled);
    localStorage.setItem("studydock_timer_autopip", enabled ? "true" : "false");
    if (enabled) {
      toast.info("Auto-PiP enabled", {
        description: "The timer will automatically float in Picture-in-Picture when you switch tabs.",
      });
    }
  };

  // Keep weekId synced with parent prop
  useEffect(() => {
    if (currentWeekId) {
      setWeekId(currentWeekId);
    }
  }, [currentWeekId]);

  // Main timer stopwatch tick (wall-clock based: immune to background tab throttling)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsedSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setSeconds(accumulatedSecondsRef.current + elapsedSecs);
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getWeekDisplay = useCallback(() => {
    const match = weekId.match(/w(\d+)/i);
    return match ? `Week ${match[1]} • Focus Session` : "Curriculum Focus Session";
  }, [weekId]);

  // Render high-DPI Studio HUD onto hidden canvas for native PiP stream
  const drawCanvas = useCallback(
    (secs: number, active: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Deep Obsidian Studio Background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0E1014");
      grad.addColorStop(1, "#161821");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle Outer Edge Ring
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);

      // 2. Brand Header with Status Dot
      const dotColor = active ? "#10B981" : "#F59E0B";
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(34, 38, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("STUDYDOCK • FOCUS TIMER", 48, 42);

      // Status pill badge
      const badgeText = active ? "RUNNING" : "PAUSED";
      ctx.fillStyle = active ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)";
      ctx.beginPath();
      ctx.roundRect(w - 105, 26, 75, 24, 12);
      ctx.fill();
      ctx.fillStyle = dotColor;
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(badgeText, w - 67, 42);

      // 3. Large Digital Clock Display
      const timeStr = formatTime(secs);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 64px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(timeStr, w / 2, 128);

      // 4. Subtitle / Associated Week
      ctx.fillStyle = "#71717A";
      ctx.font = "500 15px system-ui, sans-serif";
      ctx.fillText(getWeekDisplay(), w / 2, 192);

      // 5. Instruction / Status Footer
      ctx.fillStyle = "#52525B";
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillText(
        active ? "Focusing • Click StudyDock tab to return" : "Paused • Click Play to resume",
        w / 2,
        230
      );
      ctx.textAlign = "left";
    },
    [getWeekDisplay]
  );

  // Initialize canvas stream onto hidden video element with silent audio track for full OS/PiP media controls
  const initPipStream = useCallback(() => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video.srcObject) {
      try {
        const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
        if (stream) {
          // Add silent audio track so browser enables full media controls in PiP and Control Center
          try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const audioCtx = new AudioCtx();
              const osc = audioCtx.createOscillator();
              const dst = audioCtx.createMediaStreamDestination();
              osc.connect(dst);
              osc.start();
              const audioTrack = dst.stream.getAudioTracks()[0];
              if (audioTrack) {
                audioTrack.enabled = false;
                stream.addTrack(audioTrack);
              }
            }
          } catch {}

          video.srcObject = stream;
          video.muted = true;
          video.playsInline = true;
          (video as any).autoPictureInPicture = true;
        }
      } catch (err) {
        console.warn("Could not capture canvas stream for PiP", err);
      }
    }
  }, []);

  // Core play/resume handler used by website button, PiP controls, and MediaSession
  const handlePlay = useCallback(async () => {
    setIsActive(true);
    isActiveRef.current = true;
    startTimeRef.current = Date.now();

    initPipStream();

    if (videoRef.current && videoRef.current.paused) {
      try {
        await videoRef.current.play();
      } catch (err) {
        console.warn("Video play error in handlePlay", err);
      }
    }

    if (typeof window !== "undefined" && "mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "playing";
    }

    drawCanvas(accumulatedSecondsRef.current, true);
  }, [drawCanvas, initPipStream]);

  // Core pause handler used by website button, PiP controls, and MediaSession
  const handlePause = useCallback(() => {
    setIsActive(false);
    isActiveRef.current = false;

    if (startTimeRef.current !== null) {
      const elapsedSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      accumulatedSecondsRef.current += elapsedSecs;
      startTimeRef.current = null;
      setSeconds(accumulatedSecondsRef.current);
    }

    if (videoRef.current && !videoRef.current.paused) {
      try {
        videoRef.current.pause();
      } catch (err) {
        console.warn("Video pause error in handlePause", err);
      }
    }

    if (typeof window !== "undefined" && "mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "paused";
    }

    drawCanvas(accumulatedSecondsRef.current, false);
  }, [drawCanvas]);

  // Update canvas & page title on timer ticks
  useEffect(() => {
    drawCanvas(seconds, isActive);

    if (isActive) {
      document.title = `(${formatTime(seconds)}) StudyDock | Focus`;
    } else if (seconds > 0) {
      document.title = `[Paused ${formatTime(seconds)}] StudyDock`;
    } else {
      document.title = "StudyDock | 33-Week Product Engineer Tracker";
    }
  }, [seconds, isActive, drawCanvas]);

  // Listen for video element events and Picture-in-Picture controls
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnterPip = () => setIsPipActive(true);
    const onLeavePip = () => setIsPipActive(false);

    // Native PiP player control events
    const onVideoPlay = () => {
      if (!isActiveRef.current) {
        handlePlay();
      }
    };

    const onVideoPause = () => {
      if (isActiveRef.current) {
        handlePause();
      }
    };

    video.addEventListener("enterpictureinpicture", onEnterPip);
    video.addEventListener("leavepictureinpicture", onLeavePip);
    video.addEventListener("play", onVideoPlay);
    video.addEventListener("pause", onVideoPause);

    return () => {
      video.removeEventListener("enterpictureinpicture", onEnterPip);
      video.removeEventListener("leavepictureinpicture", onLeavePip);
      video.removeEventListener("play", onVideoPlay);
      video.removeEventListener("pause", onVideoPause);
    };
  }, [handlePlay, handlePause]);

  // AUTO-PIP ON TAB SWITCH:
  // When user switches to another tab while timer is active, automatically enter Picture-in-Picture!
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        if (isActive && autoPipEnabled && videoRef.current) {
          initPipStream();
          drawCanvas(seconds, isActive);

          const docAny = document as any;
          if (!docAny.pictureInPictureElement && (videoRef.current as any).requestPictureInPicture) {
            try {
              await videoRef.current.play();
              await (videoRef.current as any).requestPictureInPicture();
              setIsPipActive(true);
            } catch (err) {
              // Handled by browser via autoPictureInPicture = true
            }
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive, autoPipEnabled, seconds, drawCanvas, initPipStream]);

  // MediaSession API integration for OS-level and PiP play/pause controls
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Focus Timer: ${formatTime(seconds)}`,
        artist: "StudyDock",
        album: getWeekDisplay(),
      });

      // Explicitly setting playbackState tells the PiP window whether to show Play or Pause button!
      navigator.mediaSession.playbackState = isActive ? "playing" : "paused";

      navigator.mediaSession.setActionHandler("play", () => {
        handlePlay();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        handlePause();
      });
    } catch (err) {
      console.warn("MediaSession setup error", err);
    }
  }, [seconds, isActive, getWeekDisplay, handlePlay, handlePause]);

  // Toggle Picture-in-Picture manually
  const togglePiP = async () => {
    const docAny = document as any;
    if (docAny.pictureInPictureElement) {
      try {
        await docAny.exitPictureInPicture();
        setIsPipActive(false);
      } catch (err) {
        console.warn("Error exiting PiP", err);
      }
    } else if (videoRef.current) {
      initPipStream();
      drawCanvas(seconds, isActive);

      try {
        await videoRef.current.play();
        if ((videoRef.current as any).requestPictureInPicture) {
          await (videoRef.current as any).requestPictureInPicture();
          setIsPipActive(true);
          toast.success("Timer floating in Picture-in-Picture", {
            description: "The timer will float over other applications and tabs.",
          });
        } else {
          toast.info("Picture-in-Picture not supported by your browser");
        }
      } catch (err: any) {
        console.warn("PiP failed", err);
        toast.error("Picture-in-Picture could not open", {
          description: err?.message || "User interaction required.",
        });
      }
    }
  };

  const toggleTimer = async () => {
    if (isActive) {
      handlePause();
    } else {
      await handlePlay();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    isActiveRef.current = false;
    startTimeRef.current = null;
    accumulatedSecondsRef.current = 0;
    setSeconds(0);
    if (videoRef.current && !videoRef.current.paused) {
      try {
        videoRef.current.pause();
      } catch {}
    }
    if (typeof window !== "undefined" && "mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "none";
    }
    drawCanvas(0, false);
  };

  const addPresetMinutes = (mins: number) => {
    accumulatedSecondsRef.current += mins * 60;
    setSeconds((prev) => prev + mins * 60);
    drawCanvas(accumulatedSecondsRef.current, isActiveRef.current);
  };

  const handleSaveTimerSession = async () => {
    if (seconds < 60) {
      alert("Session must be at least 1 minute to record.");
      return;
    }
    const durationMinutes = Math.max(1, Math.round(seconds / 60));
    await submitSession(durationMinutes, new Date().toISOString().split("T")[0]);
    resetTimer();
  };

  const handleSaveManualSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(manualMinutes, 10);
    if (isNaN(duration) || duration <= 0) {
      alert("Please enter a valid positive number of minutes.");
      return;
    }
    await submitSession(duration, manualDate);
    setNotes("");
  };

  const submitSession = async (durationMinutes: number, date: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId: weekId || undefined,
          courseId: courseId || undefined,
          durationMinutes,
          date,
          notes: notes.trim() || undefined,
        }),
      });

      if (res.ok) {
        setSuccessMessage(`Logged ${durationMinutes}m focus block`);
        toast.success(`Logged ${durationMinutes}m focus session`, {
          description: "Credited to your weekly study target and velocity metrics.",
        });
        setTimeout(() => setSuccessMessage(""), 2500);
        if (onSessionLogged) onSessionLogged();
      } else {
        toast.error("Failed to log session", {
          description: "Please check your network or database connection.",
        });
      }
    } catch (err) {
      console.error("Failed to log study session", err);
      toast.error("Network error logging session", {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-[#111215] p-5 text-zinc-900 dark:text-zinc-200 shadow-sm space-y-4">
      {/* Offscreen Canvas & Video for native Picture-in-Picture stream */}
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        style={{ position: "fixed", top: -9999, left: -9999, opacity: 0, pointerEvents: "none" }}
      />
      <video
        ref={videoRef}
        playsInline
        muted
        style={{ position: "fixed", top: -9999, left: -9999, opacity: 0, pointerEvents: "none", width: 10, height: 10 }}
      />

      <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500" />
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-200 tracking-tight">
            Focus Timer
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {mode === "timer" && (
            <button
              type="button"
              onClick={togglePiP}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border",
                isPipActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-xs"
                  : "bg-black/[0.04] dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border-black/[0.06] dark:border-white/[0.06]"
              )}
              title={isPipActive ? "Close Picture-in-Picture window" : "Open floating Picture-in-Picture window (floats across tabs)"}
            >
              <PictureInPicture2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isPipActive ? "In PiP" : "PiP"}</span>
            </button>
          )}

          <div className="flex items-center bg-black/[0.04] dark:bg-white/[0.04] rounded-full p-1 border border-black/[0.06] dark:border-white/[0.06] text-xs">
            <button
              type="button"
              onClick={() => setMode("timer")}
              className={cn(
                "px-3 py-1 rounded-full text-[11px] font-semibold transition-all",
                mode === "timer"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              )}
            >
              Stopwatch
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={cn(
                "px-3 py-1 rounded-full text-[11px] font-semibold transition-all",
                mode === "manual"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              )}
            >
              Manual
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-zinc-800 dark:text-zinc-200 text-xs flex items-center gap-2 font-medium">
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
          <span>{successMessage}</span>
        </div>
      )}

      {mode === "timer" ? (
        <div className="mt-2 flex flex-col items-center space-y-3">
          {/* Readout */}
          <div className="text-4xl font-mono font-extrabold tracking-tight text-zinc-900 dark:text-white tabular-nums py-2 flex items-center gap-2.5">
            {isActive && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
            <span>{formatTime(seconds)}</span>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => addPresetMinutes(mins)}
                className="px-2.5 py-1 text-xs font-mono rounded-full bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 border border-black/[0.06] dark:border-white/[0.06] font-semibold transition-colors cursor-pointer"
              >
                +{mins}m
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 pt-1 w-full">
            <button
              type="button"
              onClick={toggleTimer}
              className={cn(
                "flex-1 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm",
                isActive
                  ? "bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400"
                  : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90"
              )}
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isActive ? "Pause" : seconds > 0 ? "Resume" : "Start"}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveTimerSession}
              disabled={seconds < 60 || isSubmitting}
              className="py-2.5 px-4 rounded-2xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            >
              Log
            </button>

            <button
              type="button"
              onClick={resetTimer}
              disabled={seconds === 0}
              className="p-2.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors disabled:opacity-30 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Picture-in-Picture Auto-Float Toggle Option */}
          <div className="flex items-center justify-between pt-2 pb-1 px-1 border-t border-black/[0.04] dark:border-white/[0.04] w-full text-[11px]">
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
              <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Auto-float in PiP on tab switch</span>
            </div>
            <button
              type="button"
              onClick={() => toggleAutoPip(!autoPipEnabled)}
              className={cn(
                "w-7 h-4 rounded-full transition-colors relative cursor-pointer shrink-0",
                autoPipEnabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
              )}
              title="Automatically open floating timer in Picture-in-Picture when you switch to another tab"
            >
              <span
                className={cn(
                  "w-3 h-3 rounded-full bg-white block transition-transform absolute top-0.5 shadow-xs",
                  autoPipEnabled ? "left-3.5" : "left-0.5"
                )}
              />
            </button>
          </div>

          {/* Select Week & Notes */}
          <div className="w-full space-y-2 pt-1 text-xs">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Associate Week:</label>
              <select
                value={weekId}
                onChange={(e) => setWeekId(e.target.value)}
                className="w-full font-mono bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              >
                {Array.from({ length: 33 }, (_, i) => {
                  const num = i + 1;
                  const val = `product-engineer-33-week-w${num.toString().padStart(2, "0")}`;
                  return (
                    <option key={val} value={val}>
                      Week {num.toString().padStart(2, "0")}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you work on? (optional)"
                className="w-full bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveManualSession} className="mt-2 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Minutes:
              </label>
              <input
                type="number"
                min="1"
                value={manualMinutes}
                onChange={(e) => setManualMinutes(e.target.value)}
                className="w-full font-mono bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Date:
              </label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full font-mono bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              Week:
            </label>
            <select
              value={weekId}
              onChange={(e) => setWeekId(e.target.value)}
              className="w-full font-mono bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            >
              <option value="">General Study</option>
              {Array.from({ length: 33 }, (_, i) => {
                const num = i + 1;
                const val = `product-engineer-33-week-w${num.toString().padStart(2, "0")}`;
                return (
                  <option key={val} value={val}>
                    Week {num.toString().padStart(2, "0")}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Session notes..."
              className="w-full bg-white dark:bg-[#090A0C] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white placeholder:text-zinc-400"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl font-bold text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition-all shadow-sm cursor-pointer"
            >
              Record Session
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
