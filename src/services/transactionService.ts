import api from './api'
import { ENDPOINTS } from './endpoints'

export interface Transaction {
  id: string
  type: 'STOCK_IN' | 'STOCK_OUT'
  productId: string
  productName: string
  quantity: number
  note?: string
  createdAt: string
}

export interface TransactionFilters {
  page?: number
  limit?: number
  type?: 'STOCK_IN' | 'STOCK_OUT' | ''
  search?: string
}

export interface TransactionListResponse {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateTransactionData {
  type: 'STOCK_IN' | 'STOCK_OUT'
  productId: string
  quantity: number
  note?: string
}

export const transactionService = {
  getTransactions: async (params: TransactionFilters = {}): Promise<TransactionListResponse> => {
    const { page = 1, limit = 10, type = '', search = '' } = params
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (type) queryParams.append('type', type)
    if (search) queryParams.append('search', search)
    return api.get(`${ENDPOINTS.TRANSACTIONS.LIST}?${queryParams}`) as Promise<TransactionListResponse>
  },

  getTransaction: async (id: string): Promise<Transaction> => {
    return api.get(ENDPOINTS.TRANSACTIONS.DETAIL(id)) as Promise<Transaction>
  },

  createTransaction: async (data: CreateTransactionData): Promise<Transaction> => {
    return api.post(ENDPOINTS.TRANSACTIONS.CREATE, data) as Promise<Transaction>
  },

  updateProductStock: async (productId: string, quantity: number, type: 'STOCK_IN' | 'STOCK_OUT'): Promise<void> => {
    return api.put(ENDPOINTS.TRANSACTIONS.UPDATE_STOCK(productId), { quantity, type }) as Promise<void>
  },
}
