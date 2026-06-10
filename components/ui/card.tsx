import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-surface rounded-xl border border-border shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}
