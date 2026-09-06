import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SudanMap } from '@/components/maps/SudanMap'
import logoSrc from '@/brand/logo2-transparent.png'
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
  const isAr = lang === 'ar'

  return (
    <section className="flex flex-col lg:flex-row" style={{ minHeight: '88vh' }}>

      {/* ── Content column (white) ────────────────────────────────────────────
          HTML order: content first → in RTL flex-row renders on the RIGHT,
          matching ref.png visual (logo/text on reading side, map on other). */}
      <div className="flex-1 bg-white flex flex-col justify-center
                      px-8 sm:px-12 lg:px-14 xl:px-20 py-14 lg:py-0">
        <div className="max-w-xl w-full">

          {/* Official logo — logo2.png 1536×1024, transparent, 3:2 aspect */}
          <div className="mb-10 lg:mb-12">
            <Image
              src={logoSrc}
              alt="زرعتي | ZARATI"
              height={280}
              width={420}
              style={{ height: 'clamp(200px, 26vw, 280px)', width: 'auto' }}
              priority
              quality={100}
            />
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-primary
                         leading-tight mb-4 tracking-tight">
            {dict.title}
          </h1>

          {/* Supporting text */}
          <p className="text-base sm:text-lg text-muted leading-relaxed mb-8">
            {dict.subtitle}
          </p>



          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/${lang}/register`}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-semibold">
                {dict.ctaPrimary}
              </Button>
            </Link>
            <Link href={`/${lang}/marketplace`}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {dict.ctaSecondary}
              </Button>
            </Link>
          </div>

        </div>
      </div>

      {/* ── Map column (dark navy) ────────────────────────────────────────────
          Accurate Sudan map from geoBoundaries SDN ADM0 (post-2011 borders).
          Rendered larger to fill the column and remain professionally centered. */}
      <div className="flex-1 bg-[#07192e] relative overflow-hidden
                      flex items-center justify-center p-4 sm:p-6 lg:p-8"
           style={{ minHeight: 'clamp(320px, 72vw, 600px)' }}>

        {/* Ambient glows */}
        <div className="absolute top-16 start-16 w-72 h-72 rounded-full
                        bg-teal/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 end-12 w-52 h-52 rounded-full
                        bg-[#16a34a]/8 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center w-full">
          <p className="text-white/35 text-[9px] tracking-[0.25em] uppercase mb-3 select-none">
            {isAr ? 'خريطة زراعية — السودان' : 'Agricultural Map — Sudan'}
          </p>

          {/* Accurate Sudan map from verified geoBoundaries source */}
          <SudanMap
            lang={lang}
            className="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[420px] xl:max-w-[480px] h-auto"
          />

          {/* Legend */}
          <div className="flex items-center gap-5 mt-3">
            <span className="flex items-center gap-1.5 text-[10px] text-white/40">
              <span className="w-4 h-0.5 bg-blue-400 rounded inline-block" />
              {isAr ? 'النيل' : 'Nile'}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-white/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              {isAr ? 'مدن زراعية' : 'Agri cities'}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-white/40">
              <span className="w-3 h-2 rounded-sm bg-emerald-600/40 inline-block border border-dashed border-emerald-500/40" />
              {isAr ? 'الجزيرة' : 'Gezira'}
            </span>
          </div>
        </div>

      </div>

    </section>
  )
}
