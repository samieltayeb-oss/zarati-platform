import { getSupabaseClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database.types'

export type Profile = Tables<'profiles'>
export type TraderProfile = Tables<'trader_profiles'>
export type PublicSeller = Tables<'marketplace_seller_public'>

export async function getProfileById(userId: string): Promise<Profile | null> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

export async function getTraderProfileById(userId: string): Promise<TraderProfile | null> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from('trader_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

export async function getPublicSellerById(sellerId: string): Promise<PublicSeller | null> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from('marketplace_seller_public')
      .select('*')
      .eq('id', sellerId)
      .maybeSingle()

    if (error || !data) return null
    return data
  } catch {
    return null
  }
}
