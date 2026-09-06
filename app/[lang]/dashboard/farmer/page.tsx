import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FarmerDashboardClient } from '@/components/dashboard/farmer-dashboard-client'

export default async function FarmerDashboard({ params }: { params: Promise<{ lang: string }> }) {
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
  if (profile.role !== 'farmer') redirect(`/${locale}/dashboard`)

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title_en, title_ar, status, moderation_status, price, unit, quantity, category, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: crops } = await supabase
    .from('crops')
    .select('id, name_en, name_ar, category')
    .order('name_en')

  const { data: states } = await supabase
    .from('states')
    .select('id, name_en, name_ar')
    .order('name_en')

  return (
    <FarmerDashboardClient
      locale={locale}
      profile={profile}
      listings={listings ?? []}
      crops={crops ?? []}
      states={states ?? []}
    />
  )
}
