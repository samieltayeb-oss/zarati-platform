import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'

interface FutureVisionDict {
  title: string
  subtitle: string
  availableToday: string
  roadmapTitle: string
  roadmapNote: string
  live: string
  phase2Label: string
  phase3Label: string
  phase4Label: string
}

interface Props {
  lang: Locale
  dict: FutureVisionDict
}

export function FutureVision({ lang, dict }: Props) {
  const isAr = lang === 'ar'

  const activeModules = [
    {
      id: 'marketplace',
      emoji: '🛒',
      labelEn: 'Marketplace',
      labelAr: 'السوق الزراعي',
      descEn: 'Buy and sell crops, equipment, seeds, and fertilizer',
      descAr: 'اشترِ وبِع المحاصيل والمعدات والبذور والأسمدة',
      path: `/${lang}/marketplace`,
    },
    {
      id: 'weather',
      emoji: '🌤️',
      labelEn: 'Weather Intelligence',
      labelAr: 'معلومات الطقس',
      descEn: "Agricultural weather for Sudan's key farming regions",
      descAr: 'أحوال الطقس الزراعي في المناطق الرئيسية بالسودان',
      path: `/${lang}/weather`,
    },
    {
      id: 'crops',
      emoji: '📊',
      labelEn: 'Crop Prices',
      labelAr: 'أسعار المحاصيل',
      descEn: 'Real-time prices from markets across Sudan',
      descAr: 'أسعار آنية من أسواق السودان',
      path: `/${lang}/crops`,
    },
    {
      id: 'dashboard',
      emoji: '🌾',
      labelEn: 'Farmer Dashboard',
      labelAr: 'لوحة المزرعة',
      descEn: 'Your farm operations and market movements at a glance',
      descAr: 'عمليات مزرعتك وتحركات السوق في لمحة',
      path: `/${lang}/overview`,
    },
  ]

  const roadmapModules = [
    {
      id: 'ai-advisor',
      emoji: '🤖',
      labelEn: 'AI Agricultural Advisor',
      labelAr: 'المستشار الزراعي الذكي',
      descEn: 'Personalised AI recommendations for planting, pests, and market timing',
      descAr: 'توصيات ذكاء اصطناعي مخصصة للزراعة والآفات وتوقيت البيع',
      phase: dict.phase2Label,
    },
    {
      id: 'financing',
      emoji: '💰',
      labelEn: 'Financing & Microloans',
      labelAr: 'التمويل والقروض الصغيرة',
      descEn: 'Access microloans and agricultural financing for your farm',
      descAr: 'احصل على القروض الصغيرة والتمويل الزراعي لمزرعتك',
      phase: dict.phase3Label,
    },
    {
      id: 'ngo',
      emoji: '🤝',
      labelEn: 'NGO Portal',
      labelAr: 'بوابة المنظمات',
      descEn: "Coordination tools for NGOs supporting Sudan's farmers",
      descAr: 'أدوات تنسيق للمنظمات الداعمة لمزارعي السودان',
      phase: dict.phase4Label,
    },
    {
      id: 'government',
      emoji: '🏛️',
      labelEn: 'Government Portal',
      labelAr: 'البوابة الحكومية',
      descEn: 'National agricultural data, analytics, and policy tools',
      descAr: 'البيانات الزراعية الوطنية والتحليلات وأدوات السياسات',
      phase: dict.phase4Label,
    },
  ]

  return (
    <section className="py-20 sm:py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-3">{dict.title}</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">{dict.subtitle}</p>
        </div>

        {/* Group A — Available Today */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-text uppercase tracking-wider">
              {dict.availableToday}
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {activeModules.map((m) => (
              <Link key={m.id} href={m.path} className="group block">
                <div className="rounded-2xl border border-primary/20 bg-surface p-5 h-full
                               hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5
                               transition-all duration-200">
                  <div className="text-3xl mb-3">{m.emoji}</div>
                  <div className="text-sm font-semibold text-text mb-1.5 leading-snug">
                    {isAr ? m.labelAr : m.labelEn}
                  </div>
                  <p className="text-xs text-muted leading-relaxed mb-4">
                    {isAr ? m.descAr : m.descEn}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-green-600">{dict.live}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-bg px-4 text-xs text-muted uppercase tracking-widest font-medium">
              {dict.roadmapTitle}
            </span>
          </div>
        </div>

        {/* Group B — Future Roadmap */}
        <div className="mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmapModules.map((m) => (
              <div key={m.id}
                className="rounded-2xl border border-border bg-surface/60 p-5 h-full">
                <div className="text-3xl mb-3 opacity-60">{m.emoji}</div>
                <div className="text-sm font-semibold text-text/80 mb-1.5 leading-snug">
                  {isAr ? m.labelAr : m.labelEn}
                </div>
                <p className="text-xs text-muted/80 leading-relaxed mb-4">
                  {isAr ? m.descAr : m.descEn}
                </p>
                <span className="inline-flex items-center rounded-full border border-navy/20
                                 bg-navy/5 px-2.5 py-0.5 text-xs font-medium text-navy/60">
                  {m.phase}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap note */}
        <p className="text-center text-sm text-muted/70 mt-6">{dict.roadmapNote}</p>
      </div>
    </section>
  )
}
