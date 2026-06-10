import type { Crop, PriceHistory } from '@/types'

const DATES = [
  '2026-06-03', '2026-06-04', '2026-06-05',
  '2026-06-06', '2026-06-07', '2026-06-08', '2026-06-09',
]

function mkHistory(base: number): PriceHistory[] {
  return DATES.map((date, i) => ({
    date,
    price: Math.round(base * (1 + (i - 3) * 0.005)),
  }))
}

export const crops: Crop[] = [
  {
    id: 'sorghum',
    name: 'Sorghum',
    nameAr: 'ذرة رفيعة',
    category: 'grain',
    currentPrice: {
      id: 'sorghum-price',
      name: 'Sorghum', nameAr: 'ذرة رفيعة',
      price: 82500, currency: 'SDG', unit: 'ton',
      change: 1200, changePercent: 1.48,
      market: 'Gedaref', marketAr: 'القضارف',
      fetchedAt: '2026-06-09T06:00:00Z',
    },
    priceHistory: mkHistory(82500),
  },
  {
    id: 'millet',
    name: 'Millet',
    nameAr: 'دخن',
    category: 'grain',
    currentPrice: {
      id: 'millet-price',
      name: 'Millet', nameAr: 'دخن',
      price: 78000, currency: 'SDG', unit: 'ton',
      change: -390, changePercent: -0.5,
      market: 'El Obeid', marketAr: 'الأبيض',
      fetchedAt: '2026-06-09T06:00:00Z',
    },
    priceHistory: mkHistory(78000),
  },
  {
    id: 'sesame',
    name: 'Sesame',
    nameAr: 'سمسم',
    category: 'oilseed',
    currentPrice: {
      id: 'sesame-price',
      name: 'Sesame', nameAr: 'سمسم',
      price: 320000, currency: 'SDG', unit: 'ton',
      change: 6600, changePercent: 2.1,
      market: 'Gedaref', marketAr: 'القضارف',
      fetchedAt: '2026-06-09T06:00:00Z',
    },
    priceHistory: mkHistory(320000),
  },
  {
    id: 'groundnuts',
    name: 'Groundnuts',
    nameAr: 'فول سوداني',
    category: 'oilseed',
    currentPrice: {
      id: 'groundnuts-price',
      name: 'Groundnuts', nameAr: 'فول سوداني',
      price: 185000, currency: 'SDG', unit: 'ton',
      change: 1470, changePercent: 0.8,
      market: 'Kassala', marketAr: 'كسلا',
      fetchedAt: '2026-06-09T06:00:00Z',
    },
    priceHistory: mkHistory(185000),
  },
  {
    id: 'cotton',
    name: 'Cotton',
    nameAr: 'قطن',
    category: 'cash',
    currentPrice: {
      id: 'cotton-price',
      name: 'Cotton', nameAr: 'قطن',
      price: 245000, currency: 'SDG', unit: 'ton',
      change: -2980, changePercent: -1.2,
      market: 'Gezira', marketAr: 'الجزيرة',
      fetchedAt: '2026-06-09T06:00:00Z',
    },
    priceHistory: mkHistory(245000),
  },
  {
    id: 'wheat',
    name: 'Wheat',
    nameAr: 'قمح',
    category: 'grain',
    currentPrice: {
      id: 'wheat-price',
      name: 'Wheat', nameAr: 'قمح',
      price: 88000, currency: 'SDG', unit: 'ton',
      change: 260, changePercent: 0.3,
      market: 'Khartoum', marketAr: 'الخرطوم',
      fetchedAt: '2026-06-09T06:00:00Z',
    },
    priceHistory: mkHistory(88000),
  },
  {
    id: 'gum-arabic',
    name: 'Gum Arabic',
    nameAr: 'صمغ عربي',
    category: 'cash',
    currentPrice: {
      id: 'gum-arabic-price',
      name: 'Gum Arabic', nameAr: 'صمغ عربي',
      price: 410000, currency: 'SDG', unit: 'ton',
      change: 3650, changePercent: 0.9,
      market: 'Khartoum', marketAr: 'الخرطوم',
      fetchedAt: '2026-06-09T06:00:00Z',
    },
    priceHistory: mkHistory(410000),
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    nameAr: 'عباد الشمس',
    category: 'oilseed',
    currentPrice: {
      id: 'sunflower-price',
      name: 'Sunflower', nameAr: 'عباد الشمس',
      price: 142000, currency: 'SDG', unit: 'ton',
      change: -860, changePercent: -0.6,
      market: 'Sennar', marketAr: 'سنار',
      fetchedAt: '2026-06-09T06:00:00Z',
    },
    priceHistory: mkHistory(142000),
  },
]
