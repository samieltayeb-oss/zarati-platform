import { shouldUseMockData } from '@/lib/services/gateway-config'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database.types'

export type State = Tables<'states'>
export type Market = Tables<'markets'>

export const fallbackStates: Partial<State>[] = [
  { id: '1', code: 'SD-KH', name_en: 'Khartoum', name_ar: 'الخرطوم', region: 'khartoum' },
  { id: '2', code: 'SD-GD', name_en: 'Gedaref', name_ar: 'القضارف', region: 'eastern' },
  { id: '3', code: 'SD-KS', name_en: 'Kassala', name_ar: 'كسلا', region: 'eastern' },
  { id: '4', code: 'SD-RS', name_en: 'Red Sea', name_ar: 'البحر الأحمر', region: 'eastern' },
  { id: '5', code: 'SD-GZ', name_en: 'Gezira', name_ar: 'الجزيرة', region: 'central' },
  { id: '6', code: 'SD-NK', name_en: 'North Kordofan', name_ar: 'شمال كردفان', region: 'kordofan' },
]

export async function getStates(): Promise<Partial<State>[]> {
  if (shouldUseMockData()) {
    return fallbackStates
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) return fallbackStates

    const { data, error } = await supabase
      .from('states')
      .select('*')
      .eq('is_active', true)
      .order('name_en', { ascending: true })

    if (error || !data || data.length === 0) return fallbackStates
    return data
  } catch {
    return fallbackStates
  }
}

export async function getMarkets(stateId?: string): Promise<Partial<Market>[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    let query = supabase
      .from('markets')
      .select('*')
      .eq('is_active', true)
      .order('name_en', { ascending: true })

    if (stateId) {
      query = query.eq('state_id', stateId)
    }

    const { data, error } = await query
    if (error || !data) return []
    return data
  } catch {
    return []
  }
}
