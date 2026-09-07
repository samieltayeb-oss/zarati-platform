import type { Locale } from '@/lib/i18n/config'

export function TechnicalRegister({ locale }: { locale: Locale; dict?: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section id="architecture" className="py-24 md:py-32 border-b border-border-strong bg-[#061D38] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/50 mb-4 block">02 / {isAr ? 'سجل النظام' : 'System Register'}</span>
            <h2 className="text-[40px] md:text-[52px] font-bold font-cairo leading-tight">
              {isAr ? 'الهيكلية التقنية وخارطة الطريق' : 'Technical Reality Register'}
            </h2>
          </div>
          <p className="text-white/60 text-lg font-sans max-w-sm">
            {isAr 
              ? 'القدرات النشطة، والمخطط لها، والرؤية المستقبلية للمنصة.' 
              : "Active, planned, and future vision capabilities matrix."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div className="space-y-6 relative md:before:absolute md:before:-left-4 md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-success/30 md:pl-4">
            <h3 className="font-mono text-xs tracking-widest text-success flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
              {isAr ? 'نشط الآن' : 'LIVE'}
            </h3>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-md hover:bg-white/10 transition-colors">
              <div className="text-white/50 font-mono text-[10px] mb-2">R1</div>
              <div className="font-bold text-lg mb-2">{isAr ? 'قاعدة البيانات الأساسية' : 'Data Foundation'}</div>
              <div className="text-sm text-white/60">{isAr ? 'مخطط النظام وإدارة الجلسات.' : 'Schema and session management.'}</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-md hover:bg-white/10 transition-colors">
              <div className="text-white/50 font-mono text-[10px] mb-2">R2</div>
              <div className="font-bold text-lg mb-2">{isAr ? 'الهوية والأمان' : 'Identity & Security'}</div>
              <div className="text-sm text-white/60">{isAr ? 'مصادقة المستخدم وأذونات الوصول.' : 'User authentication and access control.'}</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-md hover:bg-white/10 transition-colors border-l-2 border-l-success">
              <div className="text-white/50 font-mono text-[10px] mb-2">R3</div>
              <div className="font-bold text-lg mb-2">{isAr ? 'السوق والتواصل' : 'Marketplace & RFQ'}</div>
              <div className="text-sm text-white/60">{isAr ? 'العروض التجارية والإفصاح الثنائي.' : 'Commercial listings and bilateral reveal.'}</div>
            </div>
          </div>

          <div className="space-y-6 relative md:before:absolute md:before:-left-4 md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-warning/30 md:pl-4">
            <h3 className="font-mono text-xs tracking-widest text-warning flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 bg-warning"></span>
              {isAr ? 'مخطط' : 'PLANNED'}
            </h3>
            
            <div className="border border-white/10 p-6 rounded-md border-dashed opacity-80">
              <div className="text-white/50 font-mono text-[10px] mb-2">R4</div>
              <div className="font-bold text-lg">{isAr ? 'استخبارات السوق' : 'Market Intelligence'}</div>
            </div>
            
            <div className="border border-white/10 p-6 rounded-md border-dashed opacity-80">
              <div className="text-white/50 font-mono text-[10px] mb-2">R5</div>
              <div className="font-bold text-lg">{isAr ? 'العمليات والتحقق' : 'Operations & Verification'}</div>
            </div>

            <div className="border border-white/10 p-6 rounded-md border-dashed opacity-80">
              <div className="text-white/50 font-mono text-[10px] mb-2">R6 / R7</div>
              <div className="font-bold text-lg">{isAr ? 'الاستخبارات المؤسسية' : 'Institutional Intelligence'}</div>
            </div>
          </div>

          <div className="space-y-6 relative md:before:absolute md:before:-left-4 md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-white/10 md:pl-4">
            <h3 className="font-mono text-xs tracking-widest text-white/50 flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 border border-white/50 rounded-full"></span>
              {isAr ? 'الرؤية المستقبلية' : 'VISION'}
            </h3>
            
            <div className="opacity-40 p-4">
              <div className="text-white/50 font-mono text-[10px] mb-2">R8</div>
              <div className="font-bold text-lg">{isAr ? 'الذكاء الزراعي' : 'Agronomic Intelligence'}</div>
            </div>
            
            <div className="opacity-40 p-4">
              <div className="text-white/50 font-mono text-[10px] mb-2">R9</div>
              <div className="font-bold text-lg">{isAr ? 'الوصول محدود النطاق' : 'Low-Bandwidth Access'}</div>
            </div>

            <div className="opacity-40 p-4">
              <div className="text-white/50 font-mono text-[10px] mb-2">R10</div>
              <div className="font-bold text-lg">{isAr ? 'الاستخبارات المكانية' : 'Geospatial Intelligence'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
