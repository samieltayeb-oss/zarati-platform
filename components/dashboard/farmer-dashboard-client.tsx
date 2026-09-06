'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createListing, updateListingStatus } from '@/lib/actions/listings'

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

const STATUS_LABELS: Record<string, { en: string; ar: string; color: string }> = {
  draft: { en: 'Draft', ar: 'مسودة', color: 'bg-gray-100 text-gray-700' },
  pending_review: { en: 'Under Review', ar: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800' },
  active: { en: 'Active', ar: 'نشط', color: 'bg-green-100 text-green-800' },
  paused: { en: 'Paused', ar: 'موقوف', color: 'bg-blue-100 text-blue-800' },
  sold: { en: 'Sold', ar: 'مباع', color: 'bg-purple-100 text-purple-700' },
  archived: { en: 'Archived', ar: 'مؤرشف', color: 'bg-gray-200 text-gray-600' },
  expired: { en: 'Expired', ar: 'منتهي', color: 'bg-red-100 text-red-700' },
}

const FARMER_TRANSITIONS: Record<string, string[]> = {
  draft: ['pending_review', 'archived'],
  active: ['paused', 'sold', 'archived'],
  paused: ['active', 'archived'],
}

type FormStep = 1 | 2 | 3 | 4

export function FarmerDashboardClient({ locale, profile, listings, states }: Props) {
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
    startTransition(async () => {
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
      if (result.success) {
        setSuccess(isAr ? 'تم إنشاء الإعلان بنجاح! سيراجعه الفريق قريباً.' : 'Listing created! It will be reviewed shortly.')
        setShowForm(false)
        setFormStep(1)
        router.refresh()
      } else {
        setError(result.error)
      }
    })
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
    <div dir={isAr ? 'rtl' : 'ltr'} className="container py-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isAr
              ? `مرحباً، ${profile.full_name_ar ?? profile.full_name}`
              : `Welcome, ${profile.full_name}`}
          </h1>
          <p className="text-muted text-sm">{isAr ? 'لوحة تحكم المزارع' : 'Farmer Dashboard'}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => { setShowForm(!showForm); setError(null); setSuccess(null) }}>
            {showForm
              ? (isAr ? 'إلغاء' : 'Cancel')
              : (isAr ? '+ إضافة إعلان' : '+ Add Listing')}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/${locale}/auth/signout`)}>
            {isAr ? 'تسجيل الخروج' : 'Sign Out'}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {/* Listing Creation Form */}
      {showForm && (
        <div className="bg-surface border rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold">
            {isAr ? `إضافة إعلان — الخطوة ${formStep} من 4` : `Add Listing — Step ${formStep} of 4`}
          </h2>

          {formStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{isAr ? 'الفئة' : 'Category'}</label>
                <select
                  value={form.category}
                  onChange={e => updateForm('category', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-background"
                >
                  {[['crops', isAr ? 'المحاصيل' : 'Crops'],
                    ['equipment', isAr ? 'المعدات' : 'Equipment'],
                    ['seeds', isAr ? 'البذور' : 'Seeds'],
                    ['fertilizer', isAr ? 'الأسمدة' : 'Fertilizer']].map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isAr ? 'الولاية' : 'State'}</label>
                <select
                  value={form.state_id}
                  onChange={e => updateForm('state_id', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-background"
                >
                  <option value="">{isAr ? '— اختر الولاية —' : '— Select state —'}</option>
                  {states.map(s => (
                    <option key={s.id} value={s.id}>{isAr ? s.name_ar : s.name_en}</option>
                  ))}
                </select>
              </div>
              <Button onClick={() => setFormStep(2)} className="w-full">
                {isAr ? 'التالي' : 'Next'}
              </Button>
            </div>
          )}

          {formStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{isAr ? 'الكمية' : 'Quantity'}</label>
                  <Input type="number" min="0" value={form.quantity} onChange={e => updateForm('quantity', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{isAr ? 'الوحدة' : 'Unit'}</label>
                  <Input placeholder={isAr ? 'مثال: طن، كيس' : 'e.g. ton, sack'} value={form.unit} onChange={e => updateForm('unit', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{isAr ? 'متاح من' : 'Available From'}</label>
                  <Input type="date" value={form.available_from} onChange={e => updateForm('available_from', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{isAr ? 'متاح حتى' : 'Available Until'}</label>
                  <Input type="date" value={form.available_until} onChange={e => updateForm('available_until', e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setFormStep(1)}>{isAr ? 'رجوع' : 'Back'}</Button>
                <Button onClick={() => setFormStep(3)} className="flex-1">{isAr ? 'التالي' : 'Next'}</Button>
              </div>
            </div>
          )}

          {formStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}</label>
                <Input dir="rtl" value={form.title_ar} onChange={e => updateForm('title_ar', e.target.value)} placeholder="مثال: ذرة رفيعة ٥٠ طن" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isAr ? 'العنوان (إنجليزي)' : 'Title (English)'}</label>
                <Input value={form.title_en} onChange={e => updateForm('title_en', e.target.value)} placeholder="e.g. Sorghum 50 Tons" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {isAr ? 'السعر (اتركه فارغاً للتفاوض)' : 'Price (leave empty for negotiable)'}
                </label>
                <Input type="number" min="0.01" step="any" value={form.price} onChange={e => updateForm('price', e.target.value)}
                  placeholder={isAr ? 'تواصل لمعرفة السعر' : 'Contact for price'} />
                <p className="text-xs text-muted mt-1">
                  {isAr ? 'ملاحظة: القيمة صفر غير مقبولة' : 'Note: zero price is not accepted'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setFormStep(2)}>{isAr ? 'رجوع' : 'Back'}</Button>
                <Button onClick={() => setFormStep(4 as FormStep)} className="flex-1">{isAr ? 'مراجعة' : 'Review'}</Button>
              </div>
            </div>
          )}

          {formStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-medium">{isAr ? 'مراجعة البيانات' : 'Review Your Listing'}</h3>
              <div className="bg-muted/20 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">{isAr ? 'العنوان' : 'Title'}:</span> <span>{isAr ? form.title_ar : form.title_en}</span></div>
                <div className="flex justify-between"><span className="text-muted">{isAr ? 'الكمية' : 'Qty'}:</span> <span>{form.quantity} {form.unit}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted">{isAr ? 'السعر' : 'Price'}:</span>
                  <span>{form.price ? `${Number(form.price).toLocaleString()} ${form.currency}` : (isAr ? 'تواصل لمعرفة السعر' : 'Contact for price')}</span>
                </div>
              </div>
              <p className="text-xs text-muted">{isAr ? 'سيتم إرسال الإعلان للمراجعة قبل النشر.' : 'Your listing will be reviewed before going live.'}</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setFormStep(3)}>{isAr ? 'رجوع' : 'Back'}</Button>
                <Button onClick={handleSubmitListing} disabled={isPending} className="flex-1">
                  {isPending ? (isAr ? 'جاري الإرسال...' : 'Submitting...') : (isAr ? 'إرسال للمراجعة' : 'Submit for Review')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Listings */}
      <div className="bg-surface border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{isAr ? 'إعلاناتي' : 'My Listings'}</h2>
        {listings.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-muted">{isAr ? 'لا توجد إعلانات بعد.' : 'No listings yet.'}</p>
            <Button size="sm" onClick={() => setShowForm(true)}>
              {isAr ? '+ إضافة أول إعلان' : '+ Add your first listing'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map(listing => {
              const statusInfo = STATUS_LABELS[listing.status] ?? { en: listing.status, ar: listing.status, color: '' }
              const allowed = FARMER_TRANSITIONS[listing.status] ?? []
              return (
                <div key={listing.id} className="border rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="font-medium">{isAr ? listing.title_ar : listing.title_en}</p>
                    <p className="text-sm text-muted">
                      {listing.quantity} {listing.unit}
                      {listing.price != null
                        ? ` · ${Number(listing.price).toLocaleString()} SDG`
                        : ` · ${isAr ? 'تواصل لمعرفة السعر' : 'Contact for price'}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}>
                      {isAr ? statusInfo.ar : statusInfo.en}
                    </span>
                    {allowed.map(next => (
                      <Button
                        key={next}
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => handleStatusChange(listing.id, next)}
                      >
                        {STATUS_LABELS[next] ? (isAr ? STATUS_LABELS[next].ar : STATUS_LABELS[next].en) : next}
                      </Button>
                    ))}
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
