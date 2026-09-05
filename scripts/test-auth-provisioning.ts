import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'

// For local testing, we need the actual local keys.
// I will fetch from supabase status if needed, but we can just use process.env if set.
// Actually, let's load api-keys.json if we are in local.
import fs from 'fs'
import path from 'path'

let url = SUPABASE_URL
let anon = ANON_KEY
let service = SERVICE_ROLE_KEY

try {
  const scratchDir = 'C:\\Users\\mcreg\\.gemini\\antigravity\\brain\\c8c29ef2-6ae9-4fef-8633-779f017fa972\\scratch'
  if (fs.existsSync(path.join(scratchDir, 'api-keys.json'))) {
    const keys = JSON.parse(fs.readFileSync(path.join(scratchDir, 'api-keys.json'), 'utf8'))
    if (keys.supabaseUrl) url = keys.supabaseUrl
    if (keys.anonKey) anon = keys.anonKey
    if (keys.serviceRoleKey) service = keys.serviceRoleKey
  }
} catch(e) {}

// Wait, local supabase status showed: http://127.0.0.1:54341
url = 'http://127.0.0.1:54341'
anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
service = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const adminClient = createClient(url, service, { auth: { persistSession: false } })

async function runTests() {
  console.log('--- RUNNING DB PROVISIONING TESTS ---')

  // 1. Attempt admin signup
  console.log('\nTEST 1: Malicious Admin Signup')
  const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
    email: 'admin_hack@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'admin', full_name: 'Hacker' }
  })
  
  if (adminError) {
    console.log('✅ Passed! Admin signup failed:', adminError.message)
  } else {
    console.error('❌ Failed! Admin signup succeeded. This should have been rejected.')
    process.exit(1)
  }

  // 2. Normal Farmer Signup
  console.log('\nTEST 2: Normal Farmer Signup')
  const { data: farmerData, error: farmerError } = await adminClient.auth.admin.createUser({
    email: 'farmer_real@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'farmer', full_name: 'Real Farmer' }
  })

  if (farmerError) {
    console.error('❌ Failed! Farmer signup rejected:', farmerError.message)
    process.exit(1)
  }

  console.log('✅ Farmer signup succeeded.')
  
  // Verify profile
  const { data: profile } = await adminClient.from('profiles').select('*').eq('id', farmerData.user.id).single()
  if (profile && profile.role === 'farmer') {
    console.log('✅ Profile successfully provisioned.')
  } else {
    console.error('❌ Failed! Profile not provisioned.')
    process.exit(1)
  }

  // 3. Normal Trader Signup
  console.log('\nTEST 3: Normal Trader Signup')
  const { data: traderData, error: traderError } = await adminClient.auth.admin.createUser({
    email: 'trader_real@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'trader', full_name: 'Real Trader', business_name: 'Zarati Trading' }
  })

  if (traderError) {
    console.error('❌ Failed! Trader signup rejected:', traderError.message)
    process.exit(1)
  }

  console.log('✅ Trader signup succeeded.')
  
  const { data: tp } = await adminClient.from('trader_profiles').select('*').eq('id', traderData.user.id).single()
  if (tp && tp.business_name === 'Zarati Trading') {
    console.log('✅ Trader profile successfully provisioned.')
  } else {
    console.error('❌ Failed! Trader profile not provisioned.')
    process.exit(1)
  }

  // 4. Test self-modification protection
  console.log('\nTEST 4: Protection of privileged fields')
  // We need to use the user client to test RLS
  const userClient = createClient(url, anon, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${farmerData.user.id}` /* actually need JWT, wait let's use signInWithPassword */ } }
  })
  
  const { data: sessionData } = await userClient.auth.signInWithPassword({
    email: 'farmer_real@example.com',
    password: 'password123'
  })

  const { error: updateError } = await userClient.from('profiles').update({ role: 'admin' }).eq('id', farmerData.user.id)
  if (updateError) {
    console.log('✅ Passed! Self-modification of role failed:', updateError.message)
  } else {
    console.error('❌ Failed! Self-modification succeeded.')
    process.exit(1)
  }

  console.log('\nAll tests passed successfully!')
}

runTests().catch(console.error)
