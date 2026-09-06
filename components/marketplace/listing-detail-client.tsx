'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Sprout, CheckCircle2, MapPin, Star } from 'lucide-react'

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
          
          <div className="bg-surface-card border-2 border-border-strong p-6 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary text-sm font-bold uppercase tracking-wider">{isAr ? 'بيانات السلعة' : 'Commodity Data'}</span>
                <span className="bg-status-verified/10 text-status-verified border border-status-verified/20 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isAr ? 'موثق من المنصة' : 'Platform Verified'}
                </span>
              </div>
              <h1 className="text-display-sm font-bold font-cairo mb-2">{title}</h1>
              {location && (
                <div className="flex items-center gap-1.5 text-muted text-sm font-medium">
                  <MapPin className="w-4 h-4" /> {location}
                </div>
              )}
            </div>

            {/* Image Gallery (Structured) */}
            <div className="bg-surface-canvas border-2 border-border-strong overflow-hidden aspect-[16/9] relative flex items-center justify-center">
              {media.length > 0 ? (
                <Image 
                  src={`${SUPABASE_URL}/storage/v1/object/public/listing-media/${media[0].storage_path}`}
                  alt={title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="opacity-20 flex flex-col items-center justify-center h-full w-full gap-2">
                  <Sprout className="w-12 h-12" />
                  <span className="font-mono text-sm uppercase">NO_MEDIA_ATTACHED</span>
                </div>
              )}
            </div>

            {/* Structural Data Table */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-strong border-2 border-border-strong">
              <div className="bg-surface-card p-4">
                <div className="text-muted text-xs mb-1 font-semibold">{isAr ? 'الكمية المتوفرة' : 'Available Qty'}</div>
                <div className="font-bold text-text tabular-nums">{listing.quantity} <span className="text-muted text-xs">{listing.unit}</span></div>
              </div>
              <div className="bg-surface-card p-4">
                <div className="text-muted text-xs mb-1 font-semibold">{isAr ? 'التصنيف' : 'Category'}</div>
                <div className="font-bold text-text capitalize">{listing.category}</div>
              </div>
              <div className="bg-surface-card p-4">
                <div className="text-muted text-xs mb-1 font-semibold">{isAr ? 'تاريخ النشر' : 'Listed On'}</div>
                <div className="font-bold text-text tabular-nums">{new Date(listing.created_at).toLocaleDateString(isAr ? 'ar-SD' : 'en-US')}</div>
              </div>
              <div className="bg-surface-card p-4">
                <div className="text-muted text-xs mb-1 font-semibold">{isAr ? 'فترة التوفر' : 'Availability'}</div>
                <div className="font-bold text-text text-sm">
                  {listing.available_from ? new Date(listing.available_from).toLocaleDateString() : (isAr ? 'فوري' : 'Immediate')}
                </div>
              </div>
            </div>

            {description && (
              <div className="border-t-2 border-border-strong pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">{isAr ? 'المواصفات والوصف' : 'Specifications & Description'}</h3>
                <p className="text-text font-medium leading-relaxed whitespace-pre-wrap">{description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Action Card */}
        <div className="md:col-span-1">
          <div className="bg-surface-card border-2 border-border-strong p-6 sticky top-24 space-y-6">
            
            <div className="space-y-2">
              <p className="text-sm font-bold text-muted uppercase tracking-wider">{isAr ? 'السعر المعروض' : 'Offer Price'}</p>
              {listing.price != null ? (
                <div>
                  <p className="text-3xl font-bold text-primary tabular-nums font-cairo">
                    {Number(listing.price).toLocaleString(isAr ? 'ar' : 'en')} {listing.currency}
                  </p>
                  <p className="text-sm text-muted font-medium mt-1">
                    {isAr ? 'لكل' : 'per'} {listing.unit}
                  </p>
                </div>
              ) : (
                <p className="text-lg font-bold text-muted">
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
                    <p className="text-xs text-muted flex items-center flex-wrap gap-1">
                      {seller.total_deals_completed ? `${seller.total_deals_completed} ${isAr ? 'صفقة مكتملة' : 'deals'}` : (isAr ? 'بائع جديد' : 'New seller')}
                      {seller.rating && (
                        <>
                          <span>·</span>
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{seller.rating}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              {userRole === 'trader' ? (
                <Button className="w-full py-6 text-lg font-bold rounded-none border-2" onClick={() => setShowRfqModal(true)}>
                  {isAr ? 'طلب اقتراح (RFQ)' : 'Express Interest (RFQ)'}
                </Button>
              ) : !userRole ? (
                <Button className="w-full py-6 font-bold rounded-none border-2" variant="outline" onClick={() => router.push(`/${locale}/login`)}>
                  {isAr ? 'سجل الدخول للتواصل' : 'Sign In to Contact'}
                </Button>
              ) : userRole === 'farmer' ? (
                <div className="bg-surface-canvas border-2 border-border-strong p-3 text-center text-sm font-medium text-muted">
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
              <div className="text-center py-8 space-y-3 flex flex-col items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-success mb-2" />
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
