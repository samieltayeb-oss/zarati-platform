'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createListing, updateListingStatus } from '@/lib/actions/listings'
import { SudanBadge } from '@/components/brand/sudan-badge'

interface Listing {
  id: string
  title_en: string
  title_ar: string
  status: string
  moderation_status: string
  price: number | null
  unit: string
  quantity: number
  category: string
  created_at: string
}

interface Crop { id: string; name_en: string; name_ar: string; category: string }
interface State { id: string; name_en: string; name_ar: string }
interface Profile { id: string; full_name: string; full_name_ar?: string | null; role: string }

interface Props {
  locale: string
  profile: Profile
  listings: Listing[]
  crops: Crop[]
  states: State[]
}

const FARMER_TRANSITIONS: Record<string, string[]> = {
  draft: ['pending_review', 'archived'],
  active: ['paused', 'sold', 'archived'],
  paused: ['active', 'archived'],
}

type FormStep = 1 | 2 | 3 | 4 | 5

export function FarmerDashboardClient({ locale, profile, listings, states, crops }: Props) {
  const isAr = locale === 'ar'
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [formStep, setFormStep] = useState<FormStep>(1)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState({
    category: 'crops' as const,
    crop_id: '',
    state_id: '',
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    quantity: '',
    unit: '',
    available_from: '',
    available_until: '',
    price: '',
    currency: 'SDG' as const,
    location_name_en: '',
    location_name_ar: '',
  })

  function updateForm(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmitListing() {
    setError(null)
    
    // Create listing as draft first
    const result = await createListing({
      category: form.category,
      crop_id: form.crop_id || null,
      state_id: form.state_id || null,
      title_en: form.title_en,
      title_ar: form.title_ar,
      description_en: form.description_en || null,
      description_ar: form.description_ar || null,
      quantity: Number(form.quantity),
      unit: form.unit,
      price: form.price === '' ? null : Number(form.price),
      currency: form.currency,
      location_name_en: form.location_name_en || null,
      location_name_ar: form.location_name_ar || null,
      available_from: form.available_from || null,
      available_until: form.available_until || null,
      farm_id: null,
    })

    if (!result.success) {
      setError(result.error)
      return
    }

    const listingId = result.listingId!

    // Move to pending review
    await updateListingStatus(listingId, 'pending_review')

    setSuccess(isAr ? 'تم إنشاء الإعلان بنجاح! سيراجعه الفريق قريباً.' : 'Listing created! It will be reviewed shortly.')
    setShowForm(false)
    setFormStep(1)
    router.refresh()
  }

  async function handleStatusChange(listingId: string, newStatus: string) {
    setError(null)
    startTransition(async () => {
      const result = await updateListingStatus(listingId, newStatus)
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="container py-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-surface-card border-2 border-border-strong p-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SudanBadge lang={locale === 'ar' ? 'ar' : 'en'} variant="header" className="text-[10px] py-0.5 px-2" />
          </div>
          <h1 className="text-xl font-bold font-cairo">
            {isAr
              ? `مرحباً، ${profile.full_name_ar ?? profile.full_name}`
              : `Welcome, ${profile.full_name}`}
          </h1>
          <p className="text-muted text-sm">{isAr ? 'لوحة تحكم المزارع — تداول وتسليم المحاصيل بالسودان' : 'Farmer Dashboard — Sudan Agricultural Delivery'}</p>
        </div>
        <div className="flex gap-2">
          {!showForm && (
            <Button onClick={() => { setShowForm(true); setError(null); setSuccess(null); setFormStep(1) }} className="font-bold border-2 rounded-none bg-primary text-white">
              {isAr ? '+ عرض محصول جديد' : '+ New Crop Offer'}
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push(`/${locale}/auth/signout`)} className="font-bold border-2 rounded-none">
            {isAr ? 'خروج' : 'Sign Out'}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 font-bold text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-2 border-green-200 text-green-800 p-4 font-bold text-sm">
          {success}
        </div>
      )}

      {/* 3-Tap Flow */}
      {showForm && (
        <div className="bg-surface-card border-2 border-border-strong p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-cairo">
              {formStep === 1 && (isAr ? '1. اختر المحصول' : '1. Select Crop')}
              {formStep === 2 && (isAr ? '2. الكمية والسعر' : '2. Quantity & Price')}
              {formStep === 3 && (isAr ? '3. موقع التسليم' : '3. Delivery Location')}
            </h2>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-muted hover:text-text font-bold">
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>

          {formStep === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {crops.slice(0, 9).map(crop => (
                <button
                  key={crop.id}
                  onClick={() => {
                    updateForm('crop_id', crop.id)
                    updateForm('category', crop.category)
                    updateForm('title_en', crop.name_en)
                    updateForm('title_ar', crop.name_ar)
                    updateForm('unit', 'طن')
                    setFormStep(2)
                  }}
                  className="flex flex-col items-center justify-center p-6 bg-surface-canvas border-2 border-border-strong hover:border-primary hover:bg-primary/5 transition-colors aspect-square gap-3"
                >
                  <div className="w-12 h-12 flex items-center justify-center text-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M12 22C12 22 17 18 17 13C17 9.68629 14.7614 7 12 7C9.23858 7 7 9.68629 7 13C7 18 12 22 12 22Z"/><path d="M12 7V2"/></svg>
                  </div>
                  <span className="font-bold font-cairo text-lg">{isAr ? crop.name_ar : crop.name_en}</span>
                </button>
              ))}
            </div>
          )}

          {formStep === 2 && (
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-bold mb-3">{isAr ? 'الكمية المتوفرة' : 'Available Quantity'}</label>
                <div className="flex gap-4">
                  <Input 
                    type="number" 
                    min="1" 
                    value={form.quantity} 
                    onChange={e => updateForm('quantity', e.target.value)} 
                    className="text-3xl h-16 border-2 border-border-strong rounded-none font-bold tabular-nums" 
                    placeholder="0"
                  />
                  <select 
                    value={form.unit} 
                    onChange={e => updateForm('unit', e.target.value)}
                    className="h-16 px-4 border-2 border-border-strong bg-surface-canvas rounded-none font-bold text-lg"
                  >
                    <option value="طن">{isAr ? 'طن متري' : 'MT'}</option>
                    <option value="قنطار">{isAr ? 'قنطار' : 'Qintar'}</option>
                    <option value="شوال">{isAr ? 'شوال' : 'Sack'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold mb-3">{isAr ? 'السعر المقترح (لكل وحدة)' : 'Proposed Price (Per Unit)'}</label>
                <div className="flex gap-4">
                  <Input 
                    type="number" 
                    min="1" 
                    value={form.price} 
                    onChange={e => updateForm('price', e.target.value)} 
                    className="text-3xl h-16 border-2 border-border-strong rounded-none font-bold tabular-nums" 
                    placeholder={isAr ? 'اتركه فارغاً للتفاوض' : 'Leave empty to negotiate'}
                  />
                  <div className="h-16 px-6 flex items-center bg-surface-elevated border-2 border-border-strong rounded-none font-bold text-lg text-muted">
                    {form.currency}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t-2 border-border-strong">
                <Button variant="outline" onClick={() => setFormStep(1)} className="h-14 px-8 border-2 rounded-none font-bold text-lg">{isAr ? 'رجوع' : 'Back'}</Button>
                <Button onClick={() => { if(form.quantity) setFormStep(3) }} disabled={!form.quantity} className="flex-1 h-14 border-2 rounded-none font-bold text-lg">{isAr ? 'التالي' : 'Next'}</Button>
              </div>
            </div>
          )}

          {formStep === 3 && (
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-bold mb-3">{isAr ? 'مكان تسليم المحصول' : 'Delivery Location'}</label>
                <select
                  value={form.state_id}
                  onChange={e => updateForm('state_id', e.target.value)}
                  className="w-full h-16 px-4 border-2 border-border-strong bg-surface-canvas rounded-none font-bold text-lg"
                >
                  <option value="">{isAr ? '— اختر الولاية —' : '— Select State —'}</option>
                  {states.map(s => (
                    <option key={s.id} value={s.id}>{isAr ? s.name_ar : s.name_en}</option>
                  ))}
                </select>
              </div>

              <div className="bg-surface-canvas border-2 border-border-strong p-4 text-sm font-medium">
                {isAr ? 'سيتم تحويل هذا المحصول إلى السوق فور اعتماده.' : 'This crop will be posted to the marketplace upon approval.'}
              </div>

              <div className="flex gap-4 pt-4 border-t-2 border-border-strong">
                <Button variant="outline" onClick={() => setFormStep(2)} className="h-14 px-8 border-2 rounded-none font-bold text-lg">{isAr ? 'رجوع' : 'Back'}</Button>
                <Button onClick={handleSubmitListing} disabled={isPending || !form.state_id} className="flex-1 h-14 border-2 rounded-none font-bold text-lg bg-status-verified text-white hover:bg-status-verified/90">
                  {isPending ? (isAr ? 'جاري الإرسال...' : 'Submitting...') : (isAr ? 'إرسال ونشر' : 'Submit Offer')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Listings Dashboard (State Machine) */}
      <div className="bg-surface-card border-2 border-border-strong p-6">
        <h2 className="text-2xl font-bold font-cairo mb-6">{isAr ? 'سجل عروض التسليم' : 'Delivery Offers Register'}</h2>
        
        {listings.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border-strong bg-surface-canvas">
            <p className="text-muted font-bold">{isAr ? 'لا توجد أي عروض تسليم مسجلة حالياً.' : 'No delivery offers registered.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map(listing => {
              // Master plan simplification: Active, Pending, Sold
              const simplifiedStatus = listing.status === 'active' ? { label: isAr ? '🟢 متاح في السوق' : '🟢 Available', bg: 'bg-green-100 text-green-900 border-green-300' }
                                     : listing.status === 'sold' ? { label: isAr ? '⚫ تم البيع' : '⚫ Sold', bg: 'bg-gray-200 text-gray-800 border-gray-300' }
                                     : listing.status === 'paused' ? { label: isAr ? '🟡 معلق مؤقتاً' : '🟡 Paused', bg: 'bg-yellow-100 text-yellow-900 border-yellow-300' }
                                     : { label: isAr ? '🟡 قيد المراجعة' : '🟡 Under Review', bg: 'bg-yellow-50 text-yellow-800 border-yellow-200' }
              
              const allowed = FARMER_TRANSITIONS[listing.status] ?? []
              
              return (
                <div key={listing.id} className="border-2 border-border-strong p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-elevated">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg font-cairo">{isAr ? listing.title_ar : listing.title_en}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 border ${simplifiedStatus.bg}`}>
                        {simplifiedStatus.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted font-bold tabular-nums">
                      {listing.quantity} {listing.unit}
                      {listing.price != null && ` · ${Number(listing.price).toLocaleString()} SDG`}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {allowed.includes('sold') && (
                      <Button size="sm" onClick={() => handleStatusChange(listing.id, 'sold')} className="border-2 rounded-none font-bold bg-surface-canvas text-text hover:bg-gray-200">
                        {isAr ? 'تأكيد البيع' : 'Mark Sold'}
                      </Button>
                    )}
                    {allowed.includes('paused') && (
                      <Button size="sm" onClick={() => handleStatusChange(listing.id, 'paused')} variant="outline" className="border-2 rounded-none font-bold">
                        {isAr ? 'إيقاف مؤقت' : 'Pause'}
                      </Button>
                    )}
                    {allowed.includes('active') && (
                      <Button size="sm" onClick={() => handleStatusChange(listing.id, 'active')} className="border-2 rounded-none font-bold bg-primary text-white hover:bg-primary/90">
                        {isAr ? 'إعادة التفعيل' : 'Reactivate'}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
