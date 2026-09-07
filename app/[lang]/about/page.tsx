import Image from 'next/image'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { UserCheck, Search, ShieldCheck } from 'lucide-react'
import { PageWrapper } from '@/components/layout/page-wrapper'
import type { Locale } from '@/lib/i18n/config'

type Props = { params: Promise<{ lang: string }> }

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const isAr = locale === 'ar'
  const t = (await getDictionary(locale)).about

  const values = [
    { key: 'farmerFirst',  title: t.farmerFirst,  desc: t.farmerFirstDesc,    icon: <UserCheck className="w-10 h-10 mx-auto text-primary" /> },
    { key: 'transparent',  title: t.transparent,  desc: t.transparentDesc,    icon: <Search className="w-10 h-10 mx-auto text-primary" /> },
    { key: 'sudanese',     title: t.sudanese,      desc: t.sudaneseDesc,       icon: <ShieldCheck className="w-10 h-10 mx-auto text-primary" /> },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-navy to-navy-dark text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold font-cairo mb-4 leading-tight">{t.heroTitle}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">{t.heroSubtitle}</p>
        </div>
      </section>

      <PageWrapper narrow>
        {/* Mission with Photographic Proof */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-surface border border-border rounded-2xl p-6 sm:p-8 overflow-hidden shadow-sm">
            <div className="md:col-span-7">
              <span className="text-[11px] font-mono tracking-widest uppercase text-muted mb-2 block">
                {isAr ? 'الرسالة السيادية' : 'SOVEREIGN PURPOSE'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-cairo text-text mb-4">{t.missionTitle}</h2>
              <p className="text-muted text-base sm:text-lg leading-relaxed">{t.missionDescription}</p>
            </div>
            <div className="md:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-muted/20">
              <Image
                src="/images/zarati/about/agronomist-field-inspection.jpg"
                alt={isAr ? 'باحثة زراعية سودانية تفحص عينات المحاصيل في الحقل' : 'Sudanese agricultural agronomist inspecting crops in the field'}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Sovereign Infrastructure Foundation */}
        <section className="mb-16 bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="relative aspect-[21/9] w-full bg-muted/20">
            <Image
              src="/images/zarati/institutional/strategic-grain-silos.jpg"
              alt={isAr ? 'صوامع تخزين الحبوب الاستراتيجية في السودان' : 'Strategic agricultural grain storage silos in Sudan'}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 font-bold mb-1 block">
                  {isAr ? 'البنية التحتية القومية' : 'NATIONAL SCALE CAPABILITY'}
                </span>
                <p className="text-white text-lg sm:text-xl font-bold font-cairo">
                  {isAr ? 'تأمين سلاسل الإمداد ومراكز التخزين الاستراتيجي' : 'Securing Agricultural Supply Chains & Strategic Storage'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-8">{t.valuesTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map(({ key, title, desc, icon }) => (
              <div key={key} className="bg-surface rounded-2xl border border-border p-6 text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-semibold text-text mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-primary/5 rounded-2xl border border-primary/20 p-8 text-center">
          <h2 className="text-xl font-bold text-text mb-3">{t.contactTitle}</h2>
          <a
            href={`mailto:${t.contactEmail}`}
            className="text-primary font-medium hover:underline text-lg"
          >
            {t.contactEmail}
          </a>
          {isAr && (
            <p className="text-muted text-sm mt-2">نرحب بمقترحاتكم وتعاونكم</p>
          )}
        </section>
      </PageWrapper>
    </>
  )
}
