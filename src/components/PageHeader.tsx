import * as React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, children, className }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-start justify-between mb-6', className)}>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-outfit">{title}</h1>
          {description && (
            <p className="text-slate-500 mt-1 text-sm">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    )
  }
)
PageHeader.displayName = 'PageHeader'
