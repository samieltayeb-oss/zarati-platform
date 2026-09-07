import Image from 'next/image'
import type { Locale } from '@/lib/i18n/config'

export function NationalReality({ locale, dict }: { locale: Locale; dict: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-24 md:py-32 border-b border-border-strong bg-[#F9F6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-strong pb-8">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono tracking-widest uppercase text-muted mb-4 block">01 / {isAr ? 'الواقع الهيكلي' : 'Structural Reality'}</span>
            <h2 className="text-[40px] md:text-[52px] font-bold font-cairo leading-tight text-text">
              {isAr ? 'الواقع الزراعي القومي' : 'National Ground Reality'}
            </h2>
          </div>
          <p className="text-muted text-lg font-sans max-w-sm">
            {isAr 
              ? 'السياق الهيكلي للاقتصاد الزراعي في السودان: اعتماد بنسبة 60-80٪ على الزراعة، مع مساحة مزروعة تُقدر بحوالي 24 مليون فدان.' 
              : "Structural context on Sudan's agro-economy: 60-80% dependency, ~24M cultivated feddans."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Irrigated Systems */}
          <div className="relative group bg-white border border-border-strong rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/20">
              <Image
                src="/images/zarati/agriculture/irrigated-gezira-canal.jpg"
                alt={isAr ? 'قناة ري ومنظم مائي بمشروع الجزيرة في السودان' : 'Gezira Scheme irrigation canal and sluice gate regulator in Sudan'}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 start-3">
                <span className="w-8 h-8 rounded-full border border-success/80 bg-white/95 backdrop-blur-sm flex items-center justify-center text-success shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-cairo mb-2 text-text">
                  {isAr ? 'النظام المروي' : 'Irrigated Systems'}
                </h3>
                <p className="text-muted text-sm sm:text-base leading-relaxed font-sans mb-6">
                  {isAr 
                    ? 'مشاريع ضخمة تعتمد على النيلين، تمثل العمود الفقري للإنتاج المكثف.' 
                    : 'Massive schemes dependent on the Niles, forming the backbone of intensive production.'}
                </p>
              </div>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                  <span className="text-muted">{isAr ? 'المناطق' : 'Regions'}</span>
                  <span className="font-semibold text-text">{isAr ? 'الجزيرة، الرهد، حلفا' : 'Gezira, Rahad, Halfa'}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-muted">{isAr ? 'المحاصيل' : 'Crops'}</span>
                  <span className="font-semibold text-text">{isAr ? 'القمح، القطن، الفول' : 'Wheat, Cotton, Peanut'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mechanized Rainfed */}
          <div className="relative group bg-white border border-border-strong rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/20">
              <Image
                src="/images/zarati/agriculture/mechanized-gedaref-plow.jpg"
                alt={isAr ? 'الزراعة المطرية الآلية وحراثة التربة الطينية في القضارف بالسودان' : 'Mechanized rainfed agriculture and tractor plowing clay soil in Gedaref, Sudan'}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 start-3">
                <span className="w-8 h-8 rounded-full border border-warning/80 bg-white/95 backdrop-blur-sm flex items-center justify-center text-warning shadow-sm">
                  <span className="w-2.5 h-2.5 bg-current transform rotate-45"></span>
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-cairo mb-2 text-text">
                  {isAr ? 'المطري الآلي' : 'Mechanized Rainfed'}
                </h3>
                <p className="text-muted text-sm sm:text-base leading-relaxed font-sans mb-6">
                  {isAr 
                    ? 'سهول طينية شاسعة تعتمد على الأمطار والميكنة الكثيفة لإنتاج محاصيل الحبوب.' 
                    : 'Vast clay plains relying on rainfall and heavy mechanization for cereal crops.'}
                </p>
              </div>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                  <span className="text-muted">{isAr ? 'المناطق' : 'Regions'}</span>
                  <span className="font-semibold text-text">{isAr ? 'القضارف، النيل الأزرق' : 'Gedaref, Blue Nile'}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-muted">{isAr ? 'المحاصيل' : 'Crops'}</span>
                  <span className="font-semibold text-text">{isAr ? 'الذرة، السمسم، زهرة الشمس' : 'Sorghum, Sesame, Sunflower'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Traditional Rainfed */}
          <div className="relative group bg-white border border-border-strong rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/20">
              <Image
                src="/images/zarati/agriculture/traditional-kordofan-rainfed.jpg"
                alt={isAr ? 'الزراعة المطرية التقليدية للحيازات الصغيرة في شمال كردفان بالسودان' : 'Traditional smallholder rainfed agriculture in North Kordofan, Sudan'}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 start-3">
                <span className="w-8 h-8 rounded-full border border-[#C8A96E]/80 bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#C8A96E] shadow-sm">
                  <span className="w-2 h-2 rounded-sm bg-current"></span>
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-cairo mb-2 text-text">
                  {isAr ? 'المطري التقليدي' : 'Traditional Rainfed'}
                </h3>
                <p className="text-muted text-sm sm:text-base leading-relaxed font-sans mb-6">
                  {isAr 
                    ? 'زراعة الحيازات الصغيرة والاعتماد على العمالة اليدوية، تغطي مساحات رملية ضخمة.' 
                    : 'Smallholder farming relying on manual labor, covering massive sandy areas.'}
                </p>
              </div>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                  <span className="text-muted">{isAr ? 'المناطق' : 'Regions'}</span>
                  <span className="font-semibold text-text">{isAr ? 'كردفان، دارفور' : 'Kordofan, Darfur'}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-muted">{isAr ? 'المحاصيل' : 'Crops'}</span>
                  <span className="font-semibold text-text">{isAr ? 'الدخن، الصمغ العربي' : 'Millet, Gum Arabic'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
