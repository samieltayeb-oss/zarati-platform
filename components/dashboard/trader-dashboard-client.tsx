'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { updateRFQStatus, getRFQContactDetails } from '@/lib/actions/rfq'

interface Inquiry {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  status: string
  message: string | null
  created_at: string
  requested_quantity: number | null
  listings?: { title_en: string, title_ar: string }
  buyer?: { full_name: string, full_name_ar?: string | null }
  seller?: { full_name: string, full_name_ar?: string | null }
}

interface Profile { id: string; full_name: string; full_name_ar?: string | null; role: string }

interface Props {
  locale: string
  profile: Profile
  inquiries: Inquiry[]
}

const STATUS_LABELS: Record<string, { en: string; ar: string; color: string }> = {
  pending: { en: 'Pending', ar: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
  accepted: { en: 'Accepted', ar: 'مقبول', color: 'bg-green-100 text-green-800' },
  rejected: { en: 'Declined', ar: 'مرفوض', color: 'bg-red-100 text-red-700' },
  withdrawn: { en: 'Withdrawn', ar: 'مسحوب', color: 'bg-gray-100 text-gray-600' },
  expired: { en: 'Expired', ar: 'منتهي', color: 'bg-gray-200 text-gray-500' },
  closed: { en: 'Closed', ar: 'مغلق', color: 'bg-blue-100 text-blue-700' },
}

const BUYER_TRANSITIONS: Record<string, string[]> = {
  pending: ['withdrawn'],
  accepted: ['closed'],
}
const SELLER_TRANSITIONS: Record<string, string[]> = {
  pending: ['accepted', 'rejected'],
  accepted: ['closed'],
}

interface ContactInfo { role: string; phone: string | null; email: string; full_name: string }

export function TraderDashboardClient({ locale, profile, inquiries }: Props) {
  const isAr = locale === 'ar'
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [contactMap, setContactMap] = useState<Record<string, ContactInfo>>({})
  const [showAcceptWarning, setShowAcceptWarning] = useState<string | null>(null)

  async function handleStatusChange(inquiryId: string, newStatus: string) {
    if (newStatus === 'accepted') {
      setShowAcceptWarning(inquiryId)
      return
    }
    doStatusChange(inquiryId, newStatus)
  }

  function doStatusChange(inquiryId: string, newStatus: string) {
    setError(null)
    setShowAcceptWarning(null)
    startTransition(async () => {
      const result = await updateRFQStatus(inquiryId, newStatus)
      if (!result.success) setError(result.error)
      else router.refresh()
    })
  }

  async function handleRevealContact(inquiryId: string) {
    startTransition(async () => {
      const result = await getRFQContactDetails(inquiryId)
      if (result.success) {
        setContactMap(m => ({ ...m, [inquiryId]: result }))
      } else {
        setError(result.error)
      }
    })
  }

  const isBuyer = (inq: Inquiry) => inq.buyer_id === profile.id
  const isSeller = (inq: Inquiry) => inq.seller_id === profile.id

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="container py-6 max-w-6xl space-y-6">
      <div className="flex justify-between items-center bg-surface-card border-2 border-border-strong p-4">
        <div>
          <h1 className="text-xl font-bold font-cairo">
            {isAr
              ? `مرحباً، ${profile.full_name_ar ?? profile.full_name}`
              : `Welcome, ${profile.full_name}`}
          </h1>
          <p className="text-muted text-sm">{isAr ? 'لوحة تحكم التاجر - السجل التجاري' : 'Trader Dashboard - Commercial Ledger'}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/${locale}/marketplace`)} className="font-bold border-2 rounded-none bg-primary text-white">
            {isAr ? 'تصفح السوق' : 'Browse Marketplace'}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/${locale}/auth/signout`)} className="font-bold border-2 rounded-none">
            {isAr ? 'خروج' : 'Sign Out'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 font-bold text-sm">{error}</div>
      )}

      {/* Accept Warning Modal */}
      {showAcceptWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border-2 border-border-strong p-6 max-w-md w-full space-y-4 shadow-xl" dir={isAr ? 'rtl' : 'ltr'}>
            <h3 className="font-bold text-lg">{isAr ? 'تأكيد القبول وإظهار معلومات التواصل' : 'Confirm Acceptance & Reveal Contact'}</h3>
            <p className="text-sm text-muted font-medium leading-relaxed">
              {isAr
                ? 'قبول هذا الطلب يتيح للطرفين رؤية معلومات الاتصال للتفاوض خارج المنصة. هذا ليس عقداً ملزماً قانونياً.'
                : 'Accepting this inquiry allows both parties to view contact details to negotiate off-platform. This is not a legally binding contract.'}
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowAcceptWarning(null)} className="flex-1 border-2 rounded-none font-bold">
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={() => doStatusChange(showAcceptWarning, 'accepted')} disabled={isPending} className="flex-1 border-2 rounded-none font-bold bg-primary text-white">
                {isAr ? 'تأكيد' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RFQ List Matrix */}
      <div className="bg-surface-card border-2 border-border-strong p-6">
        <h2 className="text-2xl font-bold font-cairo mb-6">{isAr ? 'سجل التفاوض والطلبات (RFQ)' : 'Negotiation & RFQ Ledger'}</h2>
        
        {inquiries.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border-strong bg-surface-canvas">
            <p className="text-muted font-bold mb-4">{isAr ? 'لا توجد طلبات في سجلك.' : 'No inquiries in your ledger.'}</p>
            <Button size="sm" onClick={() => router.push(`/${locale}/marketplace`)} className="font-bold border-2 rounded-none">
              {isAr ? 'تصفح السوق وبدء التفاوض' : 'Browse Marketplace to Negotiate'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map(inq => {
              const statusInfo = STATUS_LABELS[inq.status] ?? { en: inq.status, ar: inq.status, color: 'bg-gray-100 text-gray-800' }
              const amBuyer = isBuyer(inq)
              const amSeller = isSeller(inq)
              const transitions = amBuyer ? BUYER_TRANSITIONS[inq.status] : amSeller ? SELLER_TRANSITIONS[inq.status] : []
              const contact = contactMap[inq.id]
              const canRevealContact = (inq.status === 'accepted' || inq.status === 'closed') && !contact
              
              // Extract names safely
              const listingTitle = inq.listings ? (isAr ? inq.listings.title_ar : inq.listings.title_en) : (isAr ? 'سلعة غير معروفة' : 'Unknown Commodity')
              const counterpartName = amBuyer 
                ? (inq.seller ? (isAr ? (inq.seller.full_name_ar || inq.seller.full_name) : inq.seller.full_name) : (isAr ? 'بائع مجهول' : 'Unknown Seller'))
                : (inq.buyer ? (isAr ? (inq.buyer.full_name_ar || inq.buyer.full_name) : inq.buyer.full_name) : (isAr ? 'مشتري مجهول' : 'Unknown Buyer'))

              return (
                <div key={inq.id} className="border-2 border-border-strong bg-surface-elevated overflow-hidden">
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border-b-2 border-border-strong bg-surface-canvas">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-0.5 border-2 border-current ${statusInfo.color.split(' ')[1]} ${statusInfo.color}`}>
                        {isAr ? statusInfo.ar : statusInfo.en}
                      </span>
                      <span className="font-mono text-xs text-muted uppercase tracking-wider">{inq.id.split('-')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <span className="text-muted">{amBuyer ? (isAr ? 'مرسل إلى:' : 'Sent To:') : (isAr ? 'مستلم من:' : 'Received From:')}</span>
                      <span className="text-text">{counterpartName}</span>
                    </div>
                  </div>

                  {/* Data Matrix */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold font-cairo text-primary hover:underline cursor-pointer" onClick={() => router.push(`/${locale}/marketplace/${inq.listing_id}`)}>
                          {listingTitle}
                        </h3>
                        <p className="text-sm font-bold text-muted tabular-nums mt-1">
                          {isAr ? 'الكمية المطلوبة:' : 'Requested Qty:'} <span className="text-text">{inq.requested_quantity || '—'}</span>
                        </p>
                      </div>
                      
                      {inq.message && (
                        <div className="bg-surface-canvas p-3 border-l-4 border-primary text-sm font-medium">
                          <p className="text-muted mb-1 text-xs uppercase font-bold">{isAr ? 'الرسالة' : 'Message'}</p>
                          {inq.message}
                        </div>
                      )}

                      {/* Contact reveal (escrow) */}
                      {contact ? (
                        <div className="bg-status-verified/10 border-2 border-status-verified p-4">
                          <p className="font-bold text-status-verified mb-2 flex items-center gap-2">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                            {isAr ? 'تم كشف بيانات الاتصال' : 'Contact Details Revealed'}
                          </p>
                          <div className="space-y-1 text-sm font-bold">
                            <p>{contact.full_name}</p>
                            {contact.phone && <p className="font-mono tabular-nums text-lg">{contact.phone}</p>}
                            <p className="text-muted">{contact.email}</p>
                          </div>
                        </div>
                      ) : (inq.status === 'pending') ? (
                        <div className="bg-surface-canvas border-2 border-border-strong p-3 text-sm font-bold text-muted flex items-center gap-2">
                          <span className="text-xl">⚫</span> {isAr ? 'تفاصيل الاتصال مخفية (في انتظار القبول)' : 'Contact Hidden (Pending Acceptance)'}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-end gap-3 md:border-s-2 border-border-strong md:ps-6">
                      {canRevealContact && (
                        <Button onClick={() => handleRevealContact(inq.id)} disabled={isPending} className="w-full border-2 rounded-none font-bold bg-primary text-white">
                          {isAr ? 'عرض معلومات التواصل' : 'Reveal Contact Info'}
                        </Button>
                      )}
                      {transitions?.map(next => (
                        <Button
                          key={next}
                          variant={next === 'accepted' ? 'primary' : 'outline'}
                          disabled={isPending}
                          onClick={() => handleStatusChange(inq.id, next)}
                          className={`w-full border-2 rounded-none font-bold ${next === 'accepted' ? 'bg-status-verified text-white hover:bg-status-verified/90' : ''}`}
                        >
                          {STATUS_LABELS[next] ? (isAr ? STATUS_LABELS[next].ar : STATUS_LABELS[next].en) : next}
                        </Button>
                      ))}
                    </div>
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
