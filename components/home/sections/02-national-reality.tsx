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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div className="relative group">
            <div className="w-8 h-8 rounded-full border border-success flex items-center justify-center mb-6 text-success group-hover:bg-success group-hover:text-white transition-colors duration-300">
              <span className="w-2 h-2 rounded-full bg-current"></span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-cairo mb-3 text-text">
              {isAr ? 'النظام المروي' : 'Irrigated Systems'}
            </h3>
            <p className="text-muted leading-relaxed font-sans mb-6">
              {isAr 
                ? 'مشاريع ضخمة تعتمد على النيلين، تمثل العمود الفقري للإنتاج المكثف.' 
                : 'Massive schemes dependent on the Niles, forming the backbone of intensive production.'}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                <span className="text-muted">{isAr ? 'المناطق' : 'Regions'}</span>
                <span className="font-medium text-text">{isAr ? 'الجزيرة، الرهد، حلفا' : 'Gezira, Rahad, Halfa'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                <span className="text-muted">{isAr ? 'المحاصيل' : 'Crops'}</span>
                <span className="font-medium text-text">{isAr ? 'القمح، القطن، الفول' : 'Wheat, Cotton, Peanut'}</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="w-8 h-8 rounded-full border border-warning flex items-center justify-center mb-6 text-warning group-hover:bg-warning group-hover:text-white transition-colors duration-300">
              <span className="w-2.5 h-2.5 bg-current transform rotate-45"></span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-cairo mb-3 text-text">
              {isAr ? 'المطري الآلي' : 'Mechanized Rainfed'}
            </h3>
            <p className="text-muted leading-relaxed font-sans mb-6">
              {isAr 
                ? 'سهول طينية شاسعة تعتمد على الأمطار والميكنة الكثيفة لإنتاج محاصيل الحبوب.' 
                : 'Vast clay plains relying on rainfall and heavy mechanization for cereal crops.'}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                <span className="text-muted">{isAr ? 'المناطق' : 'Regions'}</span>
                <span className="font-medium text-text">{isAr ? 'القضارف، النيل الأزرق' : 'Gedaref, Blue Nile'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                <span className="text-muted">{isAr ? 'المحاصيل' : 'Crops'}</span>
                <span className="font-medium text-text">{isAr ? 'الذرة، السمسم، زهرة الشمس' : 'Sorghum, Sesame, Sunflower'}</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="w-8 h-8 rounded-full border border-[#C8A96E] flex items-center justify-center mb-6 text-[#C8A96E] group-hover:bg-[#C8A96E] group-hover:text-white transition-colors duration-300">
              <span className="w-2 h-2 rounded-sm bg-current"></span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-cairo mb-3 text-text">
              {isAr ? 'المطري التقليدي' : 'Traditional Rainfed'}
            </h3>
            <p className="text-muted leading-relaxed font-sans mb-6">
              {isAr 
                ? 'زراعة الحيازات الصغيرة والاعتماد على العمالة اليدوية، تغطي مساحات رملية ضخمة.' 
                : 'Smallholder farming relying on manual labor, covering massive sandy areas.'}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                <span className="text-muted">{isAr ? 'المناطق' : 'Regions'}</span>
                <span className="font-medium text-text">{isAr ? 'كردفان، دارفور' : 'Kordofan, Darfur'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                <span className="text-muted">{isAr ? 'المحاصيل' : 'Crops'}</span>
                <span className="font-medium text-text">{isAr ? 'الدخن، الصمغ العربي' : 'Millet, Gum Arabic'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
