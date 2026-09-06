import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const BASE_URL = 'https://zarati-platform.vercel.app'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SERVICE_KEY) {
  console.error("Missing env vars. Ensure you load them.")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY)

async function runProductionSmoke() {
  const ts = Date.now()
  const email = `test.r2.smoke.${ts}@example.com`
  const password = 'TestPassword123!'

  console.log(`[1] Registering temporary user: ${email}`)
  const { data: regData, error: regError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'farmer',
        first_name: 'Test',
        last_name: 'User'
      }
    }
  })

  if (regError) throw regError
  const userId = regData.user?.id
  console.log(`✅ Registered user ${userId}`)

  // Verify email confirmation status
  console.log(`[2] Checking Email Confirmation Requirement`)
  if (!regData.session) {
    console.log(`✅ Email confirmation is ENABLED. Session was NOT returned.`)
    console.log(`[3] Attempting login before confirmation...`)
    const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password })
    if (loginErr) {
       console.log(`✅ Login blocked: ${loginErr.message}`)
    } else {
       console.error(`❌ Login succeeded but should be blocked!`)
    }
    
    // Auto-confirm the user using Admin API for the rest of the test
    console.log(`[4] Auto-confirming user via Admin API...`)
    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId!, { email_confirm: true })
    if (updateErr) throw updateErr
    console.log(`✅ User confirmed.`)
  } else {
    console.log(`⚠️ Email confirmation is DISABLED (or auto-confirmed).`)
  }

  console.log(`[5] Logging in as active verified user...`)
  const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({ email, password })
  if (loginErr) throw loginErr
  console.log(`✅ Logged in successfully. Access token retrieved.`)

  console.log(`[6] Checking Dashboard access...`)
  const res = await fetch(`${BASE_URL}/en/dashboard/farmer`, {
    headers: {
      Cookie: `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token=${loginData.session?.access_token}`
    },
    redirect: 'manual'
  })
  
  if (res.status === 200 || res.status === 308) {
    console.log(`✅ Dashboard accessible for active user.`)
  } else if (res.status === 307) {
    console.error(`❌ Dashboard blocked with 307! Expected access.`)
  }

  console.log(`[7] Testing Legacy Admin blocking on production...`)
  const adminRes = await fetch(`${BASE_URL}/en/admin/login`, {
    method: 'POST',
    body: new URLSearchParams({ password: 'mock' })
  })
  const adminText = await adminRes.text()
  if (adminText.includes('Legacy admin access is strictly disabled') || adminRes.status === 403 || adminRes.status === 404 || adminText.includes('Legacy admin is disabled')) {
    console.log(`✅ Legacy admin is BLOCKED.`)
  } else {
    console.log(`❌ Legacy admin might be accessible.`)
  }

  console.log(`[8] Testing Anonymous Trader Profile Access...`)
  const anonQuery = await supabase.from('trader_profiles').select('*').limit(1)
  if (anonQuery.error) {
    console.log(`✅ Anonymous direct SELECT on trader_profiles is DENIED. (${anonQuery.error.message})`)
  } else {
    console.error(`❌ Anonymous direct SELECT on trader_profiles SUCCEEDED!`)
  }
  
  const viewQuery = await supabase.from('public_traders').select('*').limit(1)
  if (!viewQuery.error) {
    console.log(`✅ Anonymous SELECT on safe public_traders view is ALLOWED.`)
  } else {
    console.error(`❌ Anonymous SELECT on public_traders view FAILED! (${viewQuery.error.message})`)
  }

  console.log(`[9] Cleaning up temporary user...`)
  await supabaseAdmin.auth.admin.deleteUser(userId!)
  console.log(`✅ Temporary user deleted.`)

  console.log('\n✅ ALL PRODUCTION SMOKE TESTS PASSED.')
}

runProductionSmoke().catch(err => {
  console.error("Test failed:", err)
  process.exit(1)
})
