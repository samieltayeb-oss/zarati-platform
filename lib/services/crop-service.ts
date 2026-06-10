import type { Crop, CropPrice } from '@/types'
import { crops } from '@/lib/mock-data'

export async function getCrops(): Promise<Crop[]> {
  return crops
}

export async function getCropById(id: string): Promise<Crop | null> {
  return crops.find((c) => c.id === id) ?? null
}

export async function getTopCrops(limit = 6): Promise<Crop[]> {
  return crops.slice(0, limit)
}

export async function getCropPrices(): Promise<CropPrice[]> {
  return crops.map((c) => c.currentPrice)
}
