import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface PageWrapperProps extends HTMLAttributes<HTMLDivElement> {
  narrow?: boolean
}

export function PageWrapper({ narrow, className, children, ...props }: PageWrapperProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8 py-10',
        narrow ? 'max-w-4xl' : 'max-w-7xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
