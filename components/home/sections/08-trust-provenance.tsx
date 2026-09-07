import type { Locale } from '@/lib/i18n/config'

export function TrustProvenance({ locale }: { locale: Locale; dict?: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-24 md:py-32 border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-[11px] font-mono tracking-widest uppercase text-muted mb-4 block">05 / {isAr ? 'النزاهة' : 'Integrity'}</span>
          <h2 className="text-[40px] md:text-[52px] font-bold font-cairo leading-tight text-text mb-4">
            {isAr ? 'الثقة ومصادر البيانات' : 'Trust & Provenance'}
          </h2>
          <p className="text-muted text-lg font-sans">
            {isAr 
              ? 'بروتوكولات الشفافية المعيارية للتبادل التجاري وإفصاح المصادر.' 
              : 'Standardized transparency protocols for commercial exchange and source disclosure.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-border-strong rounded-md p-8 bg-bg">
            <h3 className="font-bold font-cairo text-xl mb-4">{isAr ? 'بروتوكول الإفصاح المتبادل' : 'Bilateral Reveal Protocol'}</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              {isAr ? 'حماية تامة لهوية المزارعين والتجار حتى يتم تبادل القبول. لا يتم كشف أرقام الهواتف أو التفاصيل الدقيقة علناً.' : 'Total identity protection for producers and traders until mutual acceptance. Phone numbers and exact details are never public.'}
            </p>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-[10px] font-mono tracking-widest bg-surface border border-border-strong rounded-sm text-text">SSMO ALIGNED</span>
              <span className="px-2.5 py-1 text-[10px] font-mono tracking-widest bg-surface border border-border-strong rounded-sm text-text">R2 SECURED</span>
            </div>
          </div>
          
          <div className="border border-border-strong rounded-md p-8 bg-bg">
            <h3 className="font-bold font-cairo text-xl mb-4">{isAr ? 'سلامة البيانات' : 'Data Integrity'}</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              {isAr ? 'جميع المعلومات المعروضة يتم فلترتها لضمان الجودة، مع دعم مستقبلي لمعايير منظمة الأغذية والزراعة (FAO) وغيرها من المصادر المفتوحة.' : 'All displayed information is strictly filtered for quality, with planned support for FAO standards and open data pipelines.'}
            </p>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-[10px] font-mono tracking-widest bg-surface border border-border-strong rounded-sm text-text">WFP VAM (PLANNED)</span>
              <span className="px-2.5 py-1 text-[10px] font-mono tracking-widest bg-surface border border-border-strong rounded-sm text-text">ESA SENTINEL (VISION)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
