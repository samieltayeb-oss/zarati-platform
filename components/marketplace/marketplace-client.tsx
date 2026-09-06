'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PublicListing {
  id: string
  category: string
  title_en: string
  title_ar: string
  description_en: string | null
  description_ar: string | null
  price: number | null
  currency: string
  unit: string
  quantity: number
  state_id: string | null
  created_at: string
}

interface Props {
  locale: string
  listings: PublicListing[]
  userRole: string | null
  userId: string | null
}

const CATEGORY_ICON: Record<string, string> = {
  crops: '🌾',
  equipment: '🚜',
  seeds: '🌱',
  fertilizer: '🧪',
}

const CATEGORIES = [
  { key: 'all', ar: 'الكل', en: 'All' },
  { key: 'crops', ar: 'المحاصيل', en: 'Crops' },
  { key: 'equipment', ar: 'المعدات', en: 'Equipment' },
  { key: 'seeds', ar: 'البذور', en: 'Seeds' },
  { key: 'fertilizer', ar: 'الأسمدة', en: 'Fertilizer' },
]

export function MarketplaceClient({ locale, listings, userRole }: Props) {
  const isAr = locale === 'ar'
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [rfqListing, setRfqListing] = useState<PublicListing | null>(null)
  const [rfqMessage, setRfqMessage] = useState('')
  const [rfqError, setRfqError] = useState<string | null>(null)
  const [rfqSuccess, setRfqSuccess] = useState(false)

  const filtered = listings.filter(l => {
    const matchesCat = category === 'all' || l.category === category
    const q = query.toLowerCase()
    const title = isAr ? l.title_ar : l.title_en
    return matchesCat && (!q || title.toLowerCase().includes(q))
  })

  async function handleSubmitRFQ() {
    if (!rfqListing) return
    setRfqError(null)
    startTransition(async () => {
      const { submitRFQ } = await import('@/lib/actions/rfq')
      const result = await submitRFQ({
        listing_id: rfqListing.id,
        message: rfqMessage || null,
      })
      if (result.success) {
        setRfqSuccess(true)
        setTimeout(() => { setRfqListing(null); setRfqSuccess(false); setRfqMessage('') }, 2000)
      } else {
        setRfqError(result.error)
      }
    })
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-1">
          {isAr ? 'السوق الزراعي' : 'Agricultural Marketplace'}
        </h1>
        <p className="text-muted">
          {isAr ? 'اشترِ وبِع في جميع الفئات الزراعية' : 'Buy and sell across all agricultural categories'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder={isAr ? 'ابحث في الإعلانات...' : 'Search listings...'}
          value={query}
          onChange={e => setQuery(e.target.value)}
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

      {/* Zero state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🌾</p>
          <p className="text-lg font-medium text-text mb-2">
            {isAr ? 'لا توجد إعلانات حالياً' : 'No listings yet'}
          </p>
          {userRole === 'farmer' && (
            <Button className="mt-4" onClick={() => router.push(`/${locale}/dashboard/farmer`)}>
              {isAr ? '+ إضافة إعلان' : '+ Add Listing'}
            </Button>
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(listing => (
            <div
              key={listing.id}
              className="bg-surface rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{CATEGORY_ICON[listing.category] ?? '📦'}</span>
              </div>
              <h3 className="font-semibold text-text mb-1 leading-snug cursor-pointer hover:text-primary transition-colors" onClick={() => router.push(`/${locale}/marketplace/${listing.id}`)}>
                {isAr ? listing.title_ar : listing.title_en}
              </h3>
              {(listing.description_en || listing.description_ar) && (
                <p className="text-muted text-sm mb-3 flex-1 line-clamp-2">
                  {isAr ? listing.description_ar : listing.description_en}
                </p>
              )}
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <div>
                  {listing.price != null ? (
                    <span className="font-bold text-primary text-lg">
                      {Number(listing.price).toLocaleString(isAr ? 'ar' : 'en')} {listing.currency}
                      <span className="text-muted text-xs ms-1">/ {listing.unit}</span>
                    </span>
                  ) : (
                    <span className="font-medium text-muted text-sm">
                      {isAr ? 'تواصل لمعرفة السعر' : 'Contact for price'}
                    </span>
                  )}
                </div>
                {userRole === 'trader' && (
                  <Button size="sm" onClick={() => { setRfqListing(listing); setRfqError(null) }}>
                    {isAr ? 'طلب اقتراح' : 'Express Interest'}
                  </Button>
                )}
                {!userRole && (
                  <Button size="sm" variant="outline" onClick={() => router.push(`/${locale}/login`)}>
                    {isAr ? 'تسجيل الدخول' : 'Sign In'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RFQ Modal */}
      {rfqListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl border p-6 max-w-md w-full space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
            {rfqSuccess ? (
              <div className="text-center py-4">
                <p className="text-2xl mb-2">✅</p>
                <p className="font-medium">{isAr ? 'تم إرسال الطلب!' : 'Inquiry submitted!'}</p>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-lg">{isAr ? 'طلب اقتراح (RFQ)' : 'Request for Quotation'}</h3>
                <p className="text-sm text-muted">
                  {isAr ? rfqListing.title_ar : rfqListing.title_en}
                </p>
                <textarea
                  value={rfqMessage}
                  onChange={e => setRfqMessage(e.target.value)}
                  placeholder={isAr ? 'رسالتك للبائع (اختياري)...' : 'Message to seller (optional)...'}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none"
                />
                {rfqError && <p className="text-sm text-red-600">{rfqError}</p>}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setRfqListing(null)} className="flex-1">
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button onClick={handleSubmitRFQ} disabled={isPending} className="flex-1">
                    {isPending ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال' : 'Send')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
