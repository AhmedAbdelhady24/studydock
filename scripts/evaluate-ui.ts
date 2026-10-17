import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting Playwright UI/UX audit on http://127.0.0.1:3001 ...");

  const screenshotDir = path.resolve(__dirname, "../screenshots");
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
  });
  const page = await context.newPage();

  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  // 1. Today Page (Kanban Board by default)
  console.log("Navigating to http://127.0.0.1:3001/ ...");
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(screenshotDir, "01_today.png"), fullPage: true });
  console.log("📸 Saved screenshot: 01_today.png (Kanban Board view)");

  // 2. Open Task Detail Drawer by clicking the first task in To Do column
  const firstCard = page.locator("h4:has-text('Course and concepts')").first();
  if (await firstCard.isVisible()) {
    console.log("Clicking task card to open Detail Drawer...");
    await firstCard.click();
    await page.waitForTimeout(500); // allow slide-in animation
    await page.screenshot({ path: path.join(screenshotDir, "01_today_drawer.png"), fullPage: true });
    console.log("📸 Saved screenshot: 01_today_drawer.png (Slide-over Detail Drawer with Course & Book)");

    // Close the drawer with Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  }

  // 3. Switch to List view
  const listToggle = page.locator("button:has-text('List')").first();
  if (await listToggle.isVisible()) {
    console.log("Toggling to List view...");
    await listToggle.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, "01_today_list.png"), fullPage: true });
    console.log("📸 Saved screenshot: 01_today_list.png (List view with Course pills)");
    // Toggle back to Kanban
    await page.locator("button:has-text('Board')").first().click();
    await page.waitForTimeout(300);
  }

  // 4. Other pages
  const routes = [
    { url: "http://127.0.0.1:3001/roadmap", name: "02_roadmap" },
    { url: "http://127.0.0.1:3001/weeks/product-engineer-33-week-w01", name: "03_week_detail" },
    { url: "http://127.0.0.1:3001/courses", name: "04_courses" },
    { url: "http://127.0.0.1:3001/dsa", name: "05_dsa" },
    { url: "http://127.0.0.1:3001/sessions", name: "06_sessions" },
    { url: "http://127.0.0.1:3001/analytics", name: "07_analytics" },
    { url: "http://127.0.0.1:3001/import", name: "08_import" },
  ];

  for (const r of routes) {
    console.log(`Navigating to ${r.url} ...`);
    await page.goto(r.url, { waitUntil: "networkidle" });
    const shotPath = path.join(screenshotDir, `${r.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    console.log(`📸 Saved screenshot: ${shotPath}`);
  }

  console.log("\n--- UI Audit Results ---");
  if (consoleErrors.length > 0) {
    console.log(`⚠️ Console errors captured (${consoleErrors.length}):`);
    consoleErrors.forEach((e) => console.log(`   - ${e}`));
  } else {
    console.log("✅ Zero console errors across all tested pages!");
  }

  await browser.close();
  console.log("🎉 UI evaluation completed!");
}

main().catch((err) => {
  console.error("Evaluation script failed:", err);
  process.exit(1);
});
