import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TraderDashboardClient } from '@/components/dashboard/trader-dashboard-client'

export default async function TraderDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as string

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.status !== 'active') redirect(`/${locale}/login?error=account_suspended`)
  if (profile.role !== 'trader') redirect(`/${locale}/dashboard`)

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select(`
      id, listing_id, buyer_id, seller_id, status, message, created_at, requested_quantity,
      listings ( title_en, title_ar ),
      buyer:profiles!buyer_id ( full_name, full_name_ar ),
      seller:profiles!seller_id ( full_name, full_name_ar )
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  return (
    <TraderDashboardClient
      locale={locale}
      profile={profile}
      inquiries={inquiries ?? []}
    />
  )
}
