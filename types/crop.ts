export type CropCategory = 'grain' | 'oilseed' | 'vegetable' | 'fruit' | 'cash'

export interface CropPrice {
  id: string
  name: string
  nameAr: string
  price: number
  currency: 'SDG' | 'USD'
  unit: string
  change: number
  changePercent: number
  market: string
  marketAr: string
  fetchedAt: string
}

export interface PriceHistory {
  date: string
  price: number
}

export interface Crop {
  id: string
  name: string
  nameAr: string
  category: CropCategory
  currentPrice: CropPrice
  priceHistory: PriceHistory[]
}
