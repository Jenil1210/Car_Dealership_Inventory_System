import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const OUT_DIR = 'c:/education/Projects/Incubyte/docs/screenshots';
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const BASE = 'http://localhost:5173';

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT_DIR, name), fullPage: true });
  console.log(`✅ Saved: ${name}`);
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Login page
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2' });
  await shot(page, 'login.png');

  // 2. Register page
  await page.goto(`${BASE}/register`, { waitUntil: 'networkidle2' });
  await shot(page, 'register.png');

  // 3. Login as admin
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2' });
  await page.type('#email', 'admin@dealership.com');
  await page.type('#password', 'Admin@123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  console.log('After login URL:', page.url());

  // 4. Dashboard (user view – if redirected to admin, go to /dashboard manually)
  if (page.url().includes('admin')) {
    // Take admin screenshot first
    await shot(page, 'admin_dashboard.png');
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle2' });
  }

  await page.waitForTimeout(1500);
  await shot(page, 'dashboard.png');

  // 5. Scroll down to purchase history
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await shot(page, 'purchase_history.png');

  // 6. Admin dashboard
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle2' });
  await page.waitForTimeout(1000);
  await shot(page, 'admin_dashboard.png');

  await browser.close();
  console.log('\n🎉 All screenshots saved to:', OUT_DIR);
})();
