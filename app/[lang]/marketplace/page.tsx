'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { formatCurrency } from '@/lib/utils'
import { listings } from '@/lib/mock-data'
import type { ListingCategory } from '@/types'

const CATEGORY_ICON: Record<string, string> = {
  crops: '🌾',
  equipment: '🚜',
  seeds: '🌱',
  fertilizer: '🧪',
}

const CATEGORIES: { key: ListingCategory | 'all'; ar: string; en: string }[] = [
  { key: 'all',        ar: 'الكل',       en: 'All' },
  { key: 'crops',      ar: 'المحاصيل',   en: 'Crops' },
  { key: 'equipment',  ar: 'المعدات',    en: 'Equipment' },
  { key: 'seeds',      ar: 'البذور',     en: 'Seeds' },
  { key: 'fertilizer', ar: 'الأسمدة',   en: 'Fertilizer' },
]

export default function MarketplacePage() {
  const params = useParams()
  const isAr = params?.lang === 'ar'
  const numLocale = isAr ? 'ar-SD' : 'en-US'

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ListingCategory | 'all'>('all')

  const active = listings.filter((l) => l.status === 'active')
  const filtered = active.filter((l) => {
    const matchesCat = category === 'all' || l.category === category
    const q = query.toLowerCase()
    const title = isAr ? l.titleAr : l.title
    return matchesCat && (!q || title.toLowerCase().includes(q))
  })

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-text">
            {isAr ? 'السوق الزراعي' : 'Agricultural Marketplace'}
          </h1>
          <Badge variant="outline">{isAr ? 'تجريبي' : 'Demo'}</Badge>
        </div>
        <p className="text-muted">
          {isAr ? 'اشترِ وبِع في جميع الفئات الزراعية' : 'Buy and sell across all agricultural categories'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder={isAr ? 'ابحث في الإعلانات...' : 'Search listings...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(({ key, ar, en }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                category === key
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text hover:border-primary/40'
              }`}
            >
              {isAr ? ar : en}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-muted py-16">
          {isAr ? 'لا توجد إعلانات' : 'No listings found'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((listing) => (
            <div
              key={listing.id}
              className="bg-surface rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{CATEGORY_ICON[listing.category] ?? '📦'}</span>
                <Badge variant="outline">{isAr ? 'تجريبي' : 'Demo'}</Badge>
              </div>
              <h3 className="font-semibold text-text mb-1 leading-snug">
                {isAr ? listing.titleAr : listing.title}
              </h3>
              <p className="text-muted text-sm mb-4 flex-1 line-clamp-2">
                {isAr ? listing.descriptionAr : listing.description}
              </p>
              <div className="space-y-1.5 text-sm text-muted mb-4">
                <div className="flex justify-between">
                  <span>{isAr ? 'البائع' : 'Seller'}:</span>
                  <span className="font-medium text-text">
                    {isAr ? listing.seller.nameAr : listing.seller.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{isAr ? 'الموقع' : 'Location'}:</span>
                  <span>{isAr ? listing.locationAr : listing.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isAr ? 'الكمية' : 'Quantity'}:</span>
                  <span>{listing.quantity} {listing.unit}</span>
                </div>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-primary text-lg">
                    {formatCurrency(listing.price, numLocale)}
                  </span>
                  <span className="text-muted text-xs ms-1">/ {listing.unit}</span>
                </div>
                <Button variant="outline" size="sm">
                  {isAr ? 'تواصل' : 'Contact'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
