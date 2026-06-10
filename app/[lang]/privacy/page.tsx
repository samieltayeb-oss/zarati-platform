import { getDictionary } from '@/lib/i18n/getDictionary'
import { PageWrapper } from '@/components/layout/page-wrapper'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const t = (await getDictionary(lang as Locale)).privacy
  return { title: t.pageTitle }
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const t = (await getDictionary(locale)).privacy

  const sections = [
    { title: t.collectTitle,  body: t.collectBody  },
    { title: t.useTitle,      body: t.useBody      },
    { title: t.storageTitle,  body: t.storageBody  },
    { title: t.rightsTitle,   body: t.rightsBody   },
  ]

  return (
    <>
      <section className="bg-gradient-to-b from-primary to-primary-dark text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t.title}</h1>
          <p className="text-white/60 text-sm">{t.effective}</p>
        </div>
      </section>

      <PageWrapper narrow>
        <p className="text-muted text-lg leading-relaxed mb-12">{t.intro}</p>

        <div className="space-y-10">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="text-xl font-bold text-text mb-3">{title}</h2>
              <p className="text-muted leading-relaxed">{body}</p>
            </section>
          ))}

          <section className="bg-primary/5 rounded-2xl border border-primary/20 p-8">
            <h2 className="text-xl font-bold text-text mb-3">{t.contactTitle}</h2>
            <a
              href={`mailto:${t.contactEmail}`}
              className="text-primary font-medium hover:underline"
            >
              {t.contactEmail}
            </a>
          </section>
        </div>
      </PageWrapper>
    </>
  )
}
