import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/lib/i18n/config'

interface CtaDict {
  title: string
  description: string
  button: string
  note: string
}

interface Props {
  lang: Locale
  dict: CtaDict
}

export function CtaSection({ lang, dict }: Props) {
  return (
    <section className="bg-navy py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{dict.title}</h2>
        <p className="text-white/80 text-lg mb-8 leading-relaxed">{dict.description}</p>
        <Link href={`/${lang}/register`}>
          <Button variant="secondary" size="lg" className="font-semibold">
            {dict.button}
          </Button>
        </Link>
        <p className="text-white/60 text-sm mt-4">{dict.note}</p>
      </div>
    </section>
  )
}
