import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { shouldUseMockData } from '@/lib/services/gateway-config'
import { mapDbCropToModel, mapDbListingToModel, type DbCropWithPrices, type DbListingWithRelations } from '@/lib/services/mappers'

describe('Gateway Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns true when NEXT_PUBLIC_USE_MOCK_DATA is "true"', () => {
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true'
    expect(shouldUseMockData()).toBe(true)
  })

  it('returns true when Supabase credentials are missing', () => {
    delete process.env.NEXT_PUBLIC_USE_MOCK_DATA
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    expect(shouldUseMockData()).toBe(true)
  })

  it('returns false when NEXT_PUBLIC_USE_MOCK_DATA is false and credentials exist', () => {
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'false'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-test-key'
    expect(shouldUseMockData()).toBe(false)
  })
})

describe('Data Mappers', () => {
  it('maps database crop and calculates price change correctly', () => {
    const mockDbCrop: DbCropWithPrices = {
      id: 'crop-1',
      code: 'sorghum',
      name_en: 'Sorghum',
      name_ar: 'ذرة رفيعة',
      category: 'grain',
      standard_unit: 'ton',
      sort_order: 1,
      is_active: true,
      created_at: '2026-09-01T00:00:00Z',
      crop_prices: [
        {
          id: 'p-today',
          crop_id: 'crop-1',
          market_id: 'm-1',
          price_sdg: 85000,
          price_usd: null,
          currency: 'SDG',
          unit: 'ton',
          price_date: '2026-09-04',
          source: 'market_authority',
          is_official: true,
          notes: null,
          created_by: null,
          created_at: '2026-09-04T08:00:00Z',
          markets: {
            id: 'm-1',
            state_id: 's-1',
            code: 'MKT-GD',
            name_en: 'Gedaref Exchange',
            name_ar: 'سوق القضارف',
            city_en: 'Gedaref',
            city_ar: 'القضارف',
            market_type: 'physical',
            is_active: true,
            created_at: '2026-09-01T00:00:00Z',
          },
        },
        {
          id: 'p-yesterday',
          crop_id: 'crop-1',
          market_id: 'm-1',
          price_sdg: 80000,
          price_usd: null,
          currency: 'SDG',
          unit: 'ton',
          price_date: '2026-09-03',
          source: 'market_authority',
          is_official: true,
          notes: null,
          created_by: null,
          created_at: '2026-09-03T08:00:00Z',
          markets: null,
        },
      ],
    }

    const domainCrop = mapDbCropToModel(mockDbCrop)

    expect(domainCrop.id).toBe('sorghum')
    expect(domainCrop.name).toBe('Sorghum')
    expect(domainCrop.currentPrice.price).toBe(85000)
    // 85000 - 80000 = 5000 change
    expect(domainCrop.currentPrice.change).toBe(5000)
    // 5000 / 80000 * 100 = 6.25%
    expect(domainCrop.currentPrice.changePercent).toBe(6.25)
    expect(domainCrop.currentPrice.market).toBe('Gedaref Exchange')
    expect(domainCrop.priceHistory.length).toBe(2)
  })

  it('maps database listing and suppresses private phone from public view', () => {
    const mockDbListing: DbListingWithRelations = {
      id: 'list-123',
      user_id: 'user-456',
      category: 'crops',
      crop_id: 'crop-1',
      title_en: 'Grade A White Sesame',
      title_ar: 'سمسم أبيض ممتاز',
      description_en: 'Export ready',
      description_ar: 'جاهز للتصدير',
      price: 320000,
      currency: 'SDG',
      unit: 'ton',
      quantity: 50,
      state_id: 'state-1',
      market_id: null,
      location_name_en: 'Gedaref',
      location_name_ar: 'القضارف',
      status: 'active',
      featured: true,
      views_count: 10,
      inquiries_count: 2,
      available_from: null,
      available_until: null,
      farm_id: null,
      moderation_status: 'approved',
      expires_at: '2026-10-04T00:00:00Z',
      created_at: '2026-09-04T00:00:00Z',
      updated_at: '2026-09-04T00:00:00Z',
      seller: {
        id: 'user-456',
        full_name: 'Hassan Ibrahim',
        full_name_ar: 'حسن إبراهيم',
        role: 'farmer',
        avatar_url: null,
        is_verified: true,
        rating: 4.9,
        total_deals_completed: 14,
      },
    }

    const domainListing = mapDbListingToModel(mockDbListing)

    expect(domainListing.id).toBe('list-123')
    expect(domainListing.price).toBe(320000)
    expect(domainListing.seller.name).toBe('Hassan Ibrahim')
    expect(domainListing.seller.rating).toBe(4.9)
    // Privacy safeguard verification: phone must be empty
    expect(domainListing.seller.phone).toBe('')
  })
})
