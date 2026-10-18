import { chromium } from "@playwright/test";
import path from "path";

const ARTIFACT_DIR = "/Users/ahmedabdelhady/.gemini/antigravity/brain/70006eed-3b77-4bf3-953b-7abe803893a1";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("1. Navigating to http://localhost:3001 ...");
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });

  // 1. Verify search input exists
  const searchInput = page.locator('input[placeholder*="Search topics"]');
  await searchInput.waitFor({ state: "visible", timeout: 5000 });
  console.log("✓ Search input is visible on desktop");

  // 2. Click search input to open suggestions
  await searchInput.click();
  await page.waitForTimeout(400);

  // Take screenshot of default suggestions
  const defaultScreenshotPath = path.join(ARTIFACT_DIR, "search_palette_default.png");
  await page.screenshot({ path: defaultScreenshotPath });
  console.log("✓ Saved default search palette screenshot:", defaultScreenshotPath);

  // 3. Type "React" into search
  await searchInput.fill("React");
  await page.waitForTimeout(400); // Debounce + fetch wait

  // Check results are displayed
  const resultsContainer = page.locator('text="Results for "React""');
  await resultsContainer.waitFor({ state: "visible", timeout: 5000 });
  console.log("✓ Live search returned results for query 'React'");

  // Take screenshot with query results
  const queryScreenshotPath = path.join(ARTIFACT_DIR, "search_palette_react.png");
  await page.screenshot({ path: queryScreenshotPath });
  console.log("✓ Saved React search results screenshot:", queryScreenshotPath);

  // Toggle to light mode and search again to test light mode dropdown
  const themeToggle = page.locator('button[aria-label="Toggle Theme"]');
  await themeToggle.click();
  await page.waitForTimeout(300);

  // Focus and type in light mode
  await searchInput.click();
  await searchInput.fill("React");
  await page.waitForTimeout(400);

  const lightScreenshotPath = path.join(ARTIFACT_DIR, "search_palette_light.png");
  await page.screenshot({ path: lightScreenshotPath });
  console.log("✓ Saved light mode search results screenshot:", lightScreenshotPath);

  // Toggle back to dark mode
  await themeToggle.click();
  await page.waitForTimeout(200);

  // 4. Test ArrowDown and Enter keyboard navigation
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(200);

  // 5. Press Enter to navigate
  await page.keyboard.press("Enter");
  await page.waitForTimeout(600);
  console.log("✓ Navigated after Enter key to URL:", page.url());

  // 6. Test mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });

  const mobileSearchBtn = page.locator('button[aria-label="Open Search"]');
  await mobileSearchBtn.waitFor({ state: "visible", timeout: 5000 });
  await mobileSearchBtn.click();
  await page.waitForTimeout(300);

  const mobileInput = page.locator('.fixed input[placeholder*="Search topics"]');
  await mobileInput.fill("DSA");
  await page.waitForTimeout(400);

  const mobileScreenshotPath = path.join(ARTIFACT_DIR, "search_mobile_dsa.png");
  await page.screenshot({ path: mobileScreenshotPath });
  console.log("✓ Saved mobile search screenshot:", mobileScreenshotPath);

  await browser.close();
  console.log("All search verifications completed successfully!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
