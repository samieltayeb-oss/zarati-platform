import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { Listing } from '@/types'
import type { Locale } from '@/lib/i18n/config'

const CATEGORY_ICON: Record<string, string> = {
  crops: '🌾',
  equipment: '🚜',
  seeds: '🌱',
  fertilizer: '🧪',
}

interface MarketplacePreviewDict {
  title: string
  subtitle: string
  browseAll: string
}

interface Props {
  lang: Locale
  listings: Listing[]
  dict: MarketplacePreviewDict
  demoLabel: string
  sellerLabel: string
  locationLabel: string
  quantityLabel: string
}

export function MarketplacePreview({
  lang, listings, dict, demoLabel, sellerLabel, locationLabel, quantityLabel,
}: Props) {
  const isAr = lang === 'ar'
  const numLocale = isAr ? 'ar-SD' : 'en-US'

  return (
    <section className="py-16 sm:py-20 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-1">{dict.title}</h2>
            <p className="text-muted text-sm">{dict.subtitle}</p>
          </div>
          <Link href={`/${lang}/marketplace`}>
            <Button variant="primary" size="sm">{dict.browseAll}</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-bg rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{CATEGORY_ICON[listing.category] ?? '📦'}</span>
                <Badge variant="outline">{demoLabel}</Badge>
              </div>
              <h3 className="font-semibold text-text text-sm mb-1 leading-snug">
                {isAr ? listing.titleAr : listing.title}
              </h3>
              <p className="text-muted text-xs mb-3 line-clamp-2">
                {isAr ? listing.descriptionAr : listing.description}
              </p>
              <div className="space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <span>{sellerLabel}:</span>
                  <span className="font-medium text-text">
                    {isAr ? listing.seller.nameAr : listing.seller.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{locationLabel}:</span>
                  <span>{isAr ? listing.locationAr : listing.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>{quantityLabel}:</span>
                  <span>{listing.quantity} {listing.unit}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="font-bold text-primary text-base">
                  {formatCurrency(listing.price, numLocale)}
                </span>
                <span className="text-muted text-xs ms-1">/ {listing.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
