import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PosterModal } from '@/components/brand/poster-modal'
import { SudanBadge } from '@/components/brand/sudan-badge'
import type { Locale } from '@/lib/i18n/config'

interface SovereignPostersShowcaseProps {
  locale: Locale
  dict?: unknown
}

export function SovereignPostersShowcase({ locale }: SovereignPostersShowcaseProps) {
  const isAr = locale === 'ar'
  const Arrow = isAr ? ArrowLeft : ArrowRight

  const posters = [
    {
      id: 'our-land',
      src: '/images/zarati/posters/poster-1-our-land.png',
      alt: isAr
        ? 'بوستر زرعتي: أرضنا .. غذاؤنا .. مستقبلنا'
        : 'ZARATI Poster: Our Land .. Our Food .. Our Future',
      tagAr: '01 / السيادة والأرض',
      tagEn: '01 / SOVEREIGN LAND',
      titleAr: 'أرضنا .. غذاؤنا .. مستقبلنا',
      titleEn: 'Our Land .. Our Food .. Our Future',
      descAr:
        'منصة ذكية تربط المزارعين والتجار والمؤسسات لبناء قطاع زراعي أكثر إنتاجية واستدامة في السودان.',
      descEn:
        'A smart platform connecting farmers, traders, and institutions to build a more productive and sustainable agricultural sector in Sudan.',
      href: `/${locale}/about`,
      linkTextAr: 'عن الرؤية الوطنية',
      linkTextEn: 'Sovereign Purpose',
    },
    {
      id: 'data-today',
      src: '/images/zarati/posters/poster-2-data-today.png',
      alt: isAr
        ? 'بوستر زرعتي: بيانات اليوم لحصاد أفضل غدًا'
        : 'ZARATI Poster: Data Today .. A Better Harvest Tomorrow',
      tagAr: '02 / استخبارات البيانات والـ 18 ولاية',
      tagEn: '02 / 18-STATE DATA INFRASTRUCTURE',
      titleAr: 'بيانات اليوم لحصاد أفضل غدًا',
      titleEn: 'Data Today .. Better Harvest Tomorrow',
      descAr:
        'ربط المزارعين والأسواق عبر شاشات القيادة القومية، خريطة الـ 18 ولاية، وتتبع أسعار المحاصيل لحظياً.',
      descEn:
        'Connecting farmers and markets via national command dashboards, 18-state spatial coverage, and live commodity tracking.',
      href: `/${locale}/intelligence`,
      linkTextAr: 'استخبارات البيانات والولايات',
      linkTextEn: 'Data Intelligence',
    },
    {
      id: 'knowledge-today',
      src: '/images/zarati/posters/poster-3-knowledge-today.png',
      alt: isAr
        ? 'بوستر زرعتي: معرفة اليوم لحصاد أفضل غدًا'
        : 'ZARATI Poster: Knowledge Today .. A Stronger Harvest Tomorrow',
      tagAr: '03 / المعرفة الميدانية والمحاصيل',
      tagEn: '03 / CROP KNOWLEDGE & AGRONOMY',
      titleAr: 'معرفة اليوم لحصاد أفضل غدًا',
      titleEn: 'Knowledge Today .. Stronger Harvest',
      descAr:
        'تمكين المزارعين والباحثين بأكثر من 25 محصولاً زراعياً وتحليلات حية لاتجاهات أسواق القضارف وكسلا.',
      descEn:
        'Empowering growers and agronomists across 25+ crop categories with live market trend analytics for Gedaref and Kassala.',
      href: `/${locale}/crops`,
      linkTextAr: 'سجل المحاصيل والمعرفة',
      linkTextEn: 'Sudan Crop Register',
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-[#F4F1EA] border-b border-border-strong relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-strong pb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-muted block">
                {isAr ? 'الركائز الإستراتيجية' : 'STRATEGIC FOUNDATIONS'}
              </span>
              <span className="text-muted/40">·</span>
              <SudanBadge lang={locale} variant="compact" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cairo leading-tight text-text">
              {isAr ? 'الرؤية الثلاثية للسيادة الزراعية' : 'The Sovereign Agricultural Trilogy'}
            </h2>
          </div>
          <p className="text-muted text-base sm:text-lg font-sans max-w-md">
            {isAr
              ? 'ثلاث ركائز تأسيسية لمنظومة زرعتي: هيبة الأرض والسيادة الغذائية، استخبارات البيانات والولايات، والمعرفة الميدانية المستدامة.'
              : 'Three foundational pillars uniting Zarati: sovereign food security, 18-state data telemetry, and sustainable agronomic knowledge.'}
          </p>
        </div>

        {/* 3 Posters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {posters.map((poster, index) => (
            <div
              key={poster.id}
              className="flex flex-col bg-white border border-border-strong rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Poster Image with Lightbox Modal */}
              <div className="p-3 sm:p-4 bg-[#0a160d]">
                <PosterModal
                  src={poster.src}
                  alt={poster.alt}
                  title={isAr ? poster.titleAr : poster.titleEn}
                  priority={index === 0}
                  className="rounded-xl border border-white/15"
                />
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-primary font-bold uppercase block mb-2">
                    {isAr ? poster.tagAr : poster.tagEn}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-cairo text-text mb-3 leading-snug">
                    {isAr ? poster.titleAr : poster.titleEn}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-6 font-sans">
                    {isAr ? poster.descAr : poster.descEn}
                  </p>
                </div>

                {/* Footer Action Link */}
                <div className="border-t border-border pt-4 mt-auto">
                  <Link
                    href={poster.href}
                    className="inline-flex items-center justify-between w-full text-sm font-bold font-cairo text-primary hover:text-primary-dark transition-colors group"
                  >
                    <span>{isAr ? poster.linkTextAr : poster.linkTextEn}</span>
                    <span className="w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-200">
                      <Arrow className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}