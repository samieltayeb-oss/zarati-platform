import { getSupabaseClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database.types'

export type Farm = Tables<'farms'>
export type FarmCrop = Tables<'farm_crops'>

export async function getFarmsByFarmerId(farmerId: string): Promise<Farm[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false })

    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

export async function getFarmById(farmId: string): Promise<Farm | null> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('id', farmId)
      .maybeSingle()

    if (error || !data) return null
    return data
  } catch {
    return null
  }
}
