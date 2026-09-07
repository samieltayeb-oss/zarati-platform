import Image from 'next/image'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { getCrops } from '@/lib/services/crop-service'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/config'

type Props = { params: Promise<{ lang: string }> }

export default async function CropsPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const isAr = locale === 'ar'
  const numLocale = isAr ? 'ar-SD' : 'en-US'

  const [dict, crops] = await Promise.all([getDictionary(locale), getCrops()])
  const t = dict.home.cropSnapshot
  const { common } = dict

  const CATEGORY_LABEL: Record<string, { ar: string; en: string }> = {
    grain:    { ar: 'حبوب',    en: 'Grain' },
    oilseed:  { ar: 'زيتية',   en: 'Oilseed' },
    cash:     { ar: 'نقدية',   en: 'Cash Crop' },
  }

  const CROP_LIBRARY = [
    {
      id: 'sesame',
      nameEn: 'White Sesame',
      nameAr: 'سمسم أبيض',
      variety: isAr ? 'أصناف القضارف وسنار' : 'Gedaref & Sennar white varieties',
      region: isAr ? 'القضارف، سنار، النيل الأزرق' : 'Gedaref, Sennar, Blue Nile',
      category: isAr ? 'محصول زيتي' : 'Oilseed',
      image: '/images/zarati/crops/sesame-white-harvest.jpg',
      altEn: 'White and golden sesame stalks drying in field shocks in Gedaref, Sudan',
      altAr: 'حزم محصول السمسم الأبيض تجف في حقول القضارف بالسودان',
    },
    {
      id: 'sorghum',
      nameEn: 'Sorghum (Feterita)',
      nameAr: 'ذرة رفيعة (فتريتة)',
      variety: isAr ? 'فتريتة، دبر، قدم الحمام' : 'Feterita, Dabar, Gadam El-Hammam',
      region: isAr ? 'القضارف، الجزيرة، سنار' : 'Gedaref, Gezira, Sennar',
      category: isAr ? 'حبوب غذائية' : 'Grain',
      image: '/images/zarati/crops/sorghum-feterita-grain.jpg',
      altEn: 'Ripe sorghum grain heads ready for harvest in Gedaref, Sudan',
      altAr: 'سنابل محصول الذرة الرفيعة الفتريتة في حقول القضارف بالسودان',
    },
    {
      id: 'gum-arabic',
      nameEn: 'Gum Arabic (Hashab)',
      nameAr: 'صمغ عربي (هشاب)',
      variety: isAr ? 'أكاسيا سنغال (هشاب وتلح)' : 'Acacia senegal & seyal',
      region: isAr ? 'حزام الصمغ: كردفان، دارفور، النيل الأزرق' : 'Gum Belt: Kordofan, Darfur, Blue Nile',
      category: isAr ? 'محصول نقدي استراتيجي' : 'Strategic Cash Crop',
      image: '/images/zarati/crops/gum-arabic-hashab.jpg',
      altEn: 'Translucent amber tears of natural gum arabic on acacia tree trunk in Kordofan',
      altAr: 'دموع الصمغ العربي الهشاب الطبيعية على جذع شجرة الأكاسيا في كردفان',
    },
    {
      id: 'groundnuts',
      nameEn: 'Groundnuts (Ful Sudani)',
      nameAr: 'فول سوداني',
      variety: isAr ? 'أصناف مطرية ومروية' : 'Rainfed & Irrigated varieties',
      region: isAr ? 'غرب السودان والجزيرة' : 'Western Sudan & Gezira',
      category: isAr ? 'محصول زيتي غذائي' : 'Oilseed',
      image: '/images/zarati/crops/groundnuts-ful-sudani.jpg',
      altEn: 'Freshly harvested groundnut pods clinging to root system in Sudan',
      altAr: 'محصول الفول السوداني المحصود حديثاً مع الجذور في غرب السودان',
    },
    {
      id: 'wheat',
      nameEn: 'Nile Winter Wheat',
      nameAr: 'قمح شتوي نيلي',
      variety: isAr ? 'إمام، دبيرة، أصناف شتوية' : 'Imam, Debeira winter cultivars',
      region: isAr ? 'الولاية الشمالية، نهر النيل، الجزيرة' : 'Northern State, River Nile, Gezira',
      category: isAr ? 'حبوب استراتيجية' : 'Strategic Grain',
      image: '/images/zarati/crops/wheat-nile-winter.jpg',
      altEn: 'Golden ripe wheat ears along the River Nile agricultural corridor in Sudan',
      altAr: 'سنابل القمح الشتوي الذهبية على ضفاف حوض النيل الزراعي بالسودان',
    },
    {
      id: 'cotton',
      nameEn: 'Sudanese Cotton',
      nameAr: 'قطن سوداني',
      variety: isAr ? 'طويل ومتوسط التيلة (بركات وأكالا)' : 'Barakat long staple & Acala medium',
      region: isAr ? 'مشروع الجزيرة والرهد وحلفا الجديدة' : 'Gezira Scheme, Rahad, New Halfa',
      category: isAr ? 'محصول نسيجي نقدي' : 'Cash Crop',
      image: '/images/zarati/crops/cotton-gezira-bolls.jpg',
      altEn: 'Bursting white cotton bolls in the Gezira Scheme irrigation fields, Sudan',
      altAr: 'لوز القطن الأبيض المتفتح في حقول مشروع الجزيرة المروي بالسودان',
    },
    {
      id: 'sunflower',
      nameEn: 'Sunflower Seed',
      nameAr: 'زهرة الشمس',
      variety: isAr ? 'هجين زيتي عالي الإنتاج' : 'High-yield oilseed hybrids',
      region: isAr ? 'القضارف، سنار، الدمازين' : 'Gedaref, Sennar, Damazine',
      category: isAr ? 'محصول زيتي' : 'Oilseed',
      image: '/images/zarati/crops/sunflower-gedaref-bloom.jpg',
      altEn: 'Blooming sunflower field on dark clay vertisol soil in Gedaref, Sudan',
      altAr: 'حقول زهرة الشمس المزهرة في السهول الطينية بالقضارف في السودان',
    },
    {
      id: 'millet',
      nameEn: 'Pearl Millet (Dukhun)',
      nameAr: 'دخن بلدي',
      variety: isAr ? 'دخن تقليدي مقاوم للجفاف' : 'Drought-tolerant indigenous landraces',
      region: isAr ? 'شمال وغرب كردفان، دارفور' : 'North/West Kordofan, Darfur',
      category: isAr ? 'حبوب غذائية مقاومة للجفاف' : 'Grain',
      image: '/images/zarati/crops/millet-dukhun-spikes.jpg',
      altEn: 'Cylindrical golden-brown pearl millet spikes in Western Sudan rainfed farm',
      altAr: 'سنابل الدخن البلدي الأسطوانية في الحقول المطرية بغرب السودان',
    },
  ]

  return (
    <PageWrapper>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold font-cairo text-text">{t.title}</h1>
          <Badge variant="outline">{common.demoData}</Badge>
        </div>
        <p className="text-muted text-base sm:text-lg max-w-3xl leading-relaxed">{t.subtitle}</p>
      </div>

      {/* Botanical Crop Visual Library */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-cairo text-text">
              {isAr ? 'السجل البصري للمحاصيل القومية' : 'National Botanical Crop Catalogue'}
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              {isAr ? 'توثيق المحاصيل الاستراتيجية والبيئات الزراعية المنتجة في السودان' : 'Photographic index of Sudan’s primary agricultural commodities'}
            </p>
          </div>
          <span className="text-xs font-mono text-muted bg-surface px-2.5 py-1 rounded border border-border">
            8 SPECIES INDEXED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CROP_LIBRARY.map(crop => (
            <div key={crop.id} className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20">
                <Image
                  src={crop.image}
                  alt={isAr ? crop.altAr : crop.altEn}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 start-2.5">
                  <span className="text-[10px] font-mono uppercase bg-white/90 dark:bg-surface/90 backdrop-blur-sm px-2 py-0.5 rounded text-text font-bold shadow-xs">
                    {crop.category}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold font-cairo text-lg text-text mb-1">
                    {isAr ? crop.nameAr : crop.nameEn}
                  </h3>
                  <p className="text-xs text-muted font-mono mb-2">
                    {crop.variety}
                  </p>
                </div>
                <div className="text-[11px] text-muted border-t border-border/60 pt-2 flex items-center justify-between">
                  <span>{isAr ? 'النطاق الجغرافي:' : 'Belt:'}</span>
                  <span className="font-medium text-text truncate max-w-[150px] text-end">{crop.region}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-cairo text-text mb-2">
          {isAr ? 'مؤشرات الأسعار التوجيهية' : 'Indicative Market Price Register'}
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          {isAr ? 'بيانات استرشادية توضيحية لنموذج أسعار المحاصيل الإقليمية (غير حية)' : 'Informational demonstration data illustrating market price structures (non-live)'}
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg/50">
                <th className="px-4 py-3 text-start text-muted font-medium">{t.crop}</th>
                <th className="px-4 py-3 text-start text-muted font-medium hidden sm:table-cell">
                  {isAr ? 'الفئة' : 'Category'}
                </th>
                <th className="px-4 py-3 text-end text-muted font-medium">{t.price}</th>
                <th className="px-4 py-3 text-end text-muted font-medium">{t.change}</th>
                <th className="px-4 py-3 text-end text-muted font-medium hidden md:table-cell">{t.market}</th>
                <th className="px-4 py-3 text-end text-muted font-medium hidden lg:table-cell">
                  {isAr ? 'آخر تحديث' : common.lastUpdated}
                </th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop, i) => {
                const up = crop.currentPrice.changePercent >= 0
                const cat = CATEGORY_LABEL[crop.category]
                const updatedAt = new Date(crop.currentPrice.fetchedAt).toLocaleTimeString(
                  isAr ? 'ar-SD' : 'en-US',
                  { hour: '2-digit', minute: '2-digit' }
                )
                return (
                  <tr
                    key={crop.id}
                    className={`hover:bg-bg/40 transition-colors ${i < crops.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <td className="px-4 py-4 font-semibold text-text">
                      {isAr ? crop.nameAr : crop.name}
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <Badge variant="default">
                        {isAr ? cat?.ar : cat?.en}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-end font-mono tabular-nums font-semibold text-text">
                      {formatCurrency(crop.currentPrice.price, numLocale)}
                    </td>
                    <td className="px-4 py-4 text-end">
                      <span className={`font-medium ${up ? 'text-success' : 'text-danger'}`}>
                        {formatPercent(crop.currentPrice.changePercent, numLocale)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-end text-muted hidden md:table-cell">
                      {isAr ? crop.currentPrice.marketAr : crop.currentPrice.market}
                    </td>
                    <td className="px-4 py-4 text-end text-muted text-xs hidden lg:table-cell">
                      {updatedAt}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted text-center mt-4">{common.demoData} — {isAr ? 'أسعار تجريبية لأغراض العرض فقط' : 'Prices are demo data for display purposes only'}</p>
    </PageWrapper>
  )
}
