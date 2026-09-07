import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/config'
import type { SVGProps, HTMLAttributes } from 'react'

/**
 * Pixel-precise SVG Flag of the Republic of Sudan (Official 1970 proportions).
 * Red (top), White (middle), Black (bottom), Green isosceles triangle at hoist.
 */
export function SudanFlag({ className = 'w-5 h-3.5', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 36 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'inline-block shrink-0 rounded-[2px] shadow-xs border border-black/15 dark:border-white/15 overflow-hidden',
        className
      )}
      role="img"
      aria-label="علم السودان | Flag of Sudan"
      {...props}
    >
      {/* Top Stripe: Red */}
      <rect width="36" height="8" fill="#D21034" />
      {/* Middle Stripe: White */}
      <rect y="8" width="36" height="8" fill="#FFFFFF" />
      {/* Bottom Stripe: Black */}
      <rect y="16" width="36" height="8" fill="#111827" />
      {/* Hoist Triangle: Green (1/3 width = 12 of 36) */}
      <polygon points="0,0 12,12 0,24" fill="#007229" />
    </svg>
  )
}

interface SudanBadgeProps extends HTMLAttributes<HTMLDivElement> {
  lang?: Locale
  variant?: 'header' | 'hero' | 'footer' | 'pill' | 'compact'
}

/**
 * Reusable Sudan sovereign identity marker.
 * Communicates national location, agricultural context, and sovereign focus
 * without political, military, or governmental claims.
 */
export function SudanBadge({
  lang = 'en',
  variant = 'pill',
  className,
  ...props
}: SudanBadgeProps) {
  const isAr = lang === 'ar'

  if (variant === 'header') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border-strong bg-surface-elevated/70 backdrop-blur-xs text-xs font-mono font-medium text-text/80 shadow-xs hover:border-primary/40 transition-colors',
          className
        )}
        {...props}
      >
        <SudanFlag className="w-4 h-2.5" />
        <span className="font-bold tracking-wider text-[11px]">
          {isAr ? 'السودان' : 'SUDAN'}
        </span>
        <span className="text-muted/40 text-[10px]">/</span>
        <span className="text-[10px] text-muted tracking-tight font-sans">
          {isAr ? 'بنية زراعية' : 'Agri-Infra'}
        </span>
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono font-semibold tracking-wide shadow-xs',
          className
        )}
        {...props}
      >
        <SudanFlag className="w-4 h-2.5" />
        <span>{isAr ? 'صُمم للزراعة في السودان' : 'BUILT FOR SUDAN'}</span>
        <span className="text-primary/30">|</span>
        <span className="text-[10px] text-text/70 uppercase tracking-widest font-mono">
          {isAr ? 'بنية تحتية زراعية' : 'AGRI-INFRASTRUCTURE'}
        </span>
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div
        className={cn(
          'inline-flex flex-wrap items-center gap-2.5 text-xs text-muted font-mono',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <SudanFlag className="w-4 h-2.5" />
          <span className="font-semibold text-text">
            {isAr ? 'السودان · زراعة سيادية' : 'SUDAN · SOVEREIGN AGRI'}
          </span>
        </div>
        <span className="text-muted/40">·</span>
        <span className="text-[11px] text-muted/80">
          15.5007° N, 32.5599° E
        </span>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-mono text-muted',
          className
        )}
        {...props}
      >
        <SudanFlag className="w-3.5 h-2.5" />
        <span>{isAr ? 'السودان' : 'Sudan'}</span>
      </span>
    )
  }

  // Default 'pill'
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-surface text-xs font-mono text-text/90 shadow-xs',
        className
      )}
      {...props}
    >
      <SudanFlag className="w-4 h-2.5" />
      <span>{isAr ? 'بنية زراعية للسودان' : 'SUDAN AGRI-INFRASTRUCTURE'}</span>
    </div>
  )
}
