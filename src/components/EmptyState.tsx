import * as React from 'react'
import { cn } from '@/lib/utils'
import { Package } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ 
    title = 'No data found', 
    description = 'There are no items to display at the moment.',
    icon,
    action,
    className 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className
        )}
      >
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          {icon || <Package className="h-8 w-8 text-slate-400" />}
        </div>
        <h3 className="text-lg font-medium text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = 'EmptyState'
