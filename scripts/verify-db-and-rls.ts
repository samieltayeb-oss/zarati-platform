/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const SUPABASE_URL = 'http://127.0.0.1:54341'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

// Fixed test user UUIDs matching 017_seed_mock_parity.sql
const USERS = {
  admin: { id: '00000000-0000-0000-0000-000000000001', email: 'sam@nexorayyc.io', pass: 'AdminPass123!' },
  farmerA: { id: '00000000-0000-0000-0000-000000000002', email: 'sam+farmer_ahmed@nexorayyc.io', pass: 'FarmerPass123!' },
  farmerB: { id: '00000000-0000-0000-0000-000000000003', email: 'sam+farmer_hassan@nexorayyc.io', pass: 'FarmerPass123!' },
  traderA: { id: '00000000-0000-0000-0000-000000000004', email: 'sam+trader_fatima@nexorayyc.io', pass: 'TraderPass123!' },
  traderB: { id: '00000000-0000-0000-0000-000000000005', email: 'sam+trader_omar@nexorayyc.io', pass: 'TraderPass123!' },
}

interface TestResult {
  suite: 'INTEGRITY' | 'RLS'
  testName: string
  actor: string
  expected: string
  actual: string
  status: 'PASS' | 'FAIL'
  details?: string
}

const results: TestResult[] = []

function record(suite: 'INTEGRITY' | 'RLS', testName: string, actor: string, expected: string, passed: boolean, details?: string) {
  results.push({
    suite,
    testName,
    actor,
    expected,
    actual: passed ? 'Matched Expectation' : 'Failed Expectation',
    status: passed ? 'PASS' : 'FAIL',
    details,
  })
  const mark = passed ? '✅ PASS' : '❌ FAIL'
  console.log(`${mark} [${suite}] [${actor}] ${testName}`)
  if (details) console.log(`   Details: ${details}`)
}

async function run() {
  console.log('====================================================================')
  console.log(' ZARATI R1-B: AUTOMATED DATABASE INTEGRITY & RLS ADVERSARIAL SUITE')
  console.log(' Target Local Supabase Instance: ' + SUPABASE_URL)
  console.log('====================================================================\n')

  // Service role client (Bypasses RLS - used for setup and DB constraint probes)
  const adminDb = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  
  // Anonymous client
  const anonClient = createClient<Database>(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } })

  // Authenticated user clients
  async function createAuthClient(email: string, pass: string) {
    const client = createClient<Database>(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } })
    const { data, error } = await client.auth.signInWithPassword({ email, password: pass })
    if (error) throw new Error(`Failed to sign in ${email}: ${error.message}`)
    return client
  }

  const farmerAClient = await createAuthClient(USERS.farmerA.email, USERS.farmerA.pass)
  const farmerBClient = await createAuthClient(USERS.farmerB.email, USERS.farmerB.pass)
  const traderAClient = await createAuthClient(USERS.traderA.email, USERS.traderA.pass)
  const traderBClient = await createAuthClient(USERS.traderB.email, USERS.traderB.pass)
  const adminClient = await createAuthClient(USERS.admin.email, USERS.admin.pass)

  console.log('All 5 test personas authenticated successfully.\n')

  // ==========================================================================
  // PART 1: DATABASE INTEGRITY TESTS
  // ==========================================================================
  console.log('--- PART 1: DATABASE INTEGRITY TESTS ---')

  // 1. Duplicate Unique Constraint (Crops code)
  {
    const { error } = await adminDb.from('crops').insert({
      code: 'sorghum', // Already exists
      name_en: 'Duplicate Sorghum',
      name_ar: 'ذرة مكررة',
      category: 'grain',
    })
    record('INTEGRITY', 'Reject duplicate unique crop code', 'SERVICE_ROLE', 'Error on duplicate unique', !!error && error.code === '23505', error?.message)
  }

  // 2. Invalid Foreign Key Rejection
  {
    const { error } = await adminDb.from('farms').insert({
      farmer_id: '99999999-9999-9999-9999-999999999999', // Non-existent profile
      name: 'Invalid Farm',
      state_id: (await adminDb.from('states').select('id').limit(1)).data![0].id,
      area_value: 100,
      area_unit: 'feddan',
    })
    record('INTEGRITY', 'Reject invalid foreign key (non-existent farmer_id)', 'SERVICE_ROLE', 'FK violation 23503', !!error && error.code === '23503', error?.message)
  }

  // 3. Invalid Role Rejection (CHECK constraint)
  {
    const { error } = await adminDb.from('profiles').insert({
      id: '00000000-0000-0000-0000-000000000099',
      full_name: 'Hacker',
      role: 'superman' as any,
    })
    record('INTEGRITY', 'Reject invalid role (CHECK constraint)', 'SERVICE_ROLE', 'Check violation 23514', !!error && error.code === '23514', error?.message)
  }

  // 4. Invalid Lifecycle Status Rejection
  {
    const { error } = await adminDb.from('listings').insert({
      user_id: USERS.farmerA.id,
      category: 'crops',
      title_en: 'Bad Listing',
      title_ar: 'إعلان خاطئ',
      price: 1000,
      unit: 'ton',
      quantity: 10,
      state_id: (await adminDb.from('states').select('id').limit(1)).data![0].id,
      status: 'destroyed_by_locusts' as any,
    })
    record('INTEGRITY', 'Reject invalid listing lifecycle status', 'SERVICE_ROLE', 'Check violation 23514', !!error && error.code === '23514', error?.message)
  }

  // 5. Invalid Negative Quantity / Negative Price Rejection
  {
    const { error } = await adminDb.from('listings').insert({
      user_id: USERS.farmerA.id,
      category: 'crops',
      title_en: 'Negative Price Listing',
      title_ar: 'سعر سالب',
      price: -500,
      unit: 'ton',
      quantity: -20,
      state_id: (await adminDb.from('states').select('id').limit(1)).data![0].id,
    })
    record('INTEGRITY', 'Reject negative price or quantity (CHECK price >= 0 and quantity > 0)', 'SERVICE_ROLE', 'Check violation 23514', !!error && error.code === '23514', error?.message)
  }

  // 6. Buyer != Seller Constraint on Inquiries
  {
    const { error } = await adminDb.from('inquiries').insert({
      listing_id: '20000000-0000-0000-0000-000000000001',
      buyer_id: USERS.farmerA.id,
      seller_id: USERS.farmerA.id, // Self inquiry
      message: 'Can I buy from myself?',
    })
    record('INTEGRITY', 'Reject inquiry where buyer == seller (chk_buyer_not_seller)', 'SERVICE_ROLE', 'Check violation 23514', !!error && error.code === '23514', error?.message)
  }

  // 7. Feddan-to-Hectare Auto-Calculation Engine (STORED generated column)
  {
    const { data: farm, error } = await adminDb
      .from('farms')
      .select('name, area_value, area_unit, area_hectares')
      .eq('id', '10000000-0000-0000-0000-000000000001')
      .single()

    // 500 feddans * 0.4200 = 210.00 hectares
    const passed = !error && farm?.area_value === 500 && farm?.area_hectares === 210
    record('INTEGRITY', 'Verify Feddan-to-Hectare auto-conversion accuracy (500 feddan = 210 ha)', 'DATABASE', 'area_hectares = 210.00', passed, `Value: ${farm?.area_value} ${farm?.area_unit} => ${farm?.area_hectares} ha`)
  }

  // 8. Timestamps & Auto-Update Trigger
  {
    const { data: before } = await adminDb.from('farms').select('updated_at').eq('id', '10000000-0000-0000-0000-000000000001').single()
    await new Promise((resolve) => setTimeout(resolve, 100))
    await adminDb.from('farms').update({ locality: 'Al-Fashaga Sector A' }).eq('id', '10000000-0000-0000-0000-000000000001')
    const { data: after } = await adminDb.from('farms').select('updated_at').eq('id', '10000000-0000-0000-0000-000000000001').single()
    const passed = !!before && !!after && new Date(after.updated_at).getTime() > new Date(before.updated_at).getTime()
    record('INTEGRITY', 'Automatic updated_at trigger execution on UPDATE', 'DATABASE', 'updated_at advances', passed, `Before: ${before?.updated_at} | After: ${after?.updated_at}`)
  }

  // 9. Relational Integrity: States, Markets, Crops
  {
    const { data: markets, error } = await adminDb.from('markets').select('name_en, states(name_en, region)')
    const passed = !error && (markets?.length ?? 0) >= 10 && markets!.every((m) => !!m.states)
    record('INTEGRITY', 'Foreign key join integrity between Markets and States', 'DATABASE', 'All markets resolve parent state', passed, `Verified ${markets?.length} markets joined`)
  }

  console.log('\n--- PART 2: RLS ADVERSARIAL TEST MATRIX ---')

  // ==========================================================================
  // PART 2: RLS ADVERSARIAL TESTS
  // ==========================================================================

  // Scenario 1: Farmer A cannot read Farmer B's private profile
  {
    const { data, error } = await farmerAClient.from('profiles').select('id, full_name, phone, email').eq('id', USERS.farmerB.id)
    const passed = !error && data?.length === 0
    record('RLS', 'Farmer A cannot read Farmer B private profile', 'FARMER_A', 'Zero rows returned', passed, `Rows visible: ${data?.length}`)
  }

  // Scenario 2: Farmer A CAN read their own profile
  {
    const { data, error } = await farmerAClient.from('profiles').select('id, full_name, phone, email').eq('id', USERS.farmerA.id)
    const passed = !error && data?.length === 1 && data[0].id === USERS.farmerA.id
    record('RLS', 'Farmer A CAN read own profile', 'FARMER_A', '1 row returned (own profile)', passed, `Visible name: ${data?.[0]?.full_name}`)
  }

  // Scenario 3: Farmer A cannot edit Farmer B's farm
  {
    const { error, count } = await farmerAClient
      .from('farms')
      .update({ name: 'Hacked by Farmer A' })
      .eq('id', '10000000-0000-0000-0000-000000000002') // Farmer B's farm
    // Under RLS, update on forbidden rows either returns 0 updated or permission denied
    const { data: verifyB } = await adminDb.from('farms').select('name').eq('id', '10000000-0000-0000-0000-000000000002').single()
    const passed = verifyB?.name !== 'Hacked by Farmer A'
    record('RLS', 'Farmer A cannot edit Farmer B farm', 'FARMER_A', 'Farm name unchanged', passed, `Current name: ${verifyB?.name}`)
  }

  // Scenario 4: Farmer A cannot edit Farmer B's listing
  {
    await farmerAClient
      .from('listings')
      .update({ price: 1 })
      .eq('id', '20000000-0000-0000-0000-000000000002') // Farmer B's listing
    const { data: verifyListing } = await adminDb.from('listings').select('price').eq('id', '20000000-0000-0000-0000-000000000002').single()
    const passed = verifyListing?.price === 320000 // Original price preserved
    record('RLS', 'Farmer A cannot edit Farmer B listing price', 'FARMER_A', 'Price unchanged (320,000 SDG)', passed, `Current price: ${verifyListing?.price}`)
  }

  // Scenario 5: Trader A cannot mutate farmer listings
  {
    await traderAClient
      .from('listings')
      .update({ status: 'sold' })
      .eq('id', '20000000-0000-0000-0000-000000000001') // Farmer A's listing
    const { data: verifyListing } = await adminDb.from('listings').select('status').eq('id', '20000000-0000-0000-0000-000000000001').single()
    const passed = verifyListing?.status === 'active'
    record('RLS', 'Trader A cannot mutate farmer listings', 'TRADER_A', 'Listing status remains active', passed, `Current status: ${verifyListing?.status}`)
  }

  // Scenario 6: Trader A cannot grant themselves verification or alter rating
  {
    const { error } = await traderAClient
      .from('trader_profiles')
      .update({ is_verified_trader: true, rating: 5.0, total_deals_completed: 9999 } as any)
      .eq('id', USERS.traderA.id)
    // Protected by check_trader_privileges_update trigger
    const passed = !!error && error.message.includes('Unauthorized')
    record('RLS', 'Trader A cannot grant self verification / fake rating', 'TRADER_A', 'Trigger exception thrown', passed, error?.message)
  }

  // Scenario 7: Trader A cannot escalate role to ADMIN
  {
    const { error } = await traderAClient
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', USERS.traderA.id)
    // Protected by check_profile_privileges_update trigger
    const passed = !!error && error.message.includes('Unauthorized')
    record('RLS', 'Trader A cannot change own role to ADMIN', 'TRADER_A', 'Trigger exception thrown', passed, error?.message)
  }

  // Scenario 8: Inquiries Strict Isolation (Trader A creates inquiry; Trader B cannot read it)
  {
    // Trader A submits inquiry to Farmer A's listing
    const { data: newInquiry, error: inqErr } = await traderAClient
      .from('inquiries')
      .insert({
        listing_id: '20000000-0000-0000-0000-000000000001',
        buyer_id: USERS.traderA.id,
        seller_id: USERS.farmerA.id,
        message: 'Trader A offering 80,000 SDG/ton for entire lot.',
        offered_price: 80000,
        requested_quantity: 50,
      })
      .select('id')
      .single()

    if (newInquiry) {
      // Trader B attempts to read Trader A's inquiry
      const { data: tBView } = await traderBClient.from('inquiries').select('*').eq('id', newInquiry.id)
      const passedTB = (tBView?.length ?? 0) === 0
      record('RLS', 'Trader B CANNOT view Trader A inquiry (B2B isolation)', 'TRADER_B', 'Zero rows visible', passedTB, `Rows visible: ${tBView?.length}`)

      // Farmer A (seller) CAN view it
      const { data: fAView } = await farmerAClient.from('inquiries').select('*').eq('id', newInquiry.id)
      const passedFA = (fAView?.length ?? 0) === 1
      record('RLS', 'Farmer A (recipient seller) CAN view the inquiry', 'FARMER_A', '1 row visible', passedFA, `Message: ${fAView?.[0]?.message}`)

      // Anonymous CANNOT view it
      const { data: anonView } = await anonClient.from('inquiries').select('*').eq('id', newInquiry.id)
      const passedAnon = (anonView?.length ?? 0) === 0
      record('RLS', 'Anonymous CANNOT view private inquiry', 'ANONYMOUS', 'Zero rows visible', passedAnon, `Rows visible: ${anonView?.length}`)
    }
  }

  // Scenario 9: Anonymous cannot read private phone/email on profiles
  {
    const { data, error } = await anonClient.from('profiles').select('id, full_name, phone, email')
    const passed = !error && (data?.length ?? 0) === 0
    record('RLS', 'Anonymous cannot query profiles directly (PII protection)', 'ANONYMOUS', 'Zero rows returned', passed, `Rows visible: ${data?.length}`)
  }

  // Scenario 10: Anonymous CAN query marketplace_seller_public view (safe public view)
  {
    const { data, error } = await anonClient.from('marketplace_seller_public').select('*')
    const passed = !error && (data?.length ?? 0) > 0 && !('phone' in (data?.[0] || {})) && !('email' in (data?.[0] || {}))
    record('RLS', 'Anonymous CAN view marketplace_seller_public without PII', 'ANONYMOUS', 'Seller info visible without phone/email', passed, `Count: ${data?.length}`)
  }

  // Scenario 11: Public CAN read active listings, active crops, active states/markets, official prices
  {
    const [listingsRes, cropsRes, statesRes, marketsRes, pricesRes] = await Promise.all([
      anonClient.from('listings').select('id, title_en, status').eq('status', 'active'),
      anonClient.from('crops').select('id, name_en'),
      anonClient.from('states').select('id, name_en'),
      anonClient.from('markets').select('id, name_en'),
      anonClient.from('crop_prices').select('id, price_sdg'),
    ])

    const passed = (listingsRes.data?.length ?? 0) === 8 &&
                   (cropsRes.data?.length ?? 0) === 8 &&
                   (statesRes.data?.length ?? 0) === 18 &&
                   (marketsRes.data?.length ?? 0) === 10 &&
                   (pricesRes.data?.length ?? 0) >= 8

    record('RLS', 'Public CAN read active listings, crops, states, markets, prices', 'ANONYMOUS', 'Full public catalog accessible', passed,
      `Listings: ${listingsRes.data?.length} | Crops: ${cropsRes.data?.length} | States: ${statesRes.data?.length} | Markets: ${marketsRes.data?.length} | Prices: ${pricesRes.data?.length}`)
  }

  // Scenario 12: Anonymous CANNOT insert crop prices (Anti-tampering)
  {
    const { error } = await anonClient.from('crop_prices').insert({
      crop_id: (await adminDb.from('crops').select('id').limit(1)).data![0].id,
      price_sdg: 10,
      currency: 'SDG',
      unit: 'ton',
      price_date: '2026-09-04',
    })
    const passed = !!error
    record('RLS', 'Anonymous CANNOT insert or manipulate crop prices', 'ANONYMOUS', 'RLS policy violation', passed, error?.message)
  }

  // Scenario 13: Admin CAN insert official crop prices and perform moderation
  {
    const cropId = (await adminDb.from('crops').select('id').eq('code', 'wheat').single()).data!.id
    const marketId = (await adminDb.from('markets').select('id').eq('code', 'MKT-KH-01').single()).data!.id
    
    const { data: newPrice, error: priceErr } = await adminClient.from('crop_prices').insert({
      crop_id: cropId,
      market_id: marketId,
      price_sdg: 89500,
      currency: 'SDG',
      unit: 'ton',
      price_date: '2026-09-05',
      source: 'admin_override',
      is_official: true,
      created_by: USERS.admin.id,
    }).select().single()

    const passed = !priceErr && !!newPrice
    record('RLS', 'Admin CAN insert official crop prices', 'ADMIN', 'Record inserted successfully', passed, `Inserted price ID: ${newPrice?.id}`)
  }

  // Scenario 14: Admin CAN record moderation events
  {
    const { data: modEvent, error: modErr } = await adminClient.from('moderation_events').insert({
      entity_type: 'listing',
      entity_id: '20000000-0000-0000-0000-000000000001',
      action: 'approved',
      reason: 'Physical harvest verified by regional inspector in Gedaref',
      moderator_id: USERS.admin.id,
    }).select().single()

    const passed = !modErr && !!modEvent
    record('RLS', 'Admin CAN insert moderation event audits', 'ADMIN', 'Audit log inserted', passed, `Event ID: ${modEvent?.id}`)
  }

  // Scenario 15: Public Waitlist Insert and Admin Read
  {
    // Anonymous inserts waitlist entry
    const testEmail = `sam+waitlist_${Date.now()}@nexorayyc.io`
    const { error: insertErr } = await anonClient.from('waitlist').insert({
      name: 'Dr. Omer Idris',
      email: testEmail,
      role: 'investor',
      language: 'ar',
    })
    const insertPassed = !insertErr
    record('RLS', 'Anonymous CAN submit waitlist registration', 'ANONYMOUS', 'Insert succeeded', insertPassed, insertErr?.message)

    // Anonymous CANNOT read waitlist
    const { data: anonRead } = await anonClient.from('waitlist').select('*')
    const anonBlockPassed = (anonRead?.length ?? 0) === 0
    record('RLS', 'Anonymous CANNOT read waitlist entries', 'ANONYMOUS', 'Zero rows visible', anonBlockPassed, `Rows visible: ${anonRead?.length}`)

    // Admin CAN read waitlist
    const { data: adminRead, error: adminReadErr } = await adminClient.from('waitlist').select('*').eq('email', testEmail)
    const adminReadPassed = !adminReadErr && (adminRead?.length ?? 0) === 1
    record('RLS', 'Admin CAN read waitlist entries', 'ADMIN', 'Entry retrieved', adminReadPassed, `Found: ${adminRead?.[0]?.name}`)
  }

  console.log('\n====================================================================')
  console.log(` VERIFICATION SUMMARY: ${results.length} total tests executed`)
  const passedCount = results.filter((r) => r.status === 'PASS').length
  const failedCount = results.filter((r) => r.status === 'FAIL').length
  console.log(` PASSED: ${passedCount} | FAILED: ${failedCount}`)
  console.log('====================================================================\n')

  return results
}

run()
  .then((res) => {
    const failed = res.filter((r) => r.status === 'FAIL')
    if (failed.length > 0) {
      process.exit(1)
    }
  })
  .catch((err) => {
    console.error('Fatal test error:', err)
    process.exit(1)
  })
