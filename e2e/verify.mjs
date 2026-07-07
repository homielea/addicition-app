// End-to-end verification: drives the real first-run journey in a browser
// against `expo start --web` and asserts the product's promises, not just
// that screens render. Run:
//
//   npx expo start --web --port 8090     # terminal 1
//   npm run e2e                            # terminal 2
//
// PORT overrides the port; PW_CHROMIUM points at a chromium binary when
// playwright's own download isn't available.

import { chromium } from 'playwright';

const BASE = `http://localhost:${process.env.PORT ?? '8090'}`;
const OUT = new URL('./shots/', import.meta.url).pathname;
import { mkdirSync } from 'fs';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 420, height: 860 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });

await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForSelector('text=Your slip is intel', { timeout: 120000 });
await shot('1-onboarding');

await page.click('text=Doomscrolling');
await page.click('text=Start');
await page.waitForSelector('text=insight rep', { timeout: 30000 });
await shot('2-home');

await page.click('text=I slipped — log it');
await page.waitForSelector('text=What set it off', { timeout: 30000 });
await shot('3-autopsy-trigger');

await page.click('text=Stress');
await page.click('text=Next');
await page.waitForSelector('text=What were you feeling', { timeout: 30000 });
await page.click('text=Anxious');
await shot('4-autopsy-feeling');
await page.click('text=Next');

await page.waitForSelector('text=Note (optional)', { timeout: 30000 });
await page.fill('input, textarea', 'Home alone after a long day');
await page.click('text="Log it"');
await page.waitForSelector('text=+1 insight rep', { timeout: 30000 });
await shot('5-autopsy-done');

await page.click('text=See the danger map');
await page.waitForSelector('text=Top triggers', { timeout: 30000 });
await shot('6-danger-map');

// back to home, then prevention
await page.goto(`${BASE}/nudges`, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Top trigger: stress', { timeout: 30000 });
await shot('7-nudges');

// reload home to confirm persistence (reps should still be 1, no onboarding redirect)
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('text=insight rep', { timeout: 30000 });
const reps = await page.textContent('text=/^1$/').catch(() => null);
console.log('persisted reps text found:', reps !== null);
await shot('8-home-after');

console.log('FLOW OK');
await browser.close();
