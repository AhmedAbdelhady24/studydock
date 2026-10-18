import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { resolve, join } from 'node:path';

async function main() {
  const assetsDir = resolve('videos/showreel-motion/assets');
  console.log('Capturing polished light theme UI screenshots into:', assetsDir);

  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900, dsf: 1.5 });

  try {
    // 1. Navigate to today overview
    console.log('Loading http://127.0.0.1:3001/ ...');
    await page.goto('http://127.0.0.1:3001/', { settleMs: 1200 });

    // Enforce light theme
    await page.eval(() => {
      localStorage.setItem('studydock_theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });

    await page.goto('http://127.0.0.1:3001/', { settleMs: 1500 });
    await sleep(800);

    const todayPath = join(assetsDir, 'ui_today.png');
    console.log('Writing:', todayPath);
    await page.screenshot({ path: todayPath, format: 'png' });

    // 2. Open task detail drawer
    console.log('Clicking task card for drawer...');
    await page.eval(() => {
      const card = document.querySelector('[draggable="true"]');
      if (card) {
        card.click();
      }
    });
    await sleep(800);

    // Hide backdrop so only the drawer itself is visible
    await page.eval(() => {
      const backdrop = document.querySelector('.bg-black\\/60');
      if (backdrop) backdrop.style.display = 'none';
    });

    const drawerRect = await page.eval(() => {
      const drawer = document.querySelector('.max-w-lg');
      if (!drawer) return null;
      const r = drawer.getBoundingClientRect();
      return { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) };
    });

    const drawerPath = join(assetsDir, 'ui_drawer.png');
    console.log('Writing drawer panel clip:', drawerPath, drawerRect);
    if (drawerRect) {
      await page.screenshot({ path: drawerPath, format: 'png', clip: drawerRect });
    } else {
      await page.screenshot({ path: drawerPath, format: 'png' });
    }

    // 3. Roadmap
    console.log('Loading roadmap...');
    await page.goto('http://127.0.0.1:3001/roadmap', { settleMs: 1500 });
    await sleep(700);
    const roadmapPath = join(assetsDir, 'ui_roadmap.png');
    console.log('Writing:', roadmapPath);
    await page.screenshot({ path: roadmapPath, format: 'png' });

    // 4. Courses
    console.log('Loading courses...');
    await page.goto('http://127.0.0.1:3001/courses', { settleMs: 1500 });
    await sleep(700);
    const coursesPath = join(assetsDir, 'ui_courses.png');
    console.log('Writing:', coursesPath);
    await page.screenshot({ path: coursesPath, format: 'png' });

    // 5. DSA
    console.log('Loading dsa...');
    await page.goto('http://127.0.0.1:3001/dsa', { settleMs: 1500 });
    await sleep(700);
    const dsaPath = join(assetsDir, 'ui_dsa.png');
    console.log('Writing:', dsaPath);
    await page.screenshot({ path: dsaPath, format: 'png' });

    // 6. Analytics
    console.log('Loading analytics...');
    await page.goto('http://127.0.0.1:3001/analytics', { settleMs: 1500 });
    await sleep(700);
    const analyticsPath = join(assetsDir, 'ui_analytics.png');
    console.log('Writing:', analyticsPath);
    await page.screenshot({ path: analyticsPath, format: 'png' });

    console.log('All fresh light theme screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
