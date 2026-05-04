import * as React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  variant?: 'default' | 'warning' | 'danger' | 'success'
  className?: string
  trend?: number
  trendLabel?: string
}

export const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ title, value, icon, description, variant = 'default', className, trend, trendLabel }, ref) => {
    const variantStyles = {
      default: 'bg-white',
      warning: 'bg-amber-50/50 border-amber-200',
      danger: 'bg-red-50/50 border-red-200',
      success: 'bg-emerald-50/50 border-emerald-200',
    }

    const isPositiveTrend = trend && trend > 0
    const isNegativeTrend = trend && trend < 0

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200',
          variantStyles[variant],
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-semibold text-slate-900 mt-2 font-outfit">{value}</p>
            
            {trend !== undefined && (
              <div className="flex items-center gap-1.5 mt-2">
                <div
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full',
                    isPositiveTrend && 'bg-emerald-100 text-emerald-700',
                    isNegativeTrend && 'bg-red-100 text-red-700',
                    !isPositiveTrend && !isNegativeTrend && 'bg-slate-100 text-slate-600'
                  )}
                >
                  {isPositiveTrend && <TrendingUp className="h-3 w-3" />}
                  {isNegativeTrend && <TrendingDown className="h-3 w-3" />}
                  <span>{isPositiveTrend ? '+' : ''}{trend}%</span>
                </div>
                {trendLabel && (
                  <span className="text-xs text-slate-400">{trendLabel}</span>
                )}
              </div>
            )}
            
            {description && !trend && (
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-slate-100 rounded-xl">
              {icon}
            </div>
          )}
        </div>
      </div>
    )
  }
)
StatsCard.displayName = 'StatsCard'
