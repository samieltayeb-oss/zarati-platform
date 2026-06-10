import { describe, it, expect } from 'vitest'
import {
  getListings,
  getListingsByCategory,
  getListingById,
  getFeaturedListings,
} from '@/lib/services/marketplace-service'

describe('getListings', () => {
  it('returns only active listings', async () => {
    const items = await getListings()
    items.forEach((l) => expect(l.status).toBe('active'))
  })

  it('returns all 8 active listings', async () => {
    const items = await getListings()
    expect(items).toHaveLength(8)
  })

  it('each listing has required fields', async () => {
    const [item] = await getListings()
    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('titleAr')
    expect(item).toHaveProperty('price')
    expect(item).toHaveProperty('currency')
    expect(item).toHaveProperty('seller')
  })
})

describe('getListingsByCategory', () => {
  it('returns only crops', async () => {
    const items = await getListingsByCategory('crops')
    expect(items.length).toBeGreaterThan(0)
    items.forEach((l) => expect(l.category).toBe('crops'))
  })

  it('returns only equipment', async () => {
    const items = await getListingsByCategory('equipment')
    expect(items.length).toBeGreaterThan(0)
    items.forEach((l) => expect(l.category).toBe('equipment'))
  })

  it('covers all 4 categories', async () => {
    const categories = ['crops', 'equipment', 'seeds', 'fertilizer'] as const
    for (const cat of categories) {
      const items = await getListingsByCategory(cat)
      expect(items.length).toBeGreaterThan(0)
    }
  })
})

describe('getListingById', () => {
  it('finds listing by id', async () => {
    const item = await getListingById('lst-001')
    expect(item).not.toBeNull()
    expect(item?.titleAr).toBe('ذرة رفيعة — ٥٠ طن')
  })

  it('returns null for unknown id', async () => {
    expect(await getListingById('unknown-id')).toBeNull()
  })
})

describe('getFeaturedListings', () => {
  it('respects the limit parameter', async () => {
    expect(await getFeaturedListings(3)).toHaveLength(3)
    expect(await getFeaturedListings(6)).toHaveLength(6)
  })

  it('default limit returns 4', async () => {
    expect(await getFeaturedListings()).toHaveLength(4)
  })

  it('returned listings are active', async () => {
    const items = await getFeaturedListings(8)
    items.forEach((l) => expect(l.status).toBe('active'))
  })
})
