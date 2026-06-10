export type ListingCategory = 'crops' | 'equipment' | 'seeds' | 'fertilizer'
export type ListingStatus = 'active' | 'sold' | 'pending'

export interface Seller {
  id: string
  name: string
  nameAr: string
  rating: number
  phone: string
}

export interface Listing {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  category: ListingCategory
  price: number
  currency: 'SDG' | 'USD'
  unit: string
  quantity: number
  location: string
  locationAr: string
  seller: Seller
  images: string[]
  status: ListingStatus
  createdAt: string
}
