import Image from 'next/image'
import type { Locale } from '@/lib/i18n/config'

export function B2bMarketplace({ locale, dict }: { locale: Locale; dict: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-24 md:py-32 border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono tracking-widest uppercase text-muted mb-4 block">03 / {isAr ? 'السوق' : 'Marketplace'}</span>
            <h2 className="text-[40px] md:text-[52px] font-bold font-cairo leading-tight text-text mb-4">
              {isAr ? 'سوق الجملة للشركات' : 'Commercial Bulk Marketplace'}
            </h2>
            <p className="text-muted text-lg max-w-xl font-sans">
              {isAr ? 'قاعدة بيانات هيكلية لعروض السلع بالكميات التجارية. يتيح الوصول المباشر للمنتجين وكبار الموردين.' : 'Structured feed of commercial bulk commodity listings. Direct access to producers and primary aggregators.'}
            </p>
          </div>
          <div>
            <a href={`/${locale}/marketplace`} className="inline-flex items-center justify-center border border-border-strong px-6 py-2.5 rounded-sm text-sm font-bold hover:bg-bg transition-colors">
              {isAr ? 'تصفح السوق بالكامل' : 'View Full Marketplace'}
            </a>
          </div>
        </div>

        {/* Aggregation Infrastructure Callout */}
        <div className="mb-8 bg-surface-card border border-border-strong rounded-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
          <div className="relative h-48 lg:h-auto lg:col-span-4 bg-muted/20">
            <Image
              src="/images/zarati/marketplace/grain-aggregation-warehouse.jpg"
              alt={isAr ? 'مستودع تجميع الحبوب والسلع الزراعية ومرفق التسوية العينية في السودان' : 'Primary agricultural commodity grain warehouse and physical settlement facility in Sudan'}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 lg:p-8 lg:col-span-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-xs font-mono tracking-widest text-muted uppercase">
                {isAr ? 'شبكة مراكز التجميع الإقليمية (مخطط R5)' : 'REGIONAL AGGREGATION NETWORK (R5 PLANNED)'}
              </span>
            </div>
            <h3 className="text-xl font-bold font-cairo text-text mb-2">
              {isAr ? 'نموذج مستودعات الفرز والتسوية العينية' : 'Physical Aggregation & Settlement Framework'}
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              {isAr 
                ? 'إطار عمل مخطط لتنسيق شحنات السلع التجارية مع مرافق التخزين الإقليمية في القضارف والجزيرة وبورتسودان عند تفعيل المرحلة الخامسة.' 
                : 'Planned operational framework for coordinating commercial commodity lots with regional storage facilities across Gedaref, Gezira, and Port Sudan in R5.'}
            </p>
          </div>
        </div>

        <div className="border border-border-strong rounded-md overflow-hidden bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-muted">
              <thead className="text-xs text-muted uppercase bg-bg border-b border-border-strong font-mono">
                <tr>
                  <th scope="col" className="px-6 py-4">{isAr ? 'المحصول' : 'Commodity'}</th>
                  <th scope="col" className="px-6 py-4">{isAr ? 'المصدر' : 'Origin'}</th>
                  <th scope="col" className="px-6 py-4">{isAr ? 'الكمية' : 'Volume'}</th>
                  <th scope="col" className="px-6 py-4">{isAr ? 'الحالة' : 'Status'}</th>
                  <th scope="col" className="px-6 py-4 text-right">{isAr ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-surface border-b border-border hover:bg-bg transition-colors group">
                  <td className="px-6 py-5 font-bold text-text font-cairo text-base">
                    {isAr ? 'سمسم أبيض' : 'White Sesame'}
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 border border-border px-2 py-0.5 rounded text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                      {isAr ? 'القضارف' : 'Gedaref'}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-mono text-text">500 MT</td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-mono tracking-widest text-muted">{isAr ? 'نشط' : 'ACTIVE'}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <a href={`/${locale}/login`} className="text-primary font-bold text-xs opacity-0 md:opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                      {isAr ? 'تسجيل الدخول' : 'Login to View'} &rarr;
                    </a>
                  </td>
                </tr>
                <tr className="bg-surface border-b border-border hover:bg-bg transition-colors group">
                  <td className="px-6 py-5 font-bold text-text font-cairo text-base">
                    {isAr ? 'فول سوداني' : 'Groundnuts'}
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 border border-border px-2 py-0.5 rounded text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]"></span>
                      {isAr ? 'كردفان' : 'Kordofan'}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-mono text-text">1200 MT</td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-mono tracking-widest text-muted">{isAr ? 'نشط' : 'ACTIVE'}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <a href={`/${locale}/login`} className="text-primary font-bold text-xs opacity-0 md:opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                      {isAr ? 'تسجيل الدخول' : 'Login to View'} &rarr;
                    </a>
                  </td>
                </tr>
                <tr className="bg-surface hover:bg-bg transition-colors group">
                  <td className="px-6 py-5 font-bold text-text font-cairo text-base">
                    {isAr ? 'ذرة رفيعة' : 'Sorghum'}
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 border border-border px-2 py-0.5 rounded text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      {isAr ? 'النيل الأزرق' : 'Blue Nile'}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-mono text-text">5000 MT</td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-mono tracking-widest text-muted">{isAr ? 'نشط' : 'ACTIVE'}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <a href={`/${locale}/login`} className="text-primary font-bold text-xs opacity-0 md:opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                      {isAr ? 'تسجيل الدخول' : 'Login to View'} &rarr;
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
