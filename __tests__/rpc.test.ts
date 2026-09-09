import { guardTestEnvironment } from './local-target'
guardTestEnvironment()
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54341'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

describe('RFQ RPC Privacy Matrix', () => {
  let createdUsers: any[] = []
  let farmer: any, traderA: any, traderB: any
  let listingId: string
  let rfqId: string
  
  const clients: Record<string, any> = {}

  beforeAll(async () => {
    // Setup users
    const users = [
      { email: 'rpc_farmer@test.com', role: 'farmer', status: 'active', name: 'Farm' },
      { email: 'rpc_trader_a@test.com', role: 'trader', status: 'active', name: 'Trader A' },
      { email: 'rpc_trader_b@test.com', role: 'trader', status: 'active', name: 'Trader B' },
      { email: 'rpc_susp@test.com', role: 'trader', status: 'suspended', name: 'Suspended' },
      { email: 'rpc_ban@test.com', role: 'trader', status: 'banned', name: 'Banned' }
    ]

    for (const u of users) {
      const { data: ext } = await adminClient.auth.admin.listUsers()
      const found = ext.users.find(x => x.email === u.email)
      if (found) await adminClient.auth.admin.deleteUser(found.id)

      const { data: authData } = await adminClient.auth.admin.createUser({
        email: u.email, password: 'StrongPassword123!', email_confirm: true, user_metadata: { role: u.role }
      })
      await adminClient.from('profiles').update({ status: u.status, role: u.role }).eq('id', authData.user!.id)
      createdUsers.push({ ...u, id: authData.user!.id })

      const c = createClient(SUPABASE_URL, ANON_KEY, { auth: { autoRefreshToken: false, persistSession: false } })
      await c.auth.signInWithPassword({ email: u.email, password: 'StrongPassword123!' })
      clients[u.email] = c
    }

    farmer = createdUsers[0]
    traderA = createdUsers[1]
    traderB = createdUsers[2]

    // Create listing
    const { data: state } = await adminClient.from('states').select('id').limit(1).single()
    const { data: listing } = await adminClient.from('listings').insert({
      user_id: farmer.id, state_id: state?.id, category: 'crops', title_en: 'T', title_ar: 'T', quantity: 1, unit: 'T', currency: 'SDG', status: 'active', moderation_status: 'approved'
    }).select().single()
    listingId = listing.id

    // Create RFQ
    const { data: rfq } = await adminClient.from('inquiries').insert({
      listing_id: listing.id, buyer_id: traderA.id, seller_id: farmer.id, requested_quantity: 1, message: 'm', status: 'pending'
    }).select().single()
    rfqId = rfq.id
  })

  afterAll(async () => {
    for (const u of createdUsers) await adminClient.auth.admin.deleteUser(u.id)
  })

  it('Denies buyer self-accept, listing self-moderation, ownership and profile verification escalation', async () => {
    expect((await clients[traderA.email].from('inquiries').update({status:'accepted'}).eq('id',rfqId)).error).not.toBeNull();
    expect((await clients[farmer.email].from('listings').update({moderation_status:'rejected'}).eq('id',listingId)).error).not.toBeNull();
    expect((await clients[farmer.email].from('listings').update({user_id:traderA.id}).eq('id',listingId)).error).not.toBeNull();
    expect((await clients[farmer.email].from('profiles').update({is_verified:true}).eq('id',farmer.id)).error).not.toBeNull();
    expect((await clients[farmer.email].from('profiles').update({role:'admin'}).eq('id',farmer.id)).error).not.toBeNull();
  })

  it('Denies privileged initial RFQ and listing states through direct authenticated inserts', async () => {
    const inserted=await clients[traderB.email].from('inquiries').insert({listing_id:listingId,buyer_id:traderB.id,seller_id:farmer.id,status:'accepted',message:'test'});
    expect(inserted.error?.message).toContain('Initial inquiry state');
  })
  it('Denies direct self-approved listing creation', async()=>{
    const {data:state}=await adminClient.from('states').select('id').limit(1).single();
    const listing=await clients[farmer.email].from('listings').insert({user_id:farmer.id,state_id:state!.id,category:'crops',title_en:'T',title_ar:'T',quantity:1,unit:'T',currency:'SDG',status:'active',moderation_status:'approved'});
    expect(listing.error?.message).toContain('Initial listing state');
  })

  it('Denies pending RFQ reveal', async () => {
    const { error: errA } = await clients[traderA.email].rpc('get_rfq_contact_details', { p_inquiry_id: rfqId })
    expect(errA?.message).toContain('only available for accepted')

    const { error: errF } = await clients[farmer.email].rpc('get_rfq_contact_details', { p_inquiry_id: rfqId })
    expect(errF?.message).toContain('only available for accepted')
  })

  it('Denies unrelated user', async () => {
    // accept it first for these tests
    await adminClient.from('inquiries').update({ status: 'accepted' }).eq('id', rfqId)
    const { error } = await clients[traderB.email].rpc('get_rfq_contact_details', { p_inquiry_id: rfqId })
    expect(error?.message).toContain('Unauthorized')
  })

  it('Denies anonymous user', async () => {
    const anonClient = createClient(SUPABASE_URL, ANON_KEY)
    const { error } = await anonClient.rpc('get_rfq_contact_details', { p_inquiry_id: rfqId })
    expect(error).toBeDefined()
    expect(error?.message).toContain('Unauthorized')
  })

  it('Denies suspended and banned users', async () => {
    const { error: err1 } = await clients['rpc_susp@test.com'].rpc('get_rfq_contact_details', { p_inquiry_id: rfqId })
    expect(err1?.message).toContain('suspended or banned')

    const { error: err2 } = await clients['rpc_ban@test.com'].rpc('get_rfq_contact_details', { p_inquiry_id: rfqId })
    expect(err2?.message).toContain('suspended or banned')
  })

  it('Allows Trader A to see Farmer A', async () => {
    const { data, error } = await clients[traderA.email].rpc('get_rfq_contact_details', { p_inquiry_id: rfqId })
    expect(error).toBeNull()
    expect(data[0].role).toBe('seller')
  })

  it('Allows Farmer A to see Trader A', async () => {
    const { data, error } = await clients[farmer.email].rpc('get_rfq_contact_details', { p_inquiry_id: rfqId })
    expect(error).toBeNull()
    expect(data[0].role).toBe('buyer')
  })
})
