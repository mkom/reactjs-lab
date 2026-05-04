import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransactions } from '@/hooks/useTransaction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, ArrowUpCircle, ArrowDownCircle, Package, Loader2 } from 'lucide-react'

export const TransactionPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [type, setType] = useState<'' | 'STOCK_IN' | 'STOCK_OUT'>('')
  const { data, isLoading } = useTransactions({ page, limit: 10, type, search })

  const getTypeBadge = (type: 'STOCK_IN' | 'STOCK_OUT') => {
    if (type === 'STOCK_IN') {
      return <Badge variant="success">Stock In</Badge>
    }
    return <Badge variant="danger">Stock Out</Badge>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Manage stock in and stock out transactions"
      >
        <Link to="/transactions/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </Link>
      </PageHeader>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-10"
          />
        </div>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as '' | 'STOCK_IN' | 'STOCK_OUT')
            setPage(1)
          }}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value="STOCK_IN">Stock In</option>
          <option value="STOCK_OUT">Stock Out</option>
        </select>
      </div>

      {isLoading ? (
        <Card className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </Card>
      ) : !data?.transactions.length ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 text-center">No transactions found</p>
          <Link to="/transactions/new" className="mt-4">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create your first transaction
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="w-[80px]">#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.transactions.map((transaction, index) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium text-slate-500">
                      {(page - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${
                            transaction.type === 'STOCK_IN'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {transaction.type === 'STOCK_IN' ? (
                            <ArrowUpCircle className="h-4 w-4" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4" />
                          )}
                        </div>
                        <span className="font-medium text-slate-900">{transaction.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getTypeBadge(transaction.type)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {transaction.quantity} units
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {transaction.note || '-'}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {data.transactions.length} of {data.total} transactions
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
