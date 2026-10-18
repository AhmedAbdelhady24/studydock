import { chromium } from "@playwright/test";
import path from "path";

const ARTIFACT_DIR = "/Users/ahmedabdelhady/.gemini/antigravity/brain/70006eed-3b77-4bf3-953b-7abe803893a1";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("1. Navigating to StudyDock http://localhost:3001 ...");
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });

  // 1. Locate start timer button inside Focus Timer card
  const timerCard = page.locator('text="Focus Timer"').locator('xpath=ancestor::div[contains(@class, "rounded-3xl")]');
  await timerCard.waitFor({ state: "visible", timeout: 5000 });
  const startButton = timerCard.locator('button:has-text("Start")');
  await startButton.waitFor({ state: "visible", timeout: 5000 });
  console.log("✓ Start button visible in Focus Timer card");

  // 2. Click Start to begin focus session
  await startButton.click();
  await page.waitForTimeout(1500); // Wait 1.5s for timer to tick

  // Verify timer is running and playbackState is "playing"
  const statePlaying = await page.evaluate(() => {
    return {
      playbackState: (navigator as any).mediaSession?.playbackState,
      metadataTitle: (navigator as any).mediaSession?.metadata?.title,
      videoPaused: (document.querySelector("video") as HTMLVideoElement)?.paused,
      hasStream: !!(document.querySelector("video") as HTMLVideoElement)?.srcObject,
    };
  });
  console.log("✓ After Start, playback state:", statePlaying);
  if (statePlaying.playbackState !== "playing") {
    throw new Error(`Expected playbackState to be "playing", got: ${statePlaying.playbackState}`);
  }

  // Verify button changed to "Pause" on website
  const pauseButton = timerCard.locator('button:has-text("Pause")');
  await pauseButton.waitFor({ state: "visible", timeout: 2000 });
  console.log("✓ Website button shows 'Pause'");

  // 3. Simulate clicking the PAUSE button inside PiP / MediaSession
  console.log("2. Simulating PiP/MediaSession PAUSE click...");
  await page.evaluate(() => {
    // MediaSession pause action handler or video.pause()
    const video = document.querySelector("video") as HTMLVideoElement;
    if (video) {
      video.pause();
    }
  });
  await page.waitForTimeout(500);

  // Check state after pause
  const statePaused = await page.evaluate(() => {
    return {
      playbackState: (navigator as any).mediaSession?.playbackState,
      videoPaused: (document.querySelector("video") as HTMLVideoElement)?.paused,
    };
  });
  console.log("✓ After PiP Pause, state:", statePaused);
  if (statePaused.playbackState !== "paused") {
    throw new Error(`Expected playbackState to be "paused", got: ${statePaused.playbackState}`);
  }

  // Verify website button changed to "Resume"
  const resumeButton = timerCard.locator('button:has-text("Resume")');
  await resumeButton.waitFor({ state: "visible", timeout: 2000 });
  console.log("✓ Website button shows 'Resume' when paused with accumulated seconds");

  // Take screenshot of paused state
  const pausedScreenshotPath = path.join(ARTIFACT_DIR, "timer_pip_paused_state.png");
  await page.screenshot({ path: pausedScreenshotPath });
  console.log("✓ Saved paused timer screenshot:", pausedScreenshotPath);

  // 4. Simulate clicking the RESUME / PLAY button inside PiP / MediaSession
  console.log("3. Simulating PiP/MediaSession RESUME click...");
  await page.evaluate(async () => {
    const video = document.querySelector("video") as HTMLVideoElement;
    if (video) {
      await video.play();
    }
  });
  await page.waitForTimeout(1500); // Let it tick after resume

  // Check state after resume
  const stateResumed = await page.evaluate(() => {
    return {
      playbackState: (navigator as any).mediaSession?.playbackState,
      metadataTitle: (navigator as any).mediaSession?.metadata?.title,
      videoPaused: (document.querySelector("video") as HTMLVideoElement)?.paused,
    };
  });
  console.log("✓ After PiP Resume, state:", stateResumed);
  if (stateResumed.playbackState !== "playing") {
    throw new Error(`Expected playbackState to be "playing", got: ${stateResumed.playbackState}`);
  }

  // Verify website button flipped back to "Pause"
  await timerCard.locator('button:has-text("Pause")').waitFor({ state: "visible", timeout: 2000 });
  console.log("✓ Website button flipped back to 'Pause' after PiP resume");

  // Take screenshot of resumed state
  const resumedScreenshotPath = path.join(ARTIFACT_DIR, "timer_pip_resumed_state.png");
  await page.screenshot({ path: resumedScreenshotPath });
  console.log("✓ Saved resumed timer screenshot:", resumedScreenshotPath);

  await browser.close();
  console.log("All PiP playback and resume verifications passed with 100% success!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
