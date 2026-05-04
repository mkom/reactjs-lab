import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface TransactionChartProps {
  data: { date: string; stockIn: number; stockOut: number }[]
  title?: string
  description?: string
}

export const TransactionChart = ({ data, title = 'Transactions', description }: TransactionChartProps) => {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <Legend 
                wrapperStyle={{ paddingTop: '16px' }}
              />
              <Bar 
                dataKey="stockIn" 
                name="Stock In"
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="stockOut" 
                name="Stock Out"
                fill="#ef4444" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}