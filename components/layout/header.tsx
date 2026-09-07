'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import logoSrc from '@/brand/logo2-transparent.png'
import type { Locale } from '@/lib/i18n/config'

interface NavDict {
  overview: string
  marketplace: string
  intelligence: string
  geography: string
  command: string
  institutional: string
  workspace: string
  login: string
  register: string
  language: string
}

interface HeaderProps {
  lang: Locale
  nav: NavDict
}

export function Header({ lang, nav }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const other = lang === 'ar' ? 'en' : 'ar'
  const localePath = pathname.replace(new RegExp(`^/${lang}`), `/${other}`)

  const links = [
    { href: `/${lang}`,             label: nav.overview },
    { href: `/${lang}/marketplace`, label: nav.marketplace },
    { href: `/${lang}/intelligence`, label: nav.intelligence },
    { href: `/${lang}/geography`,   label: nav.geography },
    { href: `/${lang}/about`,       label: nav.institutional },
  ]

  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === href : pathname.startsWith(href)

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[80px] md:h-[96px]">

          {/* Logo lockup */}
          <Link href={`/${lang}`} className="shrink-0">
            <Image
              src={logoSrc}
              alt="زرعتي | ZARATI"
              height={68}
              width={102}
              className="h-[56px] md:h-[72px] w-auto object-contain"
              style={{ mixBlendMode: 'multiply' }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(href)
                    ? 'text-primary bg-primary/10'
                    : 'text-text hover:text-primary hover:bg-primary/5'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={localePath}
              className="text-sm text-muted hover:text-text transition-colors font-medium"
            >
              {nav.language}
            </Link>
            <Link href={`/${lang}/login`}>
              <Button variant="ghost" size="sm">{nav.login}</Button>
            </Link>
            <Link href={`/${lang}/register`}>
              <Button variant="primary" size="sm">{nav.register}</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted hover:text-text hover:bg-black/5 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-border pt-3 space-y-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(href)
                    ? 'text-primary bg-primary/10'
                    : 'text-text hover:text-primary hover:bg-primary/5'
                )}
              >
                {label}
              </Link>
            ))}
            <div className="flex items-center gap-3 px-3 pt-3 mt-2 border-t border-border">
              <Link href={localePath} onClick={() => setOpen(false)} className="text-sm text-muted font-medium">
                {nav.language}
              </Link>
              <Link href={`/${lang}/login`} onClick={() => setOpen(false)} className="text-sm text-text font-medium">
                {nav.login}
              </Link>
              <Link href={`/${lang}/register`} onClick={() => setOpen(false)}>
                <Button variant="primary" size="sm">{nav.register}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
