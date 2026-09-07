import type { Locale } from '@/lib/i18n/config'
import Image from 'next/image'

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
          <div className="overflow-hidden rounded-xl border border-border-strong shadow-sm hover:shadow-md transition-shadow bg-bg">
            <Image 
              src="/images/trust-disclosure.png" 
              alt={isAr ? 'بروتوكول الإفصاح المتبادل' : 'Exchange Disclosure Protocol'} 
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          <div className="overflow-hidden rounded-xl border border-border-strong shadow-sm hover:shadow-md transition-shadow bg-bg">
            <Image 
              src="/images/trust-integrity.png" 
              alt={isAr ? 'سلامة البيانات' : 'Data Integrity'} 
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

