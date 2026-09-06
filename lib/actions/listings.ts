'use server'

import { createServerClient } from '@/lib/supabase/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { listingSchema, type ListingInput } from '@/lib/validations/marketplace'

type ActionResult = { success: true; listingId?: string } | { success: false; error: string }

function getRatelimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const redis = new Redis({ url, token })
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '24 h') })
}

export async function createListing(data: ListingInput): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.status !== 'active') return { success: false, error: 'Account suspended' }
  if (profile.role !== 'farmer') return { success: false, error: 'Only farmers can create listings' }

  const rl = getRatelimiter()
  if (rl) {
    const { success: allowed } = await rl.limit(`create-listing:${user.id}`)
    if (!allowed) return { success: false, error: 'Rate limit exceeded. Maximum 10 listings per day.' }
  }

  const parsed = listingSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues?.[0]?.message ?? 'Validation error' }
  }

  const payload = {
    ...parsed.data,
    user_id: user.id,
    status: 'draft',
    moderation_status: 'pending',
  }

  const { data: listing, error } = await supabase
    .from('listings')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(payload as any)
    .select('id')
    .single()

  if (error || !listing) {
    console.error('createListing error:', error)
    return { success: false, error: 'Failed to create listing' }
  }

  return { success: true, listingId: listing.id }
}

export async function updateListingStatus(
  listingId: string,
  newStatus: string,
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status, role')
    .eq('id', user.id)
    .single()
  if (!profile || profile.status !== 'active') return { success: false, error: 'Account suspended' }

  // Fetch listing to validate ownership and current state
  const { data: listing } = await supabase
    .from('listings')
    .select('status, user_id, moderation_status')
    .eq('id', listingId)
    .single()

  if (!listing) return { success: false, error: 'Listing not found' }
  if (listing.user_id !== user.id) return { success: false, error: 'Unauthorized' }

  // Validate transition
  const FARMER_TRANSITIONS: Record<string, string[]> = {
    draft: ['pending_review', 'archived'],
    active: ['paused', 'sold', 'archived'],
    paused: ['active', 'archived'],
  }

  const allowed = FARMER_TRANSITIONS[listing.status]
  if (!allowed || !allowed.includes(newStatus)) {
    return { success: false, error: `Invalid transition: ${listing.status} → ${newStatus}` }
  }

  const { error } = await supabase
    .from('listings')
    .update({ status: newStatus })
    .eq('id', listingId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: 'Failed to update listing status' }
  return { success: true, listingId }
}

export async function getMyListings() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('listings')
    .select('id, title_en, title_ar, status, moderation_status, price, unit, quantity, category, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data ?? []
}
