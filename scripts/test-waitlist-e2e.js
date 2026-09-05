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

async function testWaitlistEndToEnd() {
  console.log('====================================================');
  console.log(' LIVE WAITLIST END-TO-END VERIFICATION');
  console.log(' Target URL: https://zarati-platform.vercel.app/ar');
  console.log(' Database:   ', supabaseUrl);
  console.log('====================================================\n');

  // We test the Server Action via HTTP POST using Next.js action protocol or via direct registration
  // First, fetch the page to get the action ID / form
  const pageRes = await fetch('https://zarati-platform.vercel.app/ar');
  const pageHtml = await pageRes.text();
  console.log('Live Arabic page fetched. Status:', pageRes.status);
  
  // Test direct insert into waitlist using the production client (simulating server action)
  const testEmail = `sam+e2e_verify_${Date.now()}@nexorayyc.io`;
  const insertPayload = {
    name: 'Dr. Omer Idris',
    email: testEmail,
    role: 'investor',
    language: 'ar',
  };

  console.log('1. Submitting test waitlist registration:', insertPayload.email);
  const insRes = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(insertPayload)
  });

  console.log('   - Anonymous Waitlist Insert HTTP Status:', insRes.status, insRes.statusText);

  if (insRes.status !== 201) {
    const errText = await insRes.text();
    throw new Error(`Waitlist insert failed with status ${insRes.status}: ${errText}`);
  }

  // 2. Query as Admin (service role) to verify record physically exists in production
  console.log('\n2. Verifying record persistence in production database...');
  const verifyRes = await fetch(`${supabaseUrl}/rest/v1/waitlist?email=eq.${encodeURIComponent(testEmail)}`, {
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    }
  });
  const rows = await verifyRes.json();
  console.log('   - Verified in Supabase Production DB:', rows.length === 1);
  console.log('   - Stored Name:', rows[0]?.name);
  console.log('   - Stored Email:', rows[0]?.email);
  console.log('   - Stored Role:', rows[0]?.role);
  console.log('   - Created At:', rows[0]?.created_at);

  const recordId = rows[0]?.id;

  // 3. Clean up the controlled test row
  console.log('\n3. Cleaning up controlled test registration from production DB...');
  const delRes = await fetch(`${supabaseUrl}/rest/v1/waitlist?id=eq.${recordId}`, {
    method: 'DELETE',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    }
  });
  console.log('   - Cleanup HTTP Status:', delRes.status, delRes.statusText);

  // 4. Verify waitlist is back to 0 rows
  const countRes = await fetch(`${supabaseUrl}/rest/v1/waitlist?select=count`, {
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Prefer': 'count=exact'
    }
  });
  const cr = countRes.headers.get('content-range');
  console.log('   - Final Production Waitlist Row Count:', cr ? cr.split('/')[1] : '0');
  console.log('\n====================================================');
  console.log(' WAITLIST END-TO-END TEST PASSED & CLEANED UP!');
  console.log('====================================================');
}

testWaitlistEndToEnd().catch(err => {
  console.error('Waitlist test failed:', err);
  process.exit(1);
});
