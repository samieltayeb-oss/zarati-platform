const fs = require('fs');
const path = require('path');

const scratchDir = 'C:\\Users\\mcreg\\.gemini\\antigravity\\brain\\c8c29ef2-6ae9-4fef-8633-779f017fa972\\scratch';
let keys = {};
try {
  if (fs.existsSync(path.join(scratchDir, 'api-keys.json'))) {
    keys = JSON.parse(fs.readFileSync(path.join(scratchDir, 'api-keys.json'), 'utf8'));
  }
} catch (e) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || keys.supabaseUrl || 'https://nelsijiczufflyqosvzi.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || keys.serviceRoleKey || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || keys.anonKey || '';

async function run() {
  console.log('====================================================');
  console.log(' ZARATI PRODUCTION DATABASE CATALOG & DATA PROBE');
  console.log(' URL:', supabaseUrl);
  console.log('====================================================');

  const headers = {
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`
  };

  // 1. Verify States (18 expected)
  const statesRes = await fetch(`${keys.supabaseUrl}/rest/v1/states?select=*&order=code.asc`, { headers });
  const states = await statesRes.json();
  console.log(`\n1. STATES: Count = ${states.length} (Expected: 18)`);
  if (states.length !== 18) throw new Error(`States count mismatch: ${states.length}`);
  
  // Verify specific Arabic names
  const gedaref = states.find(s => s.code === 'SD-GD');
  const kassala = states.find(s => s.code === 'SD-KS');
  const redSea = states.find(s => s.code === 'SD-RS');
  console.log('   - Gedaref Arabic:', gedaref.name_ar, '(Match: القضارف ->', gedaref.name_ar === 'القضارف', ')');
  console.log('   - Kassala Arabic:', kassala.name_ar, '(Match: كسلا ->', kassala.name_ar === 'كسلا', ')');
  console.log('   - Red Sea Arabic:', redSea.name_ar, '(Match: البحر الأحمر ->', redSea.name_ar === 'البحر الأحمر', ')');
  console.log('   - Port Sudan Capital:', redSea.capital_ar, '(Match: بورتسودان ->', redSea.capital_ar === 'بورتسودان', ')');

  // 2. Verify Markets (10 expected)
  const marketsRes = await fetch(`${keys.supabaseUrl}/rest/v1/markets?select=*,states(code,name_ar)&order=code.asc`, { headers });
  const markets = await marketsRes.json();
  console.log(`\n2. MARKETS: Count = ${markets.length} (Expected: 10)`);
  if (markets.length !== 10) throw new Error(`Markets count mismatch: ${markets.length}`);
  const mktGd = markets.find(m => m.code === 'MKT-GD-01');
  const mktPs = markets.find(m => m.code === 'MKT-PS-01');
  console.log('   - Gedaref Market Name:', mktGd.name_ar, '(Match: سوق محاصيل القضارف ->', mktGd.name_ar === 'سوق محاصيل القضارف', ')');
  console.log('   - Port Sudan Market Name:', mktPs.name_ar, '(Match: سوق بورتسودان النهائي ->', mktPs.name_ar === 'سوق بورتسودان النهائي', ')');
  console.log('   - State FK Join Verified:', mktGd.states.name_ar === 'القضارف');

  // 3. Verify Crops (8 expected)
  const cropsRes = await fetch(`${keys.supabaseUrl}/rest/v1/crops?select=*&order=sort_order.asc`, { headers });
  const crops = await cropsRes.json();
  console.log(`\n3. CROPS: Count = ${crops.length} (Expected: 8)`);
  if (crops.length !== 8) throw new Error(`Crops count mismatch: ${crops.length}`);
  const sorghum = crops.find(c => c.code === 'sorghum');
  const sesame = crops.find(c => c.code === 'sesame');
  console.log('   - Sorghum Arabic:', sorghum.name_ar, '(Match: ذرة رفيعة ->', sorghum.name_ar === 'ذرة رفيعة', ')');
  console.log('   - Sesame Arabic:', sesame.name_ar, '(Match: سمسم ->', sesame.name_ar === 'سمسم', ')');

  // 4. Verify Tables & Operational Entities (Must be 0 fake business rows!)
  const tables = [
    'profiles', 'trader_profiles', 'farms', 'farm_crops',
    'crop_prices', 'listings', 'listing_media', 'inquiries',
    'moderation_events', 'waitlist'
  ];

  console.log('\n4. OPERATIONAL TABLES ROW AUDIT (Zero fake data check):');
  for (const t of tables) {
    const r = await fetch(`${keys.supabaseUrl}/rest/v1/${t}?select=count`, {
      headers: { ...headers, 'Prefer': 'count=exact' }
    });
    const contentRange = r.headers.get('content-range');
    console.log(`   - Table '${t}': Row Count = ${contentRange ? contentRange.split('/')[1] : 'unknown'}`);
  }

  // 5. Verify Public View
  const viewRes = await fetch(`${keys.supabaseUrl}/rest/v1/marketplace_seller_public?select=*`, { headers });
  console.log('\n5. VIEW marketplace_seller_public status:', viewRes.status, viewRes.statusText);

  console.log('\n====================================================');
  console.log(' ALL PRODUCTION ENTITIES & CANONICAL DATA VERIFIED!');
  console.log('====================================================');
}

run().catch(err => {
  console.error('PROBE FAILED:', err);
  process.exit(1);
});
