import { createServerClient } from '@/lib/supabase/server'

export interface WaitlistRecord {
  id: string
  name: string
  email: string
  role: 'farmer' | 'trader' | 'ngo' | 'government' | 'investor'
  language: string
  created_at: string
}

export async function getWaitlistEntries(): Promise<WaitlistRecord[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch waitlist: ${error.message}`)
  }

  return (data ?? []) as WaitlistRecord[]
}
