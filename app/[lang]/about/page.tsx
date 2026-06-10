import { getDictionary } from '@/lib/i18n/getDictionary'
import { PageWrapper } from '@/components/layout/page-wrapper'
import type { Locale } from '@/lib/i18n/config'

type Props = { params: Promise<{ lang: string }> }

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const isAr = locale === 'ar'
  const t = (await getDictionary(locale)).about

  const values = [
    { key: 'farmerFirst',  title: t.farmerFirst,  desc: t.farmerFirstDesc,    icon: '👨‍🌾' },
    { key: 'transparent',  title: t.transparent,  desc: t.transparentDesc,    icon: '🔍' },
    { key: 'sudanese',     title: t.sudanese,      desc: t.sudaneseDesc,       icon: '🇸🇩' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary to-primary-dark text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">{t.heroTitle}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">{t.heroSubtitle}</p>
        </div>
      </section>

      <PageWrapper narrow>
        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-4">{t.missionTitle}</h2>
          <p className="text-muted text-lg leading-relaxed">{t.missionDescription}</p>
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
