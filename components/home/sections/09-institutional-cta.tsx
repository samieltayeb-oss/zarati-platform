import type { Locale } from '@/lib/i18n/config'

export function InstitutionalCta({ locale, dict }: { locale: Locale; dict: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-32 bg-primary text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/_next/static/media/logo2-transparent.01-62sxipjt9q.png')] bg-center bg-no-repeat bg-[length:120%_auto] opacity-5 pointer-events-none mix-blend-overlay"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-[44px] md:text-[64px] font-bold font-cairo mb-6 leading-tight">
          {isAr ? 'انضم إلى البنية التحتية' : 'Join the Infrastructure'}
        </h2>
        <p className="text-white/80 text-xl md:text-2xl mb-12 font-sans max-w-2xl mx-auto leading-relaxed">
          {isAr ? 'سجل كمزارع، أو كتاجر تجاري، أو اطلب وصولاً مؤسسياً.' : 'Register as Producer, Commercial Trader, or Request Institutional Access.'}
        </p>
        <div className="flex justify-center gap-4">
          <a href={`/${locale}/register`} className="bg-white text-primary px-8 py-4 rounded-sm font-bold text-lg hover:bg-bg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
            {isAr ? 'التسجيل في المنصة' : 'Register Now'}
          </a>
        </div>
      </div>
    </section>
  )
}
