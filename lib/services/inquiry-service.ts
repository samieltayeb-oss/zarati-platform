import { getSupabaseClient } from '@/lib/supabase/client'
import type { Tables, TablesInsert } from '@/types/database.types'

export type Inquiry = Tables<'inquiries'>
export type InquiryInsert = TablesInsert<'inquiries'>

export async function getInquiriesForUser(userId: string): Promise<Inquiry[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

export async function createInquiry(payload: InquiryInsert): Promise<Inquiry | null> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from('inquiries')
      .insert(payload)
      .select()
      .single()

    if (error || !data) {
      console.error('Error creating inquiry:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to create inquiry:', err)
    return null
  }
}
