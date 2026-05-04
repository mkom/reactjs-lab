import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionService, type TransactionFilters, type CreateTransactionData } from '@/services/transactionService'

const TRANSACTION_KEYS = {
  all: ['transactions'] as const,
  lists: () => [...TRANSACTION_KEYS.all, 'list'] as const,
  list: (filters: TransactionFilters) => [...TRANSACTION_KEYS.lists(), filters] as const,
  details: () => [...TRANSACTION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TRANSACTION_KEYS.details(), id] as const,
}

export const useTransactions = (filters: TransactionFilters = {}) => {
  return useQuery({
    queryKey: TRANSACTION_KEYS.list(filters),
    queryFn: () => transactionService.getTransactions(filters),
    placeholderData: (previousData) => previousData,
  })
}

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: TRANSACTION_KEYS.detail(id),
    queryFn: () => transactionService.getTransaction(id),
    enabled: !!id,
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionData) => transactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.lists() })
    },
  })
}

export const useUpdateProductStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, quantity, type }: { productId: string; quantity: number; type: 'STOCK_IN' | 'STOCK_OUT' }) =>
      transactionService.updateProductStock(productId, quantity, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
