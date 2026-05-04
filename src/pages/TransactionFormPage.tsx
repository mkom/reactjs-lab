import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProducts } from '@/hooks/useProduct'
import { useCreateTransaction } from '@/hooks/useTransaction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

const transactionSchema = z.object({
  type: z.enum(['STOCK_IN', 'STOCK_OUT']),
  productId: z.string().min(1, 'Product is required'),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Quantity must be a positive number',
  }),
  note: z.string().optional(),
})

type TransactionForm = z.infer<typeof transactionSchema>

export const TransactionFormPage = () => {
  const navigate = useNavigate()
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 1000 })
  const createTransaction = useCreateTransaction()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'STOCK_IN',
    },
  })

  const selectedType = watch('type')
  const selectedProductId = watch('productId')
  const selectedProduct = productsData?.products.find(p => p.id === selectedProductId)

  const onSubmit = async (data: TransactionForm) => {
    try {
      // Validate stock for STOCK_OUT
      if (data.type === 'STOCK_OUT' && selectedProduct) {
        const qty = Number(data.quantity)
        if (qty > selectedProduct.stock) {
          toast.error(`Insufficient stock. Available: ${selectedProduct.stock}`)
          return
        }
      }

      await createTransaction.mutateAsync({
        type: data.type,
        productId: data.productId,
        quantity: Number(data.quantity),
        note: data.note,
      })
      
      toast.success('Transaction created successfully')
      navigate('/transactions')
    } catch (err: unknown) {
      const error = err as { message?: string }
      toast.error(error.message || 'Failed to create transaction')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="New Transaction"
        description="Create a stock in or stock out transaction"
      >
        <Button variant="outline" onClick={() => navigate('/transactions')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Fill in the transaction information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="STOCK_IN"
                    {...register('type')}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Stock In (Add Stock)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="STOCK_OUT"
                    {...register('type')}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Stock Out (Remove Stock)</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              {isLoadingProducts ? (
                <div className="text-sm text-slate-500">Loading products...</div>
              ) : (
                <>
                  <select
                    id="product"
                    {...register('productId')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                  >
                    <option value="">Select a product</option>
                    {productsData?.products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stock: {product.stock})
                      </option>
                    ))}
                  </select>
                  {errors.productId && (
                    <p className="text-sm text-red-500">{errors.productId.message}</p>
                  )}
                  {selectedProduct && (
                    <p className="text-sm text-slate-600">
                      Current Stock: <span className="font-medium">{selectedProduct.stock}</span>
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Enter quantity"
                {...register('quantity')}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity.message}</p>
              )}
              {selectedType === 'STOCK_OUT' && selectedProduct && (
                <p className="text-xs text-slate-500">
                  Maximum available: {selectedProduct.stock}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input
                id="note"
                placeholder="Add a note about this transaction"
                {...register('note')}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createTransaction.isPending}>
                {createTransaction.isPending ? 'Creating...' : 'Create Transaction'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/transactions')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
