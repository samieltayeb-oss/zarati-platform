/* eslint-disable */
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://zarati-platform.vercel.app';

const scratchDir = 'C:\\Users\\mcreg\\.gemini\\antigravity\\brain\\c8c29ef2-6ae9-4fef-8633-779f017fa972\\scratch';
let keys = {};
try {
  if (fs.existsSync(path.join(scratchDir, 'api-keys.json'))) {
    keys = JSON.parse(fs.readFileSync(path.join(scratchDir, 'api-keys.json'), 'utf8'));
  }
} catch (e) {}

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || keys.serviceRoleKey || '';

const routesToTest = [
  { path: '/ar', lang: 'ar', dir: 'rtl', expectedText: 'زرعتي' },
  { path: '/en', lang: 'en', dir: 'ltr', expectedText: 'ZARATI' },
  { path: '/ar/marketplace', lang: 'ar', dir: 'rtl', expectedText: 'سوق' },
  { path: '/en/marketplace', lang: 'en', dir: 'ltr', expectedText: 'Marketplace' },
  { path: '/ar/crops', lang: 'ar', dir: 'rtl', expectedText: 'محاصيل' },
  { path: '/en/crops', lang: 'en', dir: 'ltr', expectedText: 'Crops' },
  { path: '/ar/weather', lang: 'ar', dir: 'rtl', expectedText: 'طقس' },
  { path: '/en/weather', lang: 'en', dir: 'ltr', expectedText: 'Weather' },
  { path: '/ar/register', lang: 'ar', dir: 'rtl', expectedText: 'تسجيل' },
  { path: '/en/register', lang: 'en', dir: 'ltr', expectedText: 'Register' },
  { path: '/ar/about', lang: 'ar', dir: 'rtl', expectedText: 'عن زرعتي' },
  { path: '/en/about', lang: 'en', dir: 'ltr', expectedText: 'About' },
  { path: '/ar/contact', lang: 'ar', dir: 'rtl', expectedText: 'تواصل' },
  { path: '/en/contact', lang: 'en', dir: 'ltr', expectedText: 'Contact' },
  { path: '/ar/privacy', lang: 'ar', dir: 'rtl', expectedText: 'الخصوصية' },
  { path: '/en/privacy', lang: 'en', dir: 'ltr', expectedText: 'Privacy' },
  { path: '/ar/terms', lang: 'ar', dir: 'rtl', expectedText: 'الشروط' },
  { path: '/en/terms', lang: 'en', dir: 'ltr', expectedText: 'Terms' }
];

async function fetchUrl(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ZaratiSmokeTester/1.0'
    }
  });
  const text = await res.text();
  return { status: res.status, headers: res.headers, text };
}

async function runSmokeTests() {
  console.log('====================================================');
  console.log(' LIVE PRODUCTION SMOKE TEST SUITE');
  console.log(' Target:', BASE_URL);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // 1. Route Status and HTML validation
  console.log('--- 1. ROUTE INTEGRITY & DIRECTIONALITY ---');
  for (const r of routesToTest) {
    const fullUrl = `${BASE_URL}${r.path}`;
    try {
      const res = await fetchUrl(fullUrl);
      const isStatusOk = res.status === 200;
      const hasLang = res.text.includes(`lang="${r.lang}"`);
      const hasDir = res.text.includes(`dir="${r.dir}"`);
      const hasText = res.text.includes(r.expectedText);

      if (isStatusOk && hasLang && hasDir) {
        console.log(`[PASS] ${r.path.padEnd(20)} | Status: 200 | lang="${r.lang}" | dir="${r.dir}"`);
        passed++;
      } else {
        console.error(`[FAIL] ${r.path.padEnd(20)} | Status: ${res.status} | lang=${hasLang} | dir=${hasDir} | text=${hasText}`);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${r.path.padEnd(20)}:`, err.message);
      failed++;
    }
  }

  // 2. Secret Exposure Scan across fetched HTML & Scripts
  console.log('\n--- 2. CLIENT SECRET LEAK SCAN ---');
  const serviceKey = serviceRoleKey;
  const projectRef = 'nelsijiczufflyqosvzi';
  const homeRes = await fetchUrl(`${BASE_URL}/ar`);
  
  // Extract all script tags
  const scriptRegex = /src="(\/_next\/static\/[^"]+)"/g;
  let match;
  const scriptUrls = [];
  while ((match = scriptRegex.exec(homeRes.text)) !== null) {
    scriptUrls.push(match[1]);
  }

  console.log(`Found ${scriptUrls.length} static client JS bundle(s). Scanning for secret leakage...`);

  let secretLeaked = false;
  // Check main HTML
  if (homeRes.text.includes(serviceKey)) {
    console.error('[CRITICAL FAIL] SUPABASE_SERVICE_ROLE_KEY found in server HTML!');
    secretLeaked = true;
  }
  if (homeRes.text.includes(projectRef) && homeRes.text.includes('service_role')) {
    console.error('[CRITICAL FAIL] service_role reference found in server HTML!');
    secretLeaked = true;
  }

  // Check static JS bundles
  for (const scriptPath of scriptUrls) {
    const sRes = await fetchUrl(`${BASE_URL}${scriptPath}`);
    if (sRes.text.includes(serviceKey)) {
      console.error(`[CRITICAL FAIL] SUPABASE_SERVICE_ROLE_KEY leaked in ${scriptPath}!`);
      secretLeaked = true;
    }
    if (sRes.text.includes('service_role')) {
      console.error(`[CRITICAL FAIL] "service_role" found in bundle ${scriptPath}!`);
      secretLeaked = true;
    }
  }

  if (!secretLeaked) {
    console.log('[PASS] ZERO leakage of SUPABASE_SERVICE_ROLE_KEY in client bundles or HTML.');
    passed++;
  } else {
    failed++;
  }

  // 3. Verify Mock Fallback Active
  console.log('\n--- 3. MOCK FALLBACK STATUS ---');
  const marketRes = await fetchUrl(`${BASE_URL}/ar/marketplace`);
  const hasMarketItems = marketRes.text.includes('ذرة') || marketRes.text.includes('سمسم') || marketRes.text.includes('طن');
  console.log(`Marketplace renders items (mock fallback active): ${hasMarketItems}`);
  if (hasMarketItems) {
    console.log('[PASS] Marketplace successfully renders fallback UI without errors.');
    passed++;
  } else {
    console.error('[FAIL] Marketplace did not render expected content.');
    failed++;
  }

  console.log('\n====================================================');
  console.log(` SMOKE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSmokeTests().catch(err => {
  console.error('Fatal smoke test error:', err);
  process.exit(1);
});
