import api from './api'
import { ENDPOINTS } from './endpoints'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  stock: number
  createdAt?: string
  updatedAt?: string
}

export interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  category: string
  image?: string
  stock: number
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export const productService = {
  getProducts: async (params: ProductFilters = {}): Promise<ProductListResponse> => {
    const { page = 1, limit = 10, search = '', category = '' } = params
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (search) queryParams.append('search', search)
    if (category) queryParams.append('category', category)
    return api.get(`${ENDPOINTS.PRODUCTS.LIST}?${queryParams}`) as Promise<ProductListResponse>
  },

  getProduct: async (id: string): Promise<Product> => {
    return api.get(ENDPOINTS.PRODUCTS.DETAIL(id)) as Promise<Product>
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    return api.post(ENDPOINTS.PRODUCTS.CREATE, data) as Promise<Product>
  },

  updateProduct: async (id: string, data: UpdateProductData): Promise<Product> => {
    return api.put(ENDPOINTS.PRODUCTS.UPDATE(id), data) as Promise<Product>
  },

  deleteProduct: async (id: string): Promise<void> => {
    return api.delete(ENDPOINTS.PRODUCTS.DELETE(id)) as Promise<void>
  },
}