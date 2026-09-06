import type { Crop, CropPrice } from '@/types'

import { shouldUseMockData } from '@/lib/services/gateway-config'
import { getSupabaseClient } from '@/lib/supabase/client'
import { mapDbCropToModel, type DbCropWithPrices } from '@/lib/services/mappers'

export async function getCrops(): Promise<Crop[]> {
  if (shouldUseMockData()) {
    return []
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('crops')
      .select(`
        *,
        crop_prices (
          *,
          markets (*)
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return []
    }

    return (data as unknown as DbCropWithPrices[]).map(mapDbCropToModel)
  } catch {
    return []
  }
}

export async function getCropById(id: string): Promise<Crop | null> {
  const all = await getCrops()
  return all.find((c) => c.id === id) ?? null
}

export async function getTopCrops(limit = 6): Promise<Crop[]> {
  const all = await getCrops()
  return all.slice(0, limit)
}

export async function getCropPrices(): Promise<CropPrice[]> {
  const all = await getCrops()
  return all.map((c) => c.currentPrice)
}
