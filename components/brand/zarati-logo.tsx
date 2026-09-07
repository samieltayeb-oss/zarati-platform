import Image from 'next/image'
import logoSrc from '@/brand/main.png'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/config'
import type { HTMLAttributes } from 'react'

interface ZaratiLogoProps extends HTMLAttributes<HTMLDivElement> {
  lang?: Locale
  variant?: 'header' | 'footer' | 'auth' | 'mark' | 'full'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  priority?: boolean
}

/**
 * Authentic Original ZARATI Brand Logo Component.
 * Faithfully renders the canonical brand asset from @/brand/logo2-transparent.png.
 */
export function ZaratiLogo({
  variant = 'header',
  size = 'md',
  className,
  priority,
  ...props
}: ZaratiLogoProps) {
  let heightClass = 'h-[56px] md:h-[72px]'
  if (variant === 'footer') {
    heightClass = 'h-[64px]'
  } else if (variant === 'auth') {
    heightClass = 'h-[64px] sm:h-[80px]'
  } else if (size === 'sm') {
    heightClass = 'h-[44px]'
  } else if (size === 'lg') {
    heightClass = 'h-[80px]'
  }

  return (
    <div className={cn('inline-flex items-center select-none', className)} {...props}>
      <Image
        src={logoSrc}
        alt="زرعتي | ZARATI"
        height={80}
        width={120}
        className={cn(heightClass, 'w-auto object-contain')}
        style={{ mixBlendMode: 'multiply' }}
        priority={priority || variant === 'header'}
      />
    </div>
  )
}

/**
 * Authentic ZARATI Mark.
 */
export function ZaratiMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src={logoSrc}
      alt="ZARATI"
      height={size}
      width={Math.round(size * 1.5)}
      className={cn('w-auto object-contain select-none', className)}
      style={{ height: `${size}px`, mixBlendMode: 'multiply' }}
    />
  )
}
