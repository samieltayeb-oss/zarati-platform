import Image from 'next/image'
import { SudanMap } from '@/components/maps/SudanMap'
import { SudanBadge } from '@/components/brand/sudan-badge'
import type { Locale } from '@/lib/i18n/config'

export default async function GeographyPreviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isAr = lang === 'ar'
  const locale = lang as Locale

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="container py-24 max-w-6xl space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <SudanBadge lang={locale} variant="header" className="text-[11px]" />
          <span className="bg-primary/10 text-primary border-2 border-primary px-3 py-1 text-xs font-bold uppercase tracking-wider font-mono">
            INFORMATIONAL
          </span>
        </div>
        <h1 className="text-display-md font-bold font-cairo">
          {isAr ? 'الجغرافيا السياسية والزراعية' : 'Agricultural Geography'}
        </h1>
        <p className="text-lg text-muted max-w-3xl font-medium leading-relaxed">
          {isAr
            ? 'هذه الوحدة تقدم نظرة استرشادية لقطاعات الإنتاج الأساسية وأقاليم السودان الزراعية.'
            : 'This module presents an informational overview of the primary production sectors and agro-ecological belts.'}
        </p>
      </div>

      <div className="bg-surface-canvas border-2 border-border-strong p-4 md:p-8 relative">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
           <div className="bg-surface-card border-2 border-border-strong p-6 max-w-sm text-center shadow-2xl">
             <h3 className="font-bold text-xl font-cairo mb-2">{isAr ? 'قريباً في التحديث القادم' : 'Coming in Next Phase'}</h3>
             <p className="text-muted text-sm font-medium">
               {isAr 
                 ? 'سيتم تفعيل الطبقات التفاعلية (المطرية والمروية) قريباً.' 
                 : 'Interactive layers (Rainfed & Irrigated) will be activated soon.'}
             </p>
           </div>
        </div>
        <div className="opacity-60 grayscale-[50%] h-[500px] w-full">
          <SudanMap lang={lang as 'en' | 'ar'} />
        </div>
      </div>

      {/* Ground Landscape Reality Pairing */}
      <div className="space-y-6 pt-4">
        <div className="border-b border-border pb-3">
          <h2 className="text-2xl font-bold font-cairo text-text">
            {isAr ? 'الواقع الميداني للأقاليم الإنتاجية' : 'Production Landscapes & Agro-Ecological Belts'}
          </h2>
          <p className="text-sm text-muted">
            {isAr ? 'توثيق فوتوغرافي لطبيعة التضاريس والتربة في الأحزمة الزراعية بالسودان' : 'Ground-level photographic documentation across Sudan’s distinct soil and terrain systems'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface border border-border-strong rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative aspect-[16/10] w-full bg-muted/20">
              <Image
                src="/images/zarati/geography/riverine-floodplain-landscape.jpg"
                alt={isAr ? 'حوض النيل والأراضي الزراعية الفيضية الخصبة في السودان' : 'Nile basin fertile riverine floodplain agricultural landscape in Sudan'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-primary font-bold uppercase block mb-1">
                  {isAr ? 'الحزام النهري المروي' : 'RIVERINE IRRIGATED BELT'}
                </span>
                <h3 className="font-bold font-cairo text-xl text-text mb-2">
                  {isAr ? 'السهول الفيضية لنهر النيل الأزرق والنيل الرئيسي' : 'Blue Nile & Main Nile Riverine Floodplains'}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {isAr 
                    ? 'أراضٍ طميية عالية الخصوبة تمتد بمحاذاة مجرى النهرين، تدعم الزراعة المروية الكثيفة ومحاصيل الحبوب والخضروات.' 
                    : 'Deep alluvial silt floodplains along the river system supporting intensive irrigation schemes, winter cereals, and orchard crops.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border-strong rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative aspect-[16/10] w-full bg-muted/20">
              <Image
                src="/images/zarati/hero/gedaref-fertile-plains.jpg"
                alt={isAr ? 'سهول القضارف الطينية الشاسعة للزراعة المطرية بالسودان' : 'Vast fertile clay vertisol plains in Gedaref rainfed belt, Sudan'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-warning font-bold uppercase block mb-1">
                  {isAr ? 'حزام السهول الطينية المطرية' : 'RAINFED CLAY VERTISOL BELT'}
                </span>
                <h3 className="font-bold font-cairo text-xl text-text mb-2">
                  {isAr ? 'سهول القضارف والنيل الأزرق الطينية المتشققة' : 'Gedaref & Blue Nile Cracking Clay Plains'}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {isAr 
                    ? 'سهول طينية سوداء ثقيلة تمتد لملايين الأفدنة، تشكل سلة الحبوب والسمسم الكبرى في السودان عبر الزراعة الآلية.' 
                    : 'Expansive heavy vertisol clay plains spanning millions of feddans, forming Sudan’s national granary for sorghum and sesame.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
