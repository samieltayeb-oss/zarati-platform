import type { Listing, ListingCategory } from '@/types'

import { shouldUseMockData } from '@/lib/services/gateway-config'
import { getSupabaseClient } from '@/lib/supabase/client'
import { mapDbListingToModel, type DbListingWithRelations } from '@/lib/services/mappers'

export async function getListings(category?: ListingCategory | 'all'): Promise<Listing[]> {
  if (shouldUseMockData()) {
    return []
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return []
    }

    let query = supabase
      .from('listings')
      .select(`
        *,
        states (*),
        seller:marketplace_seller_public (*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return []
    }

    return (data as unknown as DbListingWithRelations[]).map(mapDbListingToModel)
  } catch {
    return []
  }
}

export async function getListingsByCategory(category: ListingCategory): Promise<Listing[]> {
  return getListings(category)
}

export async function getListingById(id: string): Promise<Listing | null> {
  const all = await getListings()
  return all.find((l) => l.id === id) ?? null
}

export async function getFeaturedListings(limit = 4): Promise<Listing[]> {
  const all = await getListings()
  return all.slice(0, limit)
}
