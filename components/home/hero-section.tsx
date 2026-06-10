import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/lib/i18n/config'

interface HeroDict {
  title: string
  subtitle: string
  ctaPrimary: string
  ctaSecondary: string
}

interface Props {
  lang: Locale
  dict: HeroDict
}

export function HeroSection({ lang, dict }: Props) {
  return (
    <section className="relative bg-gradient-to-b from-primary to-primary-dark text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 start-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-10 end-10 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-secondary-light animate-pulse" />
            <span>السودان · الزراعة الذكية</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
            {dict.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {dict.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${lang}/register`}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-semibold">
                {dict.ctaPrimary}
              </Button>
            </Link>
            <Link href={`/${lang}/marketplace`}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 font-medium"
              >
                {dict.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
