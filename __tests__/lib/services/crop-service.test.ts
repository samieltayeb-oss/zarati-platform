import { describe, it, expect } from 'vitest'
import { getCrops, getCropById, getTopCrops, getCropPrices } from '@/lib/services/crop-service'

describe('getCrops', () => {
  it('returns all 8 crops', async () => {
    const crops = await getCrops()
    expect(crops).toHaveLength(8)
  })
  it('each crop has required fields', async () => {
    const [crop] = await getCrops()
    expect(crop).toHaveProperty('id')
    expect(crop).toHaveProperty('nameAr')
    expect(crop).toHaveProperty('currentPrice')
    expect(crop.currentPrice).toHaveProperty('price')
    expect(crop.currentPrice).toHaveProperty('fetchedAt')
  })
  it('includes sorghum as the first crop', async () => {
    const [first] = await getCrops()
    expect(first.id).toBe('sorghum')
  })
})

describe('getCropById', () => {
  it('finds sesame by id', async () => {
    const crop = await getCropById('sesame')
    expect(crop).not.toBeNull()
    expect(crop?.nameAr).toBe('سمسم')
  })
  it('returns null for unknown id', async () => {
    expect(await getCropById('unknown-crop')).toBeNull()
  })
})

describe('getTopCrops', () => {
  it('returns the requested number of crops', async () => {
    expect(await getTopCrops(3)).toHaveLength(3)
    expect(await getTopCrops(5)).toHaveLength(5)
  })
})

describe('getCropPrices', () => {
  it('returns a price entry for each crop', async () => {
    const prices = await getCropPrices()
    const crops = await getCrops()
    expect(prices).toHaveLength(crops.length)
  })
  it('each price entry has currency SDG', async () => {
    const prices = await getCropPrices()
    prices.forEach((p) => expect(p.currency).toBe('SDG'))
  })
})
