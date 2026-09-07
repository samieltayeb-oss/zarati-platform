const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const artifactsDir = 'C:\\Users\\mcreg\\.gemini\\antigravity\\brain\\c8c29ef2-6ae9-4fef-8633-779f017fa972\\r3.5-premium-review';
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch();
  
  const desktopParams = { viewport: { width: 1440, height: 900 } };
  const mobileParams = { viewport: { width: 390, height: 844 } };
  
  // English Homepage Desktop
  let page = await browser.newPage(desktopParams);
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(artifactsDir, 'desktop_homepage_en.png'), fullPage: true });
  await page.close();

  // Arabic Homepage Desktop
  page = await browser.newPage(desktopParams);
  await page.goto('http://localhost:3000/ar', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(artifactsDir, 'desktop_homepage_ar.png'), fullPage: true });
  await page.close();

  // English Homepage Mobile
  page = await browser.newPage(mobileParams);
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(artifactsDir, 'mobile_homepage_en.png'), fullPage: true });
  await page.close();

  // Arabic Homepage Mobile
  page = await browser.newPage(mobileParams);
  await page.goto('http://localhost:3000/ar', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(artifactsDir, 'mobile_homepage_ar.png'), fullPage: true });
  await page.close();

  // Marketplace Desktop
  page = await browser.newPage(desktopParams);
  await page.goto('http://localhost:3000/en/marketplace', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(artifactsDir, 'desktop_marketplace.png'), fullPage: true });
  await page.close();

  // Farmer Dashboard Mobile
  page = await browser.newPage(mobileParams);
  await page.goto('http://localhost:3000/en/dashboard/farmer', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(artifactsDir, 'mobile_farmer_dashboard.png'), fullPage: true });
  await page.close();

  // Trader Dashboard Desktop
  page = await browser.newPage(desktopParams);
  await page.goto('http://localhost:3000/en/dashboard/trader', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(artifactsDir, 'desktop_trader_dashboard.png'), fullPage: true });
  await page.close();

  await browser.close();
  console.log('Screenshots captured successfully.');
}

capture().catch(console.error);
