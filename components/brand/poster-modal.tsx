'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

interface PosterModalProps {
  src: string
  alt: string
  title?: string
  className?: string
  priority?: boolean
  aspectRatioClass?: string
}

export function PosterModal({
  src,
  alt,
  title,
  className = '',
  priority = false,
  aspectRatioClass = 'aspect-[1145/1374]',
}: PosterModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:shadow-2xl hover:border-primary/50 ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
        aria-label={`توسيع البوستر: ${title || alt}`}
      >
        <div className={`relative ${aspectRatioClass} w-full overflow-hidden bg-black/5`}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 dark:bg-surface/95 backdrop-blur-sm px-4 py-2 text-xs font-bold text-text shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <ZoomIn className="w-4 h-4 text-primary" />
              <span>عرض البوستر بدقة كاملة</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 transition-opacity animate-in fade-in"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 hover:bg-white/20 text-white p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-h-[92vh] max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-auto overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[1145/1374] w-full max-h-[85vh]">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                priority
                quality={100}
                className="object-contain"
              />
            </div>
            {title && (
              <div className="p-3 sm:p-4 bg-[#0a1a0f] border-t border-white/10 text-center">
                <p className="text-white text-sm sm:text-base font-bold font-cairo">{title}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}