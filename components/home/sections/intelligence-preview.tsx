import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getIntelligenceOverview } from '@/lib/services/intelligence';
import { dict as intDict } from '@/lib/i18n/intelligence-dict';
import { ArrowRight, BarChart3, Cloud } from 'lucide-react';

export async function IntelligencePreview({ locale }: { locale: Locale }) {
  const overview = await getIntelligenceOverview();
  const t = intDict[locale] || intDict.en;
  const isAr = locale === 'ar';
  
  return (
    <section className="py-24 bg-surface-canvas border-y border-border-strong relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-primary/5 pattern-grid pointer-events-none" />
      
      <div className="container relative max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-display-sm font-bold text-text font-cairo">
              {t.sudanAgriIntel}
            </h2>
            <p className="text-lg text-muted font-medium">
              {t.sudanAgriIntelDesc}
            </p>
          </div>
          
          <Link 
            href={`/${locale}/intelligence`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-primary-inverse font-bold rounded-lg transition-colors group whitespace-nowrap"
          >
            {t.exploreIntel}
            <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-elevated border border-border-subtle p-8 rounded-2xl flex flex-col justify-between group hover:border-primary/50 transition-colors">
            <div className="mb-8">
              <BarChart3 className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold text-text mb-2">{t.publishedObs}</h3>
              <p className="text-sm text-muted">{t.wfpDesc}</p>
            </div>
            <div className="text-4xl font-bold text-text font-mono">
              {overview.totalPublished.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-surface-elevated border border-border-subtle p-8 rounded-2xl flex flex-col justify-between group hover:border-primary/50 transition-colors">
            <div className="mb-8">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-muted text-muted mb-4 font-mono font-bold text-xs border border-border-strong">R4-C</div>
              <h3 className="text-xl font-bold text-text mb-2">{t.trackedComms}</h3>
              <p className="text-sm text-muted">{t.zaratiDesc}</p>
            </div>
            <div className="text-4xl font-bold text-text font-mono">
              {overview.commoditiesCount.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-surface-elevated border border-border-subtle p-8 rounded-2xl flex flex-col justify-between group hover:border-info/50 transition-colors">
            <div className="mb-8">
              <Cloud className="w-8 h-8 text-info mb-4" />
              <h3 className="text-xl font-bold text-text mb-2">{t.weather}</h3>
              <p className="text-sm text-muted">{t.metDesc}</p>
            </div>
            <div className="text-lg font-semibold text-text">
              {t.pilotLoc}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
