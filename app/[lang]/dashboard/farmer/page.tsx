import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default async function FarmerDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as string

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)
  
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  
  if (!profile || profile.status !== 'active') redirect(`/${locale}/login?error=account_suspended`)
  if (profile.role !== 'farmer') redirect(`/${locale}/dashboard`)
  const { data: farms } = await supabase.from('farms').select('*').eq('farmer_id', user.id)

  const hasFarms = farms && farms.length > 0

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
        <div className="bg-surface border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Farms</h2>
          {!hasFarms ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted">You haven&apos;t added any farms yet.</p>
              <Button>Add Your First Farm</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {farms.map((farm: { id: string, area_value: number, irrigation_type: string }) => (
                <div key={farm.id} className="p-4 border rounded-lg">
                  <p className="font-medium">{farm.area_value} Feddans</p>
                  <p className="text-sm text-muted">Irrigation: {farm.irrigation_type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
          <div className="text-center py-8 space-y-4">
            <p className="text-muted">No active listings.</p>
            <Button variant="outline" disabled>Create Listing (Coming Soon)</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
