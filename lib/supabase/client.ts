import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (clientInstance) return clientInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return null
  }

  clientInstance = createClient<Database>(url, key, {
    auth: { persistSession: false },
  })

  return clientInstance
}
