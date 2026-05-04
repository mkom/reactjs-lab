import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface StockTrendChartProps {
  data: { date: string; stock: number }[]
  title?: string
  description?: string
}

export const StockTrendChart = ({ data, title = 'Stock Trend', description }: StockTrendChartProps) => {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="stock" 
                stroke="#0f172a" 
                fillOpacity={1} 
                fill="url(#colorStock)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}