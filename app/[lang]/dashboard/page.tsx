import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Locale } from '@/lib/i18n/config'

export default async function DashboardIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as Locale
  
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role === 'farmer') {
    redirect(`/${locale}/dashboard/farmer`)
  } else if (profile?.role === 'trader') {
    redirect(`/${locale}/dashboard/trader`)
  }

  // Fallback
  redirect(`/${locale}`)
}
