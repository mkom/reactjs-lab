import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts, useDeleteProduct } from '@/hooks/useProduct'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Search, Package, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const getStockStatus = (stock: number) => {
  if (stock === 0) return { variant: 'danger' as const, label: 'Out of Stock' }
  if (stock < 10) return { variant: 'warning' as const, label: 'Low Stock' }
  return { variant: 'success' as const, label: 'In Stock' }
}

export const ProductListPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useProducts({ page, limit: 10, search })
  const deleteProduct = useDeleteProduct()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct.mutateAsync(id)
      toast.success('Product deleted successfully')
    } catch (err: unknown) {
      const error = err as { message?: string }
      toast.error(error.message || 'Failed to delete product')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product inventory"
      >
        <Link to="/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </PageHeader>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <Card className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </Card>
      ) : !data?.products.length ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 text-center">No products found</p>
          <Link to="/products/new" className="mt-4">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add your first product
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
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.products.map((product, index) => {
                  const status = getStockStatus(product.stock)
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium text-slate-500">
                        {(page - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {product.stock}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/products/${product.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Edit className="h-4 w-4 text-slate-500" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 hover:bg-red-50"
                            onClick={() => handleDelete(product.id)}
                            disabled={deleteProduct.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {data.products.length} of {data.total} products
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
