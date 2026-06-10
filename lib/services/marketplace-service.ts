import type { Listing, ListingCategory } from '@/types'
import { listings } from '@/lib/mock-data'

export async function getListings(): Promise<Listing[]> {
  return listings.filter((l) => l.status === 'active')
}

export async function getListingsByCategory(category: ListingCategory): Promise<Listing[]> {
  return listings.filter((l) => l.category === category && l.status === 'active')
}

export async function getListingById(id: string): Promise<Listing | null> {
  return listings.find((l) => l.id === id) ?? null
}

export async function getFeaturedListings(limit = 4): Promise<Listing[]> {
  return listings.filter((l) => l.status === 'active').slice(0, limit)
}
