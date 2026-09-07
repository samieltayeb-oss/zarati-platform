import Image from 'next/image'
import type { Locale } from '@/lib/i18n/config'

export function InstitutionalCta({ locale, dict }: { locale: Locale; dict: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-32 bg-[#061D38] text-white text-center relative overflow-hidden">
      <Image
        src="/images/zarati/institutional/strategic-grain-silos.jpg"
        alt={isAr ? 'صوامع تخزين الحبوب الاستراتيجية في القضارف بالسودان' : 'Strategic grain storage silos in Gedaref, Sudan'}
        fill
        sizes="100vw"
        className="object-cover opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#061D38] via-[#061D38]/70 to-[#061D38]/90 pointer-events-none"></div>
      
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
