import type { Listing, ListingCategory } from '@/types'
import { listings as mockListings } from '@/lib/mock-data'
import { shouldUseMockData } from '@/lib/services/gateway-config'
import { getSupabaseClient } from '@/lib/supabase/client'
import { mapDbListingToModel, type DbListingWithRelations } from '@/lib/services/mappers'

export async function getListings(category?: ListingCategory | 'all'): Promise<Listing[]> {
  if (shouldUseMockData()) {
    const active = mockListings.filter((l) => l.status === 'active')
    return category && category !== 'all' ? active.filter((l) => l.category === category) : active
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      const active = mockListings.filter((l) => l.status === 'active')
      return category && category !== 'all' ? active.filter((l) => l.category === category) : active
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
      const active = mockListings.filter((l) => l.status === 'active')
      return category && category !== 'all' ? active.filter((l) => l.category === category) : active
    }

    return (data as unknown as DbListingWithRelations[]).map(mapDbListingToModel)
  } catch {
    const active = mockListings.filter((l) => l.status === 'active')
    return category && category !== 'all' ? active.filter((l) => l.category === category) : active
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
