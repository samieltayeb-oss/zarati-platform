/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const scratchDir = 'C:\\Users\\mcreg\\.gemini\\antigravity\\brain\\c8c29ef2-6ae9-4fef-8633-779f017fa972\\scratch'
let keys: { supabaseUrl?: string; anonKey?: string; serviceRoleKey?: string } = {}
try {
  if (fs.existsSync(path.join(scratchDir, 'api-keys.json'))) {
    keys = JSON.parse(fs.readFileSync(path.join(scratchDir, 'api-keys.json'), 'utf8'))
  }
} catch (e) {
  // Ignored
}

const PROD_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || keys.supabaseUrl || 'https://nelsijiczufflyqosvzi.supabase.co'
const PROD_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || keys.anonKey || ''
const PROD_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || keys.serviceRoleKey || ''

const serviceClient = createClient(PROD_URL, PROD_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const anonClient = createClient(PROD_URL, PROD_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

interface TestResult {
  suite: string
  testName: string
  actor: string
  status: 'PASS' | 'FAIL'
  details?: string
}

const results: TestResult[] = []

function record(testName: string, actor: string, passed: boolean, details?: string) {
  const res: TestResult = {
    suite: 'PROD_RLS',
    testName,
    actor,
    status: passed ? 'PASS' : 'FAIL',
    details,
  }
  results.push(res)
  const mark = passed ? '✅ PASS' : '❌ FAIL'
  console.log(`${mark} [${actor}] ${testName}`)
  if (details) console.log(`   Details: ${details}`)
}

async function runProdSecuritySuite() {
  console.log('====================================================================')
  console.log(' ZARATI PRODUCTION: ADVERSARIAL RLS SECURITY & AUTHSUITE')
  console.log(` Target: ${PROD_URL}`)
  console.log('====================================================================\n')

  // --- PART 1: ANONYMOUS ACCESS CONTROLS ---
  console.log('--- PART 1: ANONYMOUS ACCESS CONTROLS ---')

  // 1. Anon can read reference tables
  const { data: stData } = await anonClient.from('states').select('code')
  const { data: mkData } = await anonClient.from('markets').select('code')
  const { data: crData } = await anonClient.from('crops').select('code')
  record(
    'Public CAN read approved reference data (states, markets, crops)',
    'ANONYMOUS',
    (stData?.length === 18 && mkData?.length === 10 && crData?.length === 8),
    `States: ${stData?.length}, Markets: ${mkData?.length}, Crops: ${crData?.length}`
  )

  // 2. Anon CANNOT query profiles directly (PII harvest)
  const { data: profData } = await anonClient.from('profiles').select('*')
  record('Anonymous CANNOT query profiles directly (PII protected)', 'ANONYMOUS', (profData?.length === 0), `Rows visible: ${profData?.length ?? 0}`)

  // 3. Anon CANNOT query inquiries
  const { data: inqData } = await anonClient.from('inquiries').select('*')
  record('Anonymous CANNOT query transaction inquiries', 'ANONYMOUS', (inqData?.length === 0), `Rows visible: ${inqData?.length ?? 0}`)

  // 4. Anon CANNOT manipulate crop prices
  const { error: priceErr } = await anonClient.from('crop_prices').insert({
    crop_id: '00000000-0000-0000-0000-000000000001',
    price_sdg: 999999,
    price_date: '2026-09-04',
  })
  record('Anonymous CANNOT insert or manipulate crop prices', 'ANONYMOUS', !!priceErr, priceErr?.message)

  // 5. Anon CANNOT read waitlist entries
  const { data: waitData } = await anonClient.from('waitlist').select('*')
  record('Anonymous CANNOT read waitlist entries', 'ANONYMOUS', (waitData?.length === 0), `Rows visible: ${waitData?.length ?? 0}`)

  // --- PART 2: CONTROLLED TEMPORARY PERSONA TESTS ---
  console.log('\n--- PART 2: CONTROLLED TEMPORARY PERSONA TESTS ---')

  // Create temporary test identities in auth.users via admin API
  const tempUsers = [
    { key: 'admin', email: 'sam+prod_temp_admin@nexorayyc.io', pass: 'TempPass123!@#', role: 'admin' },
    { key: 'farmerA', email: 'sam+prod_temp_farmer_a@nexorayyc.io', pass: 'TempPass123!@#', role: 'farmer' },
    { key: 'farmerB', email: 'sam+prod_temp_farmer_b@nexorayyc.io', pass: 'TempPass123!@#', role: 'farmer' },
    { key: 'traderA', email: 'sam+prod_temp_trader_a@nexorayyc.io', pass: 'TempPass123!@#', role: 'trader' },
    { key: 'traderB', email: 'sam+prod_temp_trader_b@nexorayyc.io', pass: 'TempPass123!@#', role: 'trader' },
  ]

  const userIds: Record<string, string> = {}
  const clients: Record<string, any> = {}

  for (const u of tempUsers) {
    const { data: authData, error: authErr } = await serviceClient.auth.admin.createUser({
      email: u.email,
      password: u.pass,
      email_confirm: true,
    })
    if (authErr || !authData.user) {
      throw new Error(`Failed to create temp user ${u.email}: ${authErr?.message}`)
    }
    const uid = authData.user.id
    userIds[u.key] = uid

    // Insert profile with serviceClient
    await serviceClient.from('profiles').insert({
      id: uid,
      role: u.role,
      full_name: `Temp ${u.key}`,
      full_name_ar: `مؤقت ${u.key}`,
      email: u.email,
      phone: `+2499${Math.floor(10000000 + Math.random() * 90000000)}`,
      preferred_language: 'ar',
      is_verified: u.role === 'admin',
    })

    if (u.role === 'trader') {
      await serviceClient.from('trader_profiles').insert({
        id: uid,
        trader_type: 'wholesaler',
        business_name: `Temp Trader ${u.key}`,
        is_verified_trader: false,
      })
    }

    // Authenticate client
    const userClient = createClient(PROD_URL, PROD_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: signInData, error: signInErr } = await userClient.auth.signInWithPassword({
      email: u.email,
      password: u.pass,
    })
    if (signInErr || !signInData.session) {
      throw new Error(`Failed to sign in temp user ${u.email}: ${signInErr?.message}`)
    }
    clients[u.key] = userClient
  }

  // Adversarial Scenario 1: Farmer A cannot read Farmer B private profile
  const { data: faReadsFb } = await clients.farmerA.from('profiles').select('*').eq('id', userIds.farmerB)
  record('Farmer A CANNOT read Farmer B private profile', 'FARMER_A', (faReadsFb?.length === 0), `Rows visible: ${faReadsFb?.length ?? 0}`)

  // Adversarial Scenario 2: Farmer A CAN read own profile
  const { data: faOwn } = await clients.farmerA.from('profiles').select('*').eq('id', userIds.farmerA)
  record('Farmer A CAN read own profile', 'FARMER_A', (faOwn?.length === 1 && faOwn[0].id === userIds.farmerA), `Read: ${faOwn?.[0]?.full_name}`)

  // Adversarial Scenario 3: Trader A cannot promote self to admin
  const { error: escalateErr } = await clients.traderA.from('profiles').update({ role: 'admin' }).eq('id', userIds.traderA)
  record('Trader A CANNOT escalate role to admin (Trigger Block)', 'TRADER_A', !!escalateErr, escalateErr?.message)

  // Adversarial Scenario 4: Trader A cannot grant self verified status
  const { error: verifyErr } = await clients.traderA.from('trader_profiles').update({ is_verified_trader: true }).eq('id', userIds.traderA)
  record('Trader A CANNOT grant self verification (Trigger Block)', 'TRADER_A', !!verifyErr, verifyErr?.message)

  // Adversarial Scenario 5: Trader A creates farm? Blocked by constraint/trigger or RLS
  const { error: traderFarmErr } = await clients.traderA.from('farms').insert({
    farmer_id: userIds.traderA,
    name: 'Fake Trader Farm',
    area_feddan: 100,
    state_id: (await serviceClient.from('states').select('id').limit(1)).data![0].id,
    irrigation_type: 'rainfed'
  })
  // Farmer A creates farm
  const stateId = (await serviceClient.from('states').select('id').limit(1)).data![0].id
  const cropId = (await serviceClient.from('crops').select('id').limit(1)).data![0].id
  const { data: farmData } = await clients.farmerA.from('farms').insert({
    farmer_id: userIds.farmerA,
    name: 'Temp Farmer A Farm',
    area_feddan: 100,
    state_id: stateId,
    irrigation_type: 'rainfed'
  }).select().single()

  // Farmer A creates listing
  const { data: listingData } = await clients.farmerA.from('listings').insert({
    user_id: userIds.farmerA,
    crop_id: cropId,
    state_id: stateId,
    title_ar: 'محصول ذرة مؤقت',
    title_en: 'Temp Sorghum',
    quantity: 10,
    unit: 'ton',
    price: 100000,
    status: 'active'
  }).select().single()

  // Adversarial Scenario 6: Trader A cannot mutate farmer listing
  if (listingData) {
    const { error: mutErr } = await clients.traderA.from('listings').update({ price: 10 }).eq('id', listingData.id)
    const { data: checkListing } = await serviceClient.from('listings').select('price').eq('id', listingData.id).single()
    record('Trader A CANNOT mutate farmer listing price', 'TRADER_A', checkListing?.price === 100000, `Current Price: ${checkListing?.price}`)
  }

  // Adversarial Scenario 7: Trader A sends inquiry; Trader B CANNOT read it
  if (listingData) {
    const { data: inq } = await clients.traderA.from('inquiries').insert({
      listing_id: listingData.id,
      buyer_id: userIds.traderA,
      seller_id: userIds.farmerA,
      message: 'Secret buyer offer'
    }).select().single()

    if (inq) {
      const { data: tbInq } = await clients.traderB.from('inquiries').select('*').eq('id', inq.id)
      record('Trader B CANNOT read Trader A inquiry (B2B Commercial Isolation)', 'TRADER_B', (tbInq?.length === 0), `Rows visible: ${tbInq?.length ?? 0}`)
      
      const { data: faInq } = await clients.farmerA.from('inquiries').select('*').eq('id', inq.id)
      record('Farmer A (Recipient Seller) CAN read incoming inquiry', 'FARMER_A', (faInq?.length === 1), `Message: ${faInq?.[0]?.message}`)
    }
  }

  // Adversarial Scenario 8: Admin can insert official prices and view moderation
  const { data: admPrice, error: admPriceErr } = await clients.admin.from('crop_prices').insert({
    crop_id: cropId,
    price_sdg: 150000,
    price_date: '2026-09-04',
    created_by: userIds.admin,
  }).select().single()
  record('Admin CAN insert official crop prices', 'ADMIN', !admPriceErr && !!admPrice, admPriceErr?.message)

  // --- PART 3: MANDATORY CLEANUP OF ALL TEMPORARY TEST DATA ---
  console.log('\n--- PART 3: MANDATORY CLEANUP OF ALL TEMPORARY TEST DATA ---')

  // Clean inquiries
  await serviceClient.from('inquiries').delete().in('buyer_id', Object.values(userIds))
  // Clean listings
  await serviceClient.from('listings').delete().in('user_id', Object.values(userIds))
  // Clean crop prices
  await serviceClient.from('crop_prices').delete().in('created_by', Object.values(userIds))
  // Clean farms
  await serviceClient.from('farms').delete().in('farmer_id', Object.values(userIds))
  // Clean trader profiles
  await serviceClient.from('trader_profiles').delete().in('id', Object.values(userIds))
  // Clean profiles
  await serviceClient.from('profiles').delete().in('id', Object.values(userIds))
  // Delete auth users
  for (const uid of Object.values(userIds)) {
    await serviceClient.auth.admin.deleteUser(uid)
  }

  console.log('Temporary auth users and test rows deleted successfully.')

  // Final count check: All operational tables must be 0
  const tables = ['profiles', 'trader_profiles', 'farms', 'farm_crops', 'crop_prices', 'listings', 'listing_media', 'inquiries', 'moderation_events']
  let allZero = true
  for (const t of tables) {
    const { count } = await serviceClient.from(t).select('*', { count: 'exact', head: true })
    console.log(`   - Verified ${t}: ${count} rows`)
    if (count !== 0) allZero = false
  }

  record('MANDATORY CLEANUP: Zero fake business data remains in production', 'GOVERNANCE', allZero, 'All operational tables at 0 rows')

  console.log('\n====================================================================')
  const total = results.length
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  console.log(` PRODUCTION RLS VERIFICATION SUMMARY: ${total} tests executed`)
  console.log(` PASSED: ${passed} | FAILED: ${failed}`)
  console.log('====================================================================\n')

  if (failed > 0) process.exit(1)
}

runProdSecuritySuite().catch(err => {
  console.error('PROD RLS SUITE FAILED:', err)
  process.exit(1)
})
