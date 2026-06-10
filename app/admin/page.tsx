import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { getWaitlistEntries } from '@/lib/supabase/admin'
import type { WaitlistRecord } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  let entries: WaitlistRecord[] = []
  let error: string | null = null

  try {
    entries = await getWaitlistEntries()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load waitlist data.'
  }

  return <AdminDashboard entries={entries} error={error} />
}
