import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/config'
import type { SVGProps, HTMLAttributes } from 'react'

interface ZaratiMarkProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * ZARATI Master Vector Mark (SVG).
 * Authentic symbolism:
 * - Stylized 'Z': Sovereign infrastructure geometry.
 * - Upper canopy & leaf: Green agricultural life (#2E7D32 -> #43A047).
 * - Central diagonal: The Nile River confluence (#0F4C81 -> #0284C7).
 * - Base furrow: Rich Sudanese alluvial vertisol earth (#1B4D24 / #0D3B1E).
 * - Harvest accent: Golden Sesame / Sorghum seed node (#D4AF37).
 */
export function ZaratiMark({ size = 40, className, ...props }: ZaratiMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 select-none', className)}
      role="img"
      aria-label="ZARATI Mark"
      {...props}
    >
      <defs>
        {/* Agricultural Leaf Canopy Gradient */}
        <linearGradient id="zaratiGreenGrad" x1="6" y1="8" x2="42" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1B5E20" />
          <stop offset="60%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#43A047" />
        </linearGradient>

        {/* Nile River Confluence Gradient */}
        <linearGradient id="zaratiNileGrad" x1="38" y1="12" x2="10" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F4C81" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Fertile Vertisol Earth Gradient */}
        <linearGradient id="zaratiEarthGrad" x1="6" y1="34" x2="32" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D3B1E" />
          <stop offset="100%" stopColor="#1B4D24" />
        </linearGradient>

        {/* Golden Harvest Grain Gradient */}
        <radialGradient id="zaratiGoldGrad" cx="39" cy="36" r="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
      </defs>

      {/* 1. TOP LEAF & CANOPY BAR */}
      {/* Horizontal top of 'Z' tapering into an upward agricultural leaf shoot */}
      <path
        d="M 8 13.5 C 8 11.5, 9.5 10, 11.5 10 L 30 10 C 34.5 10, 39 7.5, 41.5 4.5 C 41 9.5, 37.5 13.5, 32.5 15 L 11.5 15 C 9.5 15, 8 14.5, 8 13.5 Z"
        fill="url(#zaratiGreenGrad)"
      />

      {/* 2. NILE CONFLUENCE DIAGONAL */}
      {/* Sweeping dynamic river flow forming the diagonal stroke of the 'Z' */}
      <path
        d="M 33 14 C 30 21, 23 27, 13 34"
        stroke="url(#zaratiNileGrad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Secondary White Nile current hint */}
      <path
        d="M 36 15 C 33.5 20, 27 25.5, 19 31.5"
        stroke="#38BDF8"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />

      {/* 3. BASELINE FURROW & ALLUVIAL SOIL */}
      {/* Sturdy cultivated earth baseline */}
      <rect
        x="8"
        y="33.5"
        width="24"
        height="4.5"
        rx="2.25"
        fill="url(#zaratiEarthGrad)"
      />

      {/* 4. GOLDEN GRAIN HARVEST NODE */}
      {/* Sesame / Sorghum seed head at the baseline terminal */}
      <circle cx="38.5" cy="35.75" r="3.25" fill="url(#zaratiGoldGrad)" />
      {/* Micro specular highlight on grain */}
      <circle cx="37.5" cy="34.75" r="1" fill="#FFFFFF" fillOpacity="0.8" />
    </svg>
  )
}

interface ZaratiLogoProps extends HTMLAttributes<HTMLDivElement> {
  lang?: Locale
  variant?: 'header' | 'footer' | 'auth' | 'mark' | 'full'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
}

/**
 * ZARATI Master Bilingual Identity Component.
 * Pure vector SVG master mark paired with typography in English and Arabic.
 * Crisp at all screen densities, eliminates raster artifacts and blend-mode hacks.
 */
export function ZaratiLogo({
  lang = 'en',
  variant = 'header',
  size = 'md',
  showTagline = false,
  className,
  ...props
}: ZaratiLogoProps) {
  const isAr = lang === 'ar'

  // Mark-only mode
  if (variant === 'mark') {
    const markSizes = { sm: 30, md: 38, lg: 48, xl: 60 }
    return <ZaratiMark size={markSizes[size]} className={className} />
  }

  // Header lockup: compact, perfectly balanced for 64px - 80px navbar
  if (variant === 'header') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2.5 sm:gap-3 select-none transition-opacity hover:opacity-95',
          className
        )}
        {...props}
      >
        <ZaratiMark size={size === 'sm' ? 32 : size === 'lg' ? 44 : 38} />
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-2 leading-none">
            {/* Latin Name */}
            <span className="font-extrabold tracking-[0.08em] text-text text-lg sm:text-xl font-sans">
              ZARATI
            </span>
            {/* Subtle Divider */}
            <span className="text-border-strong font-light text-base select-none">
              |
            </span>
            {/* Arabic Name */}
            <span className="font-arabic font-bold text-text text-lg sm:text-xl leading-none">
              زرعتي
            </span>
          </div>
          {/* Subtle National Agri Descriptor */}
          <span className={cn('mt-0.5 hidden sm:block', isAr ? 'text-[10.5px] font-arabic font-medium text-muted/90' : 'text-[9.5px] font-mono tracking-widest text-muted uppercase')}>
            {isAr ? 'البنية التحتية للذكاء الزراعي' : 'Agricultural Infrastructure'}
          </span>
        </div>
      </div>
    )
  }

  // Auth lockup: Centered, authoritative, used in Login, Register, Waitlist
  if (variant === 'auth') {
    return (
      <div
        className={cn('inline-flex flex-col items-center select-none text-center', className)}
        {...props}
      >
        <ZaratiMark size={56} className="mb-3" />
        <div className="flex items-baseline justify-center gap-2.5 leading-none">
          <span className="font-black tracking-[0.09em] text-text text-2xl font-sans">
            ZARATI
          </span>
          <span className="text-border-strong font-light text-xl select-none">
            |
          </span>
          <span className="font-arabic font-bold text-text text-2xl leading-none">
            زرعتي
          </span>
        </div>
        <p className={cn('mt-1.5', isAr ? 'text-xs font-arabic text-muted/90' : 'text-xs font-mono text-muted tracking-wider uppercase')}>
          {isAr ? 'منصة السودان الزراعية السيادية' : "Sudan's Sovereign Agri-Platform"}
        </p>
      </div>
    )
  }

  // Footer lockup: Richer with official bilingual taglines
  if (variant === 'footer') {
    return (
      <div
        className={cn('inline-flex flex-col select-none', className)}
        {...props}
      >
        <div className="flex items-center gap-3">
          <ZaratiMark size={44} />
          <div>
            <div className="flex items-baseline gap-2 leading-none">
              <span className="font-extrabold tracking-[0.08em] text-text text-xl font-sans">
                ZARATI
              </span>
              <span className="text-border-strong font-light text-lg select-none">
                |
              </span>
              <span className="font-arabic font-bold text-text text-xl leading-none">
                زرعتي
              </span>
            </div>
            <p className={cn('mt-0.5', isAr ? 'text-[11px] font-arabic font-medium text-muted/90' : 'text-[10px] font-mono tracking-widest text-muted uppercase')}>
              {isAr ? 'البنية التحتية للذكاء الزراعي' : 'Agricultural Intelligence Infrastructure'}
            </p>
          </div>
        </div>
        {showTagline && (
          <p className={cn('mt-2.5 leading-relaxed', isAr ? 'text-xs font-arabic text-muted/90' : 'text-xs text-muted/80 font-sans')}>
            {isAr
              ? 'الزراعة الذكية لمستقبل السودان'
              : "Smart Agriculture for Sudan's Future"}
          </p>
        )}
      </div>
    )
  }

  // Default 'full' variant
  return (
    <div
      className={cn('inline-flex items-center gap-3 select-none', className)}
      {...props}
    >
      <ZaratiMark size={42} />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2 leading-none">
          <span className="font-extrabold tracking-[0.08em] text-text text-xl font-sans">
            ZARATI
          </span>
          <span className="text-border-strong font-light text-lg select-none">
            |
          </span>
          <span className="font-arabic font-bold text-text text-xl leading-none">
            زرعتي
          </span>
        </div>
        {showTagline && (
          <span className={cn('mt-1', isAr ? 'text-[11px] font-arabic text-muted/90' : 'text-[10px] font-mono text-muted uppercase tracking-wider')}>
            {isAr ? 'الزراعة الذكية لمستقبل السودان' : "Smart Agriculture for Sudan's Future"}
          </span>
        )}
      </div>
    </div>
  )
}
