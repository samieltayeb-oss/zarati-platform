'use server'

import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const rfqSchema = z.object({
  listing_id: z.string().uuid(),
  // seller_id intentionally NOT accepted from client — resolved server-side from listing record
  message: z.string().max(1000).optional().nullable(),
  requested_quantity: z.coerce.number().positive().optional().nullable(),
  offered_price: z.coerce.number().positive().optional().nullable(),
})

type RFQInput = z.infer<typeof rfqSchema>
type ActionResult = { success: true; inquiryId: string } | { success: false; error: string }
type ContactResult =
  | { success: true; role: string; phone: string | null; email: string; full_name: string }
  | { success: false; error: string }

function getRatelimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL: Upstash Redis is not configured in production. Rate limiting failing closed.');
    }
    return null
  }
  const redis = new Redis({ url, token })
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 per minute
  })
}

export async function submitRFQ(data: RFQInput): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status, role')
    .eq('id', user.id)
    .single()
  if (!profile || profile.status !== 'active') return { success: false, error: 'Account suspended' }
  if (profile.role !== 'trader') return { success: false, error: 'Only traders can submit RFQs' }

  const rl = getRatelimiter()
  if (rl) {
    const { success: allowed } = await rl.limit(`submit-rfq:${user.id}`)
    if (!allowed) return { success: false, error: 'Rate limit exceeded. Maximum 5 RFQs per minute.' }
  }

  const parsed = rfqSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues?.[0]?.message ?? 'Validation error' }
  }

  // Resolve seller_id server-side from the listing — bypass RLS since Trader cannot read listing
  const { createAdminClient } = await import('@/lib/supabase/server')
  const adminClient = createAdminClient()
  
  const { data: listing } = await adminClient
    .from('listings')
    .select('user_id, status')
    .eq('id', parsed.data.listing_id)
    .single()

  if (!listing) return { success: false, error: 'Listing not found' }
  if (!['active'].includes(listing.status)) return { success: false, error: 'Listing is not available' }
  if (listing.user_id === user.id) return { success: false, error: 'Cannot submit RFQ to your own listing' }

  const { data: inquiry, error } = await supabase
    .from('inquiries')
    .insert({
      listing_id: parsed.data.listing_id,
      buyer_id: user.id,
      seller_id: listing.user_id, // server-side resolved
      message: parsed.data.message ?? '',
      requested_quantity: parsed.data.requested_quantity,
      offered_price: parsed.data.offered_price,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'You already have an active RFQ for this listing' }
    }
    console.error('submitRFQ error:', error)
    return { success: false, error: 'Failed to submit inquiry' }
  }

  return { success: true, inquiryId: inquiry.id }
}

export async function updateRFQStatus(
  inquiryId: string,
  newStatus: string,
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single()
  if (!profile || profile.status !== 'active') return { success: false, error: 'Account suspended' }

  const { data: inquiry } = await supabase
    .from('inquiries')
    .select('status, buyer_id, seller_id')
    .eq('id', inquiryId)
    .single()

  if (!inquiry) return { success: false, error: 'Inquiry not found' }

  const isBuyer = inquiry.buyer_id === user.id
  const isSeller = inquiry.seller_id === user.id
  if (!isBuyer && !isSeller) return { success: false, error: 'Unauthorized' }

  // Validate transitions per role
  const BUYER_TRANSITIONS: Record<string, string[]> = {
    pending: ['withdrawn'],
    accepted: ['closed'],
  }
  const SELLER_TRANSITIONS: Record<string, string[]> = {
    pending: ['accepted', 'rejected'],
    accepted: ['closed'],
  }

  const allowed = isBuyer ? BUYER_TRANSITIONS[inquiry.status] : SELLER_TRANSITIONS[inquiry.status]
  if (!allowed || !allowed.includes(newStatus)) {
    return { success: false, error: `Invalid transition: ${inquiry.status} → ${newStatus}` }
  }

  const { error } = await supabase
    .from('inquiries')
    .update({ status: newStatus })
    .eq('id', inquiryId)

  if (error) return { success: false, error: 'Failed to update inquiry status' }
  return { success: true, inquiryId }
}

export async function getRFQContactDetails(inquiryId: string): Promise<ContactResult> {
  const supabase = await createServerClient()

  const { data, error } = await supabase.rpc('get_rfq_contact_details', {
    p_inquiry_id: inquiryId,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  const contact = Array.isArray(data) ? data[0] : data
  if (!contact) return { success: false, error: 'No contact data returned' }

  return {
    success: true,
    role: contact.role,
    phone: contact.phone,
    email: contact.email,
    full_name: contact.full_name,
  }
}

export async function getMyRFQs() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('inquiries')
    .select('id, listing_id, buyer_id, seller_id, status, message, created_at')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  return data ?? []
}
