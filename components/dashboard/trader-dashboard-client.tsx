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
    <div dir={isAr ? 'rtl' : 'ltr'} className="container py-10 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isAr
              ? `مرحباً، ${profile.full_name_ar ?? profile.full_name}`
              : `Welcome, ${profile.full_name}`}
          </h1>
          <p className="text-muted text-sm">{isAr ? 'لوحة تحكم التاجر' : 'Trader Dashboard'}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push(`/${locale}/marketplace`)}>
            {isAr ? 'تصفح السوق' : 'Browse Marketplace'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Accept Warning Modal */}
      {showAcceptWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl border p-6 max-w-md w-full space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
            <h3 className="font-semibold text-lg">{isAr ? 'تأكيد القبول' : 'Confirm Acceptance'}</h3>
            <p className="text-sm text-muted leading-relaxed">
              {isAr
                ? 'قبول هذا الطلب يسمح للطرفين برؤية تفاصيل الاتصال لمواصلة التفاوض خارج المنصة. هذا ليس بيعاً ملزماً.'
                : 'Accepting this inquiry allows both parties to view contact details and continue negotiation off-platform. This is not a binding sale.'}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAcceptWarning(null)} className="flex-1">
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={() => doStatusChange(showAcceptWarning, 'accepted')} disabled={isPending} className="flex-1">
                {isAr ? 'قبول' : 'Accept'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RFQ List */}
      <div className="bg-surface border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{isAr ? 'طلبات الاقتراح (RFQ)' : 'My Inquiries (RFQ)'}</h2>
        {inquiries.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-muted">{isAr ? 'لا توجد طلبات بعد.' : 'No inquiries yet.'}</p>
            <Button size="sm" onClick={() => router.push(`/${locale}/marketplace`)}>
              {isAr ? 'تصفح السوق' : 'Browse Marketplace'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map(inq => {
              const statusInfo = STATUS_LABELS[inq.status] ?? { en: inq.status, ar: inq.status, color: '' }
              const amBuyer = isBuyer(inq)
              const amSeller = isSeller(inq)
              const transitions = amBuyer ? BUYER_TRANSITIONS[inq.status] : amSeller ? SELLER_TRANSITIONS[inq.status] : []
              const contact = contactMap[inq.id]
              const canRevealContact = (inq.status === 'accepted' || inq.status === 'closed') && !contact

              return (
                <div key={inq.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="text-xs text-muted">
                        {amBuyer ? (isAr ? 'أنت المشتري' : 'You are Buyer') : (isAr ? 'أنت البائع' : 'You are Seller')}
                      </p>
                      <p className="text-sm font-mono text-muted">{inq.id.slice(0, 8)}…</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}>
                      {isAr ? statusInfo.ar : statusInfo.en}
                    </span>
                  </div>

                  {inq.message && (
                    <p className="text-sm text-muted border-s-2 border-border ps-3">
                      {inq.message}
                    </p>
                  )}

                  {/* Contact reveal (accepted/closed only) */}
                  {contact && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm space-y-1">
                      <p className="font-medium text-green-800">{isAr ? 'تفاصيل التواصل' : 'Contact Details'}</p>
                      <p>{contact.full_name}</p>
                      {contact.phone && <p>{contact.phone}</p>}
                      <p>{contact.email}</p>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {canRevealContact && (
                      <Button size="sm" onClick={() => handleRevealContact(inq.id)} disabled={isPending}>
                        {isAr ? 'عرض معلومات التواصل' : 'View Contact Info'}
                      </Button>
                    )}
                    {transitions?.map(next => (
                      <Button
                        key={next}
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => handleStatusChange(inq.id, next)}
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
