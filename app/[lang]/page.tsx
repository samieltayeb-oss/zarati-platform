import { getDictionary } from '@/lib/i18n/getDictionary'
import type { Locale } from '@/lib/i18n/config'
import { SovereignHero } from '@/components/home/sections/01-sovereign-hero'
import { NationalReality } from '@/components/home/sections/02-national-reality'
import { TechnicalRegister } from '@/components/home/sections/03-technical-register'
import { B2bMarketplace } from '@/components/home/sections/04-b2b-marketplace'
import { AgriculturalGeography } from '@/components/home/sections/05-production-belts'
import { TrustProvenance } from '@/components/home/sections/08-trust-provenance'
import { InstitutionalCta } from '@/components/home/sections/09-institutional-cta'

type Props = { params: Promise<{ lang: string }> }

export default async function Page({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <SovereignHero locale={locale} dict={dict.home} />
      <NationalReality locale={locale} dict={dict.home} />
      <TechnicalRegister locale={locale} dict={dict.home} />
      <B2bMarketplace locale={locale} dict={dict.home} />
      <AgriculturalGeography locale={locale} dict={dict.home} />
      <TrustProvenance locale={locale} dict={dict.home} />
      <InstitutionalCta locale={locale} dict={dict.home} />
    </>
  )
}
