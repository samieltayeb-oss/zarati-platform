import type { Locale } from '@/lib/i18n/config'
export function InstitutionalCta({ locale, dict }: { locale: Locale; dict: any }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-20 bg-primary text-white text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-display-lg font-bold font-cairo mb-6">
          {isAr ? 'انضم إلى البنية التحتية' : 'Join the Infrastructure'}
        </h2>
        <p className="text-white/90 text-lg mb-8 font-sans">
          {isAr ? 'سجل كمزارع، أو كتاجر معتمد، أو اطلب وصولاً مؤسسياً.' : 'Register as Producer, Certified Trader, or Request Institutional Intelligence Access.'}
        </p>
        <div className="flex justify-center gap-4">
          <a href={`/${locale}/register`} className="bg-white text-primary px-6 py-3 rounded-lg font-bold">
            {isAr ? 'تسجيل جديد' : 'Register Now'}
          </a>
        </div>
      </div>
    </section>
  )
}
