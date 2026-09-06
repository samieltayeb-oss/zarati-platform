import { getDictionary } from '@/lib/i18n/getDictionary'
import { SudanMap } from '@/components/maps/SudanMap'

export default async function GeographyPreviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isAr = lang === 'ar'
  const dict = await getDictionary(lang as any)

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="container py-24 max-w-6xl space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary/10 text-primary border-2 border-primary px-3 py-1 text-sm font-bold uppercase tracking-wider font-mono">
            R5 ARCHITECTURAL PREVIEW
          </span>
        </div>
        <h1 className="text-display-md font-bold font-cairo">
          {isAr ? 'الجغرافيا السياسية والزراعية' : 'Agricultural & Sovereign Geography'}
        </h1>
        <p className="text-lg text-muted max-w-3xl font-medium leading-relaxed">
          {isAr
            ? 'هذه الوحدة قيد التطوير للبنية الخامسة (R5). ستعرض بيانات جغرافية هيكلية دقيقة للأراضي الزراعية، البنية التحتية للحصاد، ومسارات التصدير الحيوية.'
            : 'This module is under development for Release 5 (R5). It will map precise structural agricultural data, harvest infrastructure, and critical export corridors.'}
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
    </div>
  )
}
