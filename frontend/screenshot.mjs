import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const OUT_DIR = 'c:/education/Projects/Incubyte/docs/screenshots';
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const BASE = 'http://localhost:5173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

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
  await wait(3000);
  console.log('After login URL:', page.url());

  // 4. Admin dashboard
  await shot(page, 'admin_dashboard.png');

  // 5. Navigate to user dashboard
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle2' });
  await wait(2000);
  await shot(page, 'dashboard.png');

  // 6. Scroll down to purchase history section
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wait(1000);
  await shot(page, 'purchase_history.png');

  await browser.close();
  console.log('\n🎉 All screenshots saved to:', OUT_DIR);
})();
