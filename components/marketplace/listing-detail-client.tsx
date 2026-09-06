'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

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
  location_name_en: string | null
  location_name_ar: string | null
  available_from: string | null
  available_until: string | null
  created_at: string
}

interface Media {
  id: string
  storage_path: string
  is_primary: boolean
}

interface SellerProfile {
  full_name: string | null
  full_name_ar: string | null
  rating: number | null
  total_deals_completed: number | null
  is_verified: boolean | null
}

interface Props {
  locale: string
  listing: PublicListing
  media: Media[]
  seller: SellerProfile | null
  userRole: string | null
  userId: string | null
}

export function ListingDetailClient({ locale, listing, media, seller, userRole }: Props) {
  const isAr = locale === 'ar'
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [showRfqModal, setShowRfqModal] = useState(false)
  const [rfqMessage, setRfqMessage] = useState('')
  const [rfqError, setRfqError] = useState<string | null>(null)
  const [rfqSuccess, setRfqSuccess] = useState(false)
  const [requestedQuantity, setRequestedQuantity] = useState<string>(listing.quantity.toString())

  const title = isAr ? (listing.title_ar || listing.title_en) : (listing.title_en || listing.title_ar)
  const description = isAr ? listing.description_ar : listing.description_en
  const location = isAr ? listing.location_name_ar : listing.location_name_en

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

  async function handleSubmitRFQ() {
    setRfqError(null)
    startTransition(async () => {
      const { submitRFQ } = await import('@/lib/actions/rfq')
      const result = await submitRFQ({
        listing_id: listing.id,
        message: rfqMessage || null,
        requested_quantity: requestedQuantity ? Number(requestedQuantity) : undefined,
      })
      
      if (result.success) {
        setRfqSuccess(true)
        setTimeout(() => { 
          setShowRfqModal(false)
          setRfqSuccess(false)
          setRfqMessage('')
          router.push(`/${locale}/dashboard/trader`)
        }, 2000)
      } else {
        setRfqError(result.error)
      }
    })
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="container py-8 max-w-5xl space-y-8">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.push(`/${locale}/marketplace`)} className="mb-4">
        {isAr ? '← العودة للسوق' : '← Back to Marketplace'}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Images & Details */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Image Gallery */}
          <div className="bg-surface border rounded-xl overflow-hidden aspect-[4/3] relative flex items-center justify-center">
            {media.length > 0 ? (
              <Image 
                src={`${SUPABASE_URL}/storage/v1/object/public/listing-media/${media[0].storage_path}`}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-6xl opacity-20">🌾</div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span className="bg-muted/20 px-3 py-1 rounded-full">
                {isAr ? 'الكمية:' : 'Qty:'} <strong className="text-text">{listing.quantity} {listing.unit}</strong>
              </span>
              {location && (
                <span className="bg-muted/20 px-3 py-1 rounded-full">📍 {location}</span>
              )}
            </div>

            {description && (
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold">{isAr ? 'الوصف' : 'Description'}</h3>
                <p className="text-muted leading-relaxed whitespace-pre-wrap">{description}</p>
              </div>
            )}

            {(listing.available_from || listing.available_until) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {isAr ? 'فترة التوفر' : 'Availability'}
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {listing.available_from && <span>{isAr ? 'من: ' : 'From: '} {new Date(listing.available_from).toLocaleDateString()} </span>}
                  {listing.available_until && <span>{isAr ? 'إلى: ' : 'To: '} {new Date(listing.available_until).toLocaleDateString()}</span>}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Action Card */}
        <div className="md:col-span-1">
          <div className="bg-surface border rounded-xl p-6 sticky top-24 space-y-6 shadow-sm">
            
            <div className="space-y-1">
              <p className="text-sm text-muted uppercase tracking-wider">{isAr ? 'السعر' : 'Price'}</p>
              {listing.price != null ? (
                <p className="text-3xl font-bold text-primary">
                  {Number(listing.price).toLocaleString(isAr ? 'ar' : 'en')} {listing.currency}
                  <span className="text-sm text-muted font-normal ms-1">/ {listing.unit}</span>
                </p>
              ) : (
                <p className="text-xl font-medium text-muted">
                  {isAr ? 'تواصل لمعرفة السعر' : 'Contact for price'}
                </p>
              )}
            </div>

            <hr className="border-border" />

            {seller && (
              <div className="space-y-3">
                <p className="text-sm text-muted uppercase tracking-wider">{isAr ? 'البائع' : 'Seller'}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {(isAr ? seller.full_name_ar || seller.full_name : seller.full_name)?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">
                      {isAr ? seller.full_name_ar || seller.full_name : seller.full_name}
                      {seller.is_verified && <span className="text-blue-500 ms-1" title="Verified">✓</span>}
                    </p>
                    <p className="text-xs text-muted">
                      {seller.total_deals_completed ? `${seller.total_deals_completed} ${isAr ? 'صفقة مكتملة' : 'deals'}` : (isAr ? 'بائع جديد' : 'New seller')}
                      {seller.rating && ` · ⭐ ${seller.rating}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              {userRole === 'trader' ? (
                <Button className="w-full py-6 text-lg" onClick={() => setShowRfqModal(true)}>
                  {isAr ? 'طلب اقتراح (RFQ)' : 'Express Interest (RFQ)'}
                </Button>
              ) : !userRole ? (
                <Button className="w-full py-6" variant="outline" onClick={() => router.push(`/${locale}/login`)}>
                  {isAr ? 'سجل الدخول للتواصل' : 'Sign In to Contact'}
                </Button>
              ) : userRole === 'farmer' ? (
                <div className="bg-muted/30 p-3 rounded text-center text-sm text-muted">
                  {isAr ? 'حسابات المزارعين لا يمكنها تقديم طلبات شراء.' : 'Farmer accounts cannot submit purchase requests.'}
                </div>
              ) : null}
            </div>

          </div>
        </div>
      </div>

      {/* RFQ Modal */}
      {showRfqModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl border p-6 max-w-md w-full space-y-4 shadow-xl" dir={isAr ? 'rtl' : 'ltr'}>
            {rfqSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold">{isAr ? 'تم إرسال الطلب بنجاح' : 'Inquiry Submitted'}</h3>
                <p className="text-muted">{isAr ? 'سيتم تحويلك إلى لوحة التحكم...' : 'Redirecting to dashboard...'}</p>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-lg">{isAr ? 'طلب اقتراح (RFQ)' : 'Request for Quotation'}</h3>
                <div className="space-y-4 py-2">
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">{isAr ? 'الكمية المطلوبة' : 'Requested Quantity'}</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={requestedQuantity} 
                        onChange={e => setRequestedQuantity(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
                        max={listing.quantity}
                      />
                      <span className="text-muted text-sm shrink-0">{listing.unit}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{isAr ? 'رسالة إضافية للبائع (اختياري)' : 'Message to seller (optional)'}</label>
                    <textarea
                      value={rfqMessage}
                      onChange={e => setRfqMessage(e.target.value)}
                      placeholder={isAr ? 'أرغب في مناقشة تفاصيل الشحن...' : 'I would like to discuss shipping...'}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none"
                    />
                  </div>
                </div>

                {rfqError && <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-100">{rfqError}</div>}
                
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowRfqModal(false)} className="flex-1">
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button onClick={handleSubmitRFQ} disabled={isPending} className="flex-1">
                    {isPending ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال الطلب' : 'Submit Request')}
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
