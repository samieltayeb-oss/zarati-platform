import Image from 'next/image'
import type { Locale } from '@/lib/i18n/config'

import { SudanBadge } from '@/components/brand/sudan-badge'

export function AgriculturalGeography({ locale }: { locale: Locale; dict?: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-24 md:py-32 border-b border-border bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-muted block">04 / {isAr ? 'الجغرافيا' : 'Geography'}</span>
              <span className="text-muted/40">·</span>
              <SudanBadge lang={locale} variant="compact" />
            </div>
            <h2 className="text-[40px] md:text-[52px] font-bold font-cairo leading-tight text-text mb-6">
              {isAr ? 'أحزمة الإنتاج الزراعي' : 'Agricultural Production Belts'}
            </h2>
            <p className="text-muted text-lg font-sans mb-8 leading-relaxed">
              {isAr 
                ? 'استكشاف التوزيع المكاني للمحاصيل عبر المناطق المناخية في السودان، مع التركيز على مراكز الجملة.'
                : 'Exploring the spatial distribution of commodities across Sudan’s climatic zones, focusing on primary wholesale nodes.'}
            </p>
            <a href={`/${locale}/geography`} className="inline-flex items-center justify-center border border-border-strong px-6 py-2.5 rounded-sm text-sm font-bold bg-surface hover:border-primary hover:text-primary transition-colors">
              {isAr ? 'عرض الجغرافيا الزراعية' : 'View Agricultural Geography'}
            </a>
          </div>
          <div className="md:w-1/2 w-full">
            {/* Real Landscape + Spatial Node Overlay */}
            <div className="aspect-video bg-surface border border-border-strong rounded-md relative overflow-hidden shadow-sm">
              <Image
                src="/images/zarati/hero/gedaref-fertile-plains.jpg"
                alt={isAr ? 'سهول القضارف الزراعية للإنتاج المطري' : 'Gedaref agricultural fertile rainfed plains'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded border border-white/20 font-bold">
                    {isAr ? 'معاينة هيكلية أحزمة الإنتاج' : 'PRODUCTION BELT ARCHITECTURE'}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 font-bold bg-black/50 px-2 py-0.5 rounded border border-amber-300/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    {isAr ? 'معاينة (R4 مخطط)' : 'PREVIEW (R4 PLANNED)'}
                  </span>
                </div>
                
                <div className="bg-black/70 backdrop-blur-md border border-white/15 p-4 rounded-md">
                  <div className="flex justify-between items-center text-xs text-white/90">
                    <span className="font-bold font-cairo">{isAr ? 'حزام الإنتاج المطري الشرقي' : 'Eastern Rainfed Belt'}</span>
                    <span className="font-mono text-amber-200 font-bold">{isAr ? '١٤ مليون فدان (تقدير مساحي)' : '14M Feddans (Spatial Estimate)'}</span>
                  </div>
                  <div className="text-[11px] text-white/70 mt-1">
                    {isAr ? 'القضارف، سنار، الدمازين — الذرة والسمسم وزهرة الشمس' : 'Gedaref, Sennar, Damazine — Sorghum, Sesame, Sunflower'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
