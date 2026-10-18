import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { resolve, join } from 'node:path';

async function main() {
  const assetsDir = resolve('.hyperframes/demo-video-light/assets');
  console.log('Launching browser to capture light theme screenshots to:', assetsDir);

  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900, dsf: 1 });

  try {
    // 1. Navigate to today overview
    console.log('Navigating to http://127.0.0.1:3001/');
    await page.goto('http://127.0.0.1:3001/', { settleMs: 1000 });

    // Set light mode in localStorage and document
    await page.eval(() => {
      localStorage.setItem('studydock_theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    // Reload to let ThemeProvider and all subcomponents mount in light mode
    await page.goto('http://127.0.0.1:3001/', { settleMs: 1500 });
    await sleep(800);

    // Capture today view
    const todayPath = join(assetsDir, '01_today.png');
    console.log('Capturing:', todayPath);
    await page.screenshot({ path: todayPath, format: 'png' });

    // Click a task card to open the drawer
    console.log('Opening task drawer...');
    await page.eval(() => {
      const card = document.querySelector('[draggable="true"]');
      if (card) {
        card.click();
      }
    });
    await sleep(600);

    // Capture today drawer view
    const drawerPath = join(assetsDir, '01_today_drawer.png');
    console.log('Capturing:', drawerPath);
    await page.screenshot({ path: drawerPath, format: 'png' });

    // Navigate to roadmap
    console.log('Navigating to roadmap...');
    await page.goto('http://127.0.0.1:3001/roadmap', { settleMs: 1500 });
    await sleep(600);

    const roadmapPath = join(assetsDir, '02_roadmap.png');
    console.log('Capturing:', roadmapPath);
    await page.screenshot({ path: roadmapPath, format: 'png' });

    // Navigate to courses
    console.log('Navigating to courses...');
    await page.goto('http://127.0.0.1:3001/courses', { settleMs: 1500 });
    await sleep(600);

    const coursesPath = join(assetsDir, '04_courses.png');
    console.log('Capturing:', coursesPath);
    await page.screenshot({ path: coursesPath, format: 'png' });

    console.log('Successfully captured all light mode screenshots!');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
