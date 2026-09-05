import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default async function TraderDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as string

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)
  
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  
  if (!profile || profile.status !== 'active') redirect(`/${locale}/login?error=account_suspended`)
  if (profile.role !== 'trader') redirect(`/${locale}/dashboard`)
  const { data: traderProfile } = await supabase.from('trader_profiles').select('*').eq('id', user.id).single()

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {profile?.full_name}</h1>
        <form action={async () => {
          'use server'
          const s = await createServerClient();
          await s.auth.signOut();
          redirect(`/${locale}/login`)
        }}>
          <Button variant="outline" type="submit">Sign Out</Button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">Business Profile</h2>
          <div className="p-4 bg-muted/20 rounded-lg">
            <p className="font-medium">{traderProfile?.business_name}</p>
            <p className="text-sm text-muted capitalize">{traderProfile?.trader_type}</p>
          </div>
          <Button variant="outline" className="w-full">Edit Profile</Button>
        </div>

        <div className="bg-surface border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Market Inquiries</h2>
          <div className="text-center py-8 space-y-4">
            <p className="text-muted">You haven&apos;t made any inquiries yet.</p>
            <Button>Browse Marketplace</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
