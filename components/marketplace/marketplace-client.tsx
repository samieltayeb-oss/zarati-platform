'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sprout, Tractor, Leaf, FlaskConical, CheckCircle2, Box } from 'lucide-react'
import { SudanBadge } from '@/components/brand/sudan-badge'

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

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  crops: <Sprout className="w-8 h-8 text-primary" />,
  equipment: <Tractor className="w-8 h-8 text-primary" />,
  seeds: <Leaf className="w-8 h-8 text-primary" />,
  fertilizer: <FlaskConical className="w-8 h-8 text-primary" />,
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
        <div className="flex items-center gap-2 mb-2">
          <SudanBadge lang={locale === 'ar' ? 'ar' : 'en'} variant="header" className="text-[10px] py-0.5 px-2" />
        </div>
        <h1 className="text-3xl font-bold text-text mb-1 font-cairo">
          {isAr ? 'السوق الزراعي في السودان' : 'Sudan Agricultural Marketplace'}
        </h1>
        <p className="text-muted">
          {isAr ? 'تبادل وتداول السلع والمدخلات الزراعية بين ولايات ومراكز الإنتاج' : 'Verified spot listings and commercial commodity matching across Sudan'}
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
        <div className="text-center py-16 flex flex-col items-center justify-center bg-surface border border-border rounded-xl p-8 max-w-md mx-auto my-8">
          <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 border border-border bg-muted/20 shadow-inner">
            <Image
              src="/images/zarati/empty-states/empty-grain-sieve.jpg"
              alt={isAr ? 'غربال حبوب زراعي فارغ' : 'Empty wooden agricultural grain sieve'}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
          <p className="text-lg font-bold font-cairo text-text mb-1">
            {isAr ? 'لا توجد إعلانات مطابقة حالياً' : 'No matching listings found'}
          </p>
          <p className="text-xs text-muted max-w-xs mb-4">
            {isAr ? 'جرب تغيير فئة المحصول أو مسح نص البحث' : 'Try adjusting crop category filters or clearing the search query'}
          </p>
          {userRole === 'farmer' && (
            <Button className="mt-2 font-bold" onClick={() => router.push(`/${locale}/dashboard/farmer`)}>
              {isAr ? '+ إضافة إعلان جديد' : '+ Create New Listing'}
            </Button>
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="flex flex-col gap-6 mt-4">
          {filtered.map(listing => (
            <div
              key={listing.id}
              className="bg-surface-card rounded-none border-2 border-border-strong hover:border-primary transition-colors flex flex-col"
            >
              {/* Header */}
              <div className="bg-surface-elevated border-b-2 border-border-strong p-4 flex items-start justify-between cursor-pointer group" onClick={() => router.push(`/${locale}/marketplace/${listing.id}`)}>
                <div className="flex items-center gap-3">
                  <div className="text-primary">{CATEGORY_ICON[listing.category] ?? <Box className="w-6 h-6" />}</div>
                  <div>
                    <h3 className="font-bold text-text text-heading-sm font-cairo group-hover:text-primary transition-colors">
                      {isAr ? listing.title_ar : listing.title_en}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-status-verified text-sm font-bold border border-status-verified/20 bg-status-verified/10 px-2 py-1 rounded">
                  <CheckCircle2 className="w-4 h-4" />
                  {isAr ? 'موثق' : 'Verified'}
                </div>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-sm bg-surface-canvas/50 font-sans">
                <div>
                  <div className="text-muted text-xs mb-1 font-semibold">{isAr ? 'الكمية' : 'Quantity'}</div>
                  <div className="font-bold text-text tabular-nums text-lg">
                    {listing.quantity} <span className="text-muted font-normal text-xs">{listing.unit}</span>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <div className="text-muted text-xs mb-1 font-semibold">{isAr ? 'الوصف' : 'Description'}</div>
                  <div className="text-text font-medium line-clamp-1">{isAr ? (listing.description_ar || '—') : (listing.description_en || '—')}</div>
                </div>
                <div className="flex flex-col md:items-end justify-center">
                  {listing.price != null ? (
                    <div className="text-right">
                      <div className="text-muted text-xs mb-1 font-semibold">{isAr ? 'السعر (استرشادي)' : 'Price (Indicative)'}</div>
                      <div className="font-bold text-primary text-xl tabular-nums">
                        {Number(listing.price).toLocaleString(isAr ? 'ar' : 'en')} {listing.currency}
                      </div>
                    </div>
                  ) : (
                    <div className="font-medium text-muted text-sm">{isAr ? 'تواصل لمعرفة السعر' : 'Contact for price'}</div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="border-t-2 border-border-strong p-4 flex items-center justify-between bg-surface-card">
                <div className="text-xs text-muted flex gap-4">
                  <span>{isAr ? 'تاريخ النشر:' : 'Posted:'} {new Date(listing.created_at).toLocaleDateString(isAr ? 'ar-SD' : 'en-US')}</span>
                  <span>{isAr ? 'معرّف:' : 'ID:'} <span className="font-mono">{listing.id.split('-')[0]}</span></span>
                </div>
                
                {userRole === 'trader' ? (
                  <Button size="sm" onClick={() => { setRfqListing(listing); setRfqError(null) }} className="font-bold rounded-none border-2">
                    {isAr ? 'التواصل مع البائع ➔' : 'Contact Seller ➔'}
                  </Button>
                ) : userRole === 'farmer' ? (
                  <Button size="sm" variant="outline" onClick={() => router.push(`/${locale}/marketplace/${listing.id}`)} className="font-bold rounded-none border-2">
                    {isAr ? 'عرض الإعلان' : 'View Listing'}
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => router.push(`/${locale}/login`)} className="font-bold rounded-none border-2">
                    {isAr ? 'تسجيل الدخول للتواصل' : 'Sign In to Contact'}
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
              <div className="text-center py-4 flex flex-col items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-success mb-2" />
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
