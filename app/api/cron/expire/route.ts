import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const PENDING_TTL_DAYS = 7

export async function GET(request: Request) {
  // Protect cron endpoint with secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - PENDING_TTL_DAYS)

    // Expire stale pending RFQs
    const { data: expiredRFQs, error: rfqError } = await supabase
      .from('inquiries')
      .update({ status: 'expired' })
      .eq('status', 'pending')
      .lt('created_at', cutoff.toISOString())
      .select('id')

    if (rfqError) throw rfqError

    // Expire listings past their expires_at date
    const { data: expiredListings, error: listingError } = await supabase
      .from('listings')
      .update({ status: 'expired' })
      .in('status', ['active', 'paused'])
      .lt('expires_at', new Date().toISOString())
      .select('id')

    if (listingError) throw listingError

    console.log(`Cron: expired ${expiredRFQs?.length ?? 0} RFQs, ${expiredListings?.length ?? 0} listings`)

    return NextResponse.json({
      ok: true,
      expiredRFQs: expiredRFQs?.length ?? 0,
      expiredListings: expiredListings?.length ?? 0,
      cutoff: cutoff.toISOString(),
    })
  } catch (error) {
    console.error('Expiration cron error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
