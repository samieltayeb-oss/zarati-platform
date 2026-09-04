import type { Crop, CropPrice, PriceHistory, CropCategory, Listing, Seller, ListingCategory, ListingStatus } from '@/types'
import type { Tables } from '@/types/database.types'

type DbCrop = Tables<'crops'>
type DbPrice = Tables<'crop_prices'>
type DbMarket = Tables<'markets'>
type DbListing = Tables<'listings'>
type DbState = Tables<'states'>
type DbSellerPublic = Tables<'marketplace_seller_public'>

export interface DbCropWithPrices extends DbCrop {
  crop_prices: (DbPrice & {
    markets: DbMarket | null
  })[]
}

export function mapDbCropToModel(cropRow: DbCropWithPrices): Crop {
  const sortedPrices = (cropRow.crop_prices || []).sort(
    (a, b) => new Date(b.price_date).getTime() - new Date(a.price_date).getTime()
  )

  const latest = sortedPrices[0]
  const previous = sortedPrices[1]

  const change = latest && previous ? latest.price_sdg - previous.price_sdg : 0
  const changePercent = previous && previous.price_sdg > 0
    ? Number(((change / previous.price_sdg) * 100).toFixed(2))
    : 0

  const currentPrice: CropPrice = {
    id: latest?.id || `${cropRow.code}-price`,
    name: cropRow.name_en,
    nameAr: cropRow.name_ar,
    price: latest?.price_sdg || 0,
    currency: (latest?.currency as 'SDG' | 'USD') || 'SDG',
    unit: latest?.unit || cropRow.standard_unit,
    change,
    changePercent,
    market: latest?.markets?.name_en || 'National',
    marketAr: latest?.markets?.name_ar || 'القومي',
    fetchedAt: latest?.created_at || new Date().toISOString(),
  }

  const priceHistory: PriceHistory[] = sortedPrices.slice(0, 7).reverse().map((p) => ({
    date: p.price_date,
    price: p.price_sdg,
  }))

  return {
    id: cropRow.code,
    name: cropRow.name_en,
    nameAr: cropRow.name_ar,
    category: cropRow.category as CropCategory,
    currentPrice,
    priceHistory: priceHistory.length > 0 ? priceHistory : [{ date: new Date().toISOString().slice(0, 10), price: latest?.price_sdg || 0 }],
  }
}

export interface DbListingWithRelations extends DbListing {
  states?: DbState | null
  seller?: DbSellerPublic | null
}

export function mapDbListingToModel(listingRow: DbListingWithRelations): Listing {
  const seller: Seller = {
    id: listingRow.seller?.id || listingRow.user_id,
    name: listingRow.seller?.full_name || 'Verified Member',
    nameAr: listingRow.seller?.full_name_ar || 'عضو موثق',
    rating: listingRow.seller?.rating || 4.8,
    phone: '', // Protected PII concealed on public catalog
  }

  return {
    id: listingRow.id,
    title: listingRow.title_en,
    titleAr: listingRow.title_ar,
    description: listingRow.description_en || '',
    descriptionAr: listingRow.description_ar || '',
    category: listingRow.category as ListingCategory,
    price: Number(listingRow.price),
    currency: (listingRow.currency as 'SDG' | 'USD') || 'SDG',
    unit: listingRow.unit,
    quantity: Number(listingRow.quantity),
    location: listingRow.location_name_en || listingRow.states?.name_en || 'Sudan',
    locationAr: listingRow.location_name_ar || listingRow.states?.name_ar || 'السودان',
    seller,
    images: [],
    status: (listingRow.status === 'active' ? 'active' : listingRow.status === 'sold' ? 'sold' : 'pending') as ListingStatus,
    createdAt: listingRow.created_at,
  }
}
