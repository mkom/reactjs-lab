export interface User {
  id: string
  name: string
  email: string
  role: string
}

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

export interface Transaction {
  id: string
  type: 'STOCK_IN' | 'STOCK_OUT'
  productId: string
  productName: string
  quantity: number
  note?: string
  createdAt: string
}

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Food', 'Beauty']

export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'user@example.com', role: 'admin' },
]

const generateProducts = (): Product[] => {
  const products: Product[] = []
  
  for (let i = 1; i <= 20; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
    products.push({
      id: String(i),
      name: `${category} Product ${i}`,
      description: `High-quality ${category.toLowerCase()} item. Perfect for everyday use. Made with premium materials and excellent craftsmanship.`,
      price: Math.round((Math.random() * 500 + 10) * 100) / 100,
      category,
      stock: Math.floor(Math.random() * 100) + 1,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
  
  return products
}

const generateTransactions = (products: Product[]): Transaction[] => {
  const transactions: Transaction[] = []
  
  for (let i = 1; i <= 15; i++) {
    const product = products[Math.floor(Math.random() * products.length)]
    const type = Math.random() > 0.5 ? 'STOCK_IN' : 'STOCK_OUT'
    
    transactions.push({
      id: String(i),
      type,
      productId: product.id,
      productName: product.name,
      quantity: Math.floor(Math.random() * 50) + 1,
      note: type === 'STOCK_IN' ? 'Stock received from supplier' : 'Stock sold to customer',
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  
  // Sort by date desc
  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const PRODUCTS_KEY = 'mock_products'
const TRANSACTIONS_KEY = 'mock_transactions'

const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  const products = generateProducts()
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  return products
}

const getStoredTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(TRANSACTIONS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  const transactions = generateTransactions(getStoredProducts())
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  return transactions
}

export const resetMockData = () => {
  localStorage.removeItem(PRODUCTS_KEY)
  localStorage.removeItem(TRANSACTIONS_KEY)
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
}

export const getProducts = (): Product[] => getStoredProducts()

export const setProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export const getTransactions = (): Transaction[] => getStoredTransactions()

export const setTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const randomDelay = () => delay(Math.random() * 500 + 500)
