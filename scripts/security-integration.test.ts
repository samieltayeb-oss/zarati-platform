import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://127.0.0.1:54341'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })

async function runTests() {
  console.log('--- RUNNING SECURITY TESTS ---')
  let passed = 0
  let failed = 0

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log('✅ ' + message)
      passed++
    } else {
      console.error('❌ FAILED: ' + message)
      failed++
    }
  }

  // 1. Roles
  const rolesToReject = ['admin', 'ngo', 'government', 'invalid_role']
  for (const role of rolesToReject) {
    const { error } = await adminClient.auth.admin.createUser({
      email: `test_${role}@example.com`,
      password: 'password123',
      user_metadata: { role, full_name: 'Test' }
    })
    assert(error !== null, `Signup with role ${role} should be rejected`)
  }

  // 2. Valid farmer signup
  const farmerEmail = `farmer_${Date.now()}@example.com`
  const { data: fData, error: fErr } = await adminClient.auth.admin.createUser({
    email: farmerEmail,
    password: 'password123',
    user_metadata: { role: 'farmer', full_name: 'Test Farmer' },
    email_confirm: true
  })
  assert(!fErr, 'Valid farmer signup should succeed')
  const farmerId = fData?.user?.id

  // 3. Valid trader signup
  const traderEmail = `trader_${Date.now()}@example.com`
  const { data: tData, error: tErr } = await adminClient.auth.admin.createUser({
    email: traderEmail,
    password: 'password123',
    user_metadata: { role: 'trader', full_name: 'Test Trader', business_name: 'TradeCo' },
    email_confirm: true
  })
  assert(!tErr, 'Valid trader signup should succeed')
  const traderId = tData?.user?.id

  // 4. Provisioning atomicity / verification
  const { data: pFarmer } = await adminClient.from('profiles').select('*').eq('id', farmerId).single()
  assert(pFarmer && pFarmer.role === 'farmer', 'Farmer profile provisioned correctly')

  const { data: pTrader } = await adminClient.from('profiles').select('*').eq('id', traderId).single()
  const { data: ptTrader } = await adminClient.from('trader_profiles').select('*').eq('id', traderId).single()
  assert(pTrader && pTrader.role === 'trader' && ptTrader && ptTrader.business_name === 'TradeCo', 'Trader profile provisioned correctly')

  // 5. Self-modification protection (RLS triggers)
  const farmerClient = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } })
  await farmerClient.auth.signInWithPassword({ email: farmerEmail, password: 'password123' })
  
  const { error: roleErr } = await farmerClient.from('profiles').update({ role: 'admin' }).eq('id', farmerId)
  assert(roleErr !== null, 'Farmer cannot self-promote role')

  const { error: verErr } = await farmerClient.from('profiles').update({ is_verified: true }).eq('id', farmerId)
  assert(verErr !== null, 'User cannot self-modify is_verified')

  const { error: statusErr } = await farmerClient.from('profiles').update({ status: 'banned' }).eq('id', farmerId)
  assert(statusErr !== null, 'User cannot self-modify status')

  const { data: stateData } = await adminClient.from('states').select('id').limit(1).single()
  const stateId = stateData?.id

  // 6. Cross-user farm isolation
  const { error: insertFarmErr } = await farmerClient.from('farms').insert({
    farmer_id: traderId,
    name: 'Test Farm',
    area_value: 10,
    state_id: stateId
  })
  assert(insertFarmErr !== null, 'Farmer cannot create farm for another user')

  const { error: insertSelfFarmErr } = await farmerClient.from('farms').insert({
    farmer_id: farmerId,
    name: 'My Real Farm',
    area_value: 10,
    state_id: stateId
  })
  if (insertSelfFarmErr) console.error(insertSelfFarmErr)
  assert(insertSelfFarmErr === null, 'Farmer can create own farm')

  // 7. Suspended active-session denial
  // Set farmer to suspended via admin
  await adminClient.from('profiles').update({ status: 'suspended' }).eq('id', farmerId)
  
  // Try to insert another farm with the active session
  const { error: insertSuspendedErr } = await farmerClient.from('farms').insert({
    farmer_id: farmerId,
    name: 'Suspended Farm',
    area_value: 20,
    state_id: stateId
  })
  assert(insertSuspendedErr !== null, 'Suspended user cannot insert farm')

  // 8. Restore active and verify access
  await adminClient.from('profiles').update({ status: 'active' }).eq('id', farmerId)
  const { error: insertRestoredErr } = await farmerClient.from('farms').insert({
    farmer_id: farmerId,
    name: 'Restored Farm',
    area_value: 20,
    state_id: stateId
  })
  if (insertRestoredErr) console.error(insertRestoredErr)
  assert(insertRestoredErr === null, 'Restored active user can insert farm')

  console.log(`\n--- RESULTS: ${passed} passed, ${failed} failed ---`)
  process.exit(failed > 0 ? 1 : 0)
}

runTests().catch(console.error)
