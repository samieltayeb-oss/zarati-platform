import { getDictionary } from '@/lib/i18n/getDictionary'
import { PageWrapper } from '@/components/layout/page-wrapper'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const t = (await getDictionary(lang as Locale)).contact
  return { title: t.pageTitle }
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const t = (await getDictionary(locale)).contact

  const cards = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      title: t.emailTitle,
      body: t.emailBody,
      link: `mailto:${t.email}`,
      linkLabel: t.email,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      ),
      title: t.supportTitle,
      body: t.supportBody,
      link: null,
      linkLabel: null,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t.responseTitle,
      body: t.responseBody,
      link: null,
      linkLabel: null,
    },
  ]

  return (
    <>
      <section className="bg-gradient-to-b from-teal to-primary text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">{t.heroTitle}</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto leading-relaxed">{t.heroSubtitle}</p>
        </div>
      </section>

      <PageWrapper narrow>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map(({ icon, title, body, link, linkLabel }) => (
            <div key={title} className="bg-surface rounded-2xl border border-border p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                {icon}
              </div>
              <h2 className="font-semibold text-text mb-2">{title}</h2>
              <p className="text-muted text-sm leading-relaxed mb-3">{body}</p>
              {link && linkLabel && (
                <a href={link} className="text-primary text-sm font-medium hover:underline break-all">
                  {linkLabel}
                </a>
              )}
            </div>
          ))}
        </div>
      </PageWrapper>
    </>
  )
}
