import { useAuthStore } from '@/store/authStore'
import { useProducts } from '@/hooks/useProduct'
import { useTransactions } from '@/hooks/useTransaction'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/StatsCard'
import { Badge } from '@/components/Badge'
import { StockTrendChart } from '@/components/charts/StockTrendChart'
import { TransactionChart } from '@/components/charts/TransactionChart'
import { PageHeader } from '@/components/PageHeader'
import {
  Package,
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  Boxes,
} from 'lucide-react'
import { useMemo } from 'react'

// Generate mock trend data for the last 7 days
const generateStockTrendData = () => {
  const data = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      stock: Math.floor(Math.random() * 200) + 300,
    })
  }
  return data
}

// Generate mock transaction data for the last 7 days
const generateTransactionData = () => {
  const data = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      stockIn: Math.floor(Math.random() * 50) + 10,
      stockOut: Math.floor(Math.random() * 40) + 5,
    })
  }
  return data
}

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user)
  const { data: productsData } = useProducts({ limit: 1000 })
  const { data: transactionsData } = useTransactions({ limit: 10 })

  // Calculate stats
  const products = productsData?.products || []
  const transactions = transactionsData?.transactions || []

  const totalProducts = products.length
  const lowStockCount = products.filter((p) => p.stock < 10 && p.stock > 0).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length
  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

  // Calculate transaction stats
  const stockInCount = transactions.filter((t) => t.type === 'STOCK_IN').length
  const stockOutCount = transactions.filter((t) => t.type === 'STOCK_OUT').length

  // Generate chart data
  const stockTrendData = useMemo(() => generateStockTrendData(), [])
  const transactionData = useMemo(() => generateTransactionData(), [])

  const getTypeBadge = (type: 'STOCK_IN' | 'STOCK_OUT') => {
    if (type === 'STOCK_IN') {
      return <Badge variant="success">Stock In</Badge>
    }
    return <Badge variant="danger">Stock Out</Badge>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.name || 'User'}! Here's what's happening with your inventory today.`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          trend={12.5}
          trendLabel="from last month"
          icon={<Boxes className="h-5 w-5 text-slate-700" />}
          description="Active products in inventory"
        />

        <StatsCard
          title="Total Stock Value"
          value={`$${totalStockValue.toLocaleString()}`}
          trend={20.1}
          trendLabel="from last month"
          icon={<DollarSign className="h-5 w-5 text-slate-700" />}
          description="Value of all inventory"
        />

        <StatsCard
          title="Low Stock Items"
          value={lowStockCount}
          variant={lowStockCount > 0 ? 'warning' : 'default'}
          trend={lowStockCount > 0 ? 15.3 : undefined}
          trendLabel="needs attention"
          icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
          description="Products below 10 units"
        />

        <StatsCard
          title="Out of Stock"
          value={outOfStockCount}
          variant={outOfStockCount > 0 ? 'danger' : 'default'}
          trend={outOfStockCount > 0 ? -5.2 : undefined}
          trendLabel="from last week"
          icon={<Package className="h-5 w-5 text-red-600" />}
          description="Products with zero stock"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockTrendChart
          data={stockTrendData}
          title="Stock Level Trend"
          description="Total inventory stock over the last 7 days"
        />
        <TransactionChart
          data={transactionData}
          title="Transaction Activity"
          description="Daily stock in vs stock out movements"
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-slate-900">Recent Transactions</CardTitle>
            <div className="flex gap-2 text-sm">
              <span className="flex items-center gap-1 text-emerald-600">
                <ArrowUpCircle className="h-4 w-4" />
                {stockInCount} In
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <ArrowDownCircle className="h-4 w-4" />
                {stockOutCount} Out
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No recent transactions</p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          transaction.type === 'STOCK_IN'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {transaction.type === 'STOCK_IN' ? (
                          <ArrowUpCircle className="h-5 w-5" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{transaction.productName}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getTypeBadge(transaction.type)}
                      <p className="text-sm font-semibold text-slate-900 mt-1">
                        {transaction.quantity} units
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockCount === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm text-slate-500">All products are well stocked</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products
                  .filter((p) => p.stock < 10 && p.stock > 0)
                  .slice(0, 5)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-amber-50/50 rounded-xl border border-amber-100"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="warning">{product.stock} left</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
