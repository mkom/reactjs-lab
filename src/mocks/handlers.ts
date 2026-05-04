import { http, HttpResponse } from 'msw'
import { getProducts, setProducts, getTransactions, setTransactions, mockUsers, randomDelay, resetMockData } from './data'
import type { Product, Transaction } from './data'

let currentUser = mockUsers[0]

export const handlers = [
  // AUTH HANDLERS
  http.post('/api/auth/login', async ({ request }) => {
    await randomDelay()
    
    const body = await request.json() as { email: string; password: string }
    
    if (body.email === 'user@example.com' && body.password === 'password') {
      const token = 'mock_jwt_token_' + Date.now()
      const refreshToken = 'mock_refresh_token_' + Date.now()
      localStorage.setItem('token', token)
      localStorage.setItem('refresh_token', refreshToken)
      
      return HttpResponse.json({
        user: currentUser,
        token,
        refresh_token: refreshToken,
      })
    }
    
    return HttpResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    )
  }),

  http.post('/api/auth/register', async ({ request }) => {
    await randomDelay()
    
    const body = await request.json() as { name: string; email: string; password: string }
    
    const newUser = {
      id: String(Date.now()),
      name: body.name,
      email: body.email,
      role: 'user',
    }
    
    const token = 'mock_jwt_token_' + Date.now()
    const refreshToken = 'mock_refresh_token_' + Date.now()
    localStorage.setItem('token', token)
    localStorage.setItem('refresh_token', refreshToken)
    currentUser = newUser
    
    return HttpResponse.json({
      user: newUser,
      token,
      refresh_token: refreshToken,
    })
  }),

  http.post('/api/auth/logout', async () => {
    await randomDelay()
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/me', async () => {
    await randomDelay()
    
    const token = localStorage.getItem('token')
    if (!token) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return HttpResponse.json(currentUser)
  }),

  http.post('/api/auth/refresh', async () => {
    await randomDelay()
    
    const newToken = 'mock_jwt_token_' + Date.now()
    localStorage.setItem('token', newToken)
    
    return HttpResponse.json({
      access_token: newToken,
    })
  }),

  // PRODUCT HANDLERS
  http.get('/api/products', async ({ request }) => {
    await randomDelay()
    
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    const category = url.searchParams.get('category') || ''
    
    let products = getProducts()
    
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (category) {
      products = products.filter(p => p.category === category)
    }
    
    const total = products.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedProducts = products.slice(start, end)
    
    return HttpResponse.json({
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
    })
  }),

  http.get('/api/products/:id', async ({ params }) => {
    await randomDelay()
    
    const products = getProducts()
    const product = products.find(p => p.id === params.id)
    
    if (!product) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(product)
  }),

  http.post('/api/products', async ({ request }) => {
    await randomDelay()
    
    const body = await request.json() as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
    const products = getProducts()
    
    const newProduct: Product = {
      ...body,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    products.push(newProduct)
    setProducts(products)
    
    return HttpResponse.json(newProduct, { status: 201 })
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    await randomDelay()
    
    const body = await request.json() as Partial<Product>
    const products = getProducts()
    const index = products.findIndex(p => p.id === params.id)
    
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    products[index] = {
      ...products[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    
    setProducts(products)
    
    return HttpResponse.json(products[index])
  }),

  http.delete('/api/products/:id', async ({ params }) => {
    await randomDelay()
    
    const products = getProducts()
    const filtered = products.filter(p => p.id !== params.id)
    
    if (filtered.length === products.length) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    setProducts(filtered)
    
    return HttpResponse.json({ success: true })
  }),

  // TRANSACTION HANDLERS
  http.get('/api/transactions', async ({ request }) => {
    await randomDelay()
    
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const type = url.searchParams.get('type') || ''
    const search = url.searchParams.get('search') || ''
    
    let transactions = getTransactions()
    
    if (type) {
      transactions = transactions.filter(t => t.type === type)
    }
    
    if (search) {
      transactions = transactions.filter(t => 
        t.productName.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    const total = transactions.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedTransactions = transactions.slice(start, end)
    
    return HttpResponse.json({
      transactions: paginatedTransactions,
      total,
      page,
      limit,
      totalPages,
    })
  }),

  http.get('/api/transactions/:id', async ({ params }) => {
    await randomDelay()
    
    const transactions = getTransactions()
    const transaction = transactions.find(t => t.id === params.id)
    
    if (!transaction) {
      return HttpResponse.json(
        { message: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(transaction)
  }),

  http.post('/api/transactions', async ({ request }) => {
    await randomDelay()
    
    const body = await request.json() as { type: 'STOCK_IN' | 'STOCK_OUT'; productId: string; quantity: number; note?: string }
    const products = getProducts()
    const product = products.find(p => p.id === body.productId)
    
    if (!product) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Validate stock for STOCK_OUT
    if (body.type === 'STOCK_OUT' && body.quantity > product.stock) {
      return HttpResponse.json(
        { message: 'Insufficient stock available' },
        { status: 422 }
      )
    }
    
    const transactions = getTransactions()
    
    const newTransaction: Transaction = {
      id: String(Date.now()),
      type: body.type,
      productId: body.productId,
      productName: product.name,
      quantity: body.quantity,
      note: body.note,
      createdAt: new Date().toISOString(),
    }
    
    // Update product stock
    if (body.type === 'STOCK_IN') {
      product.stock += body.quantity
    } else {
      product.stock -= body.quantity
    }
    product.updatedAt = new Date().toISOString()
    
    // Save data
    transactions.unshift(newTransaction)
    setProducts(products)
    setTransactions(transactions)
    
    return HttpResponse.json(newTransaction, { status: 201 })
  }),

  http.put('/api/products/:id/stock', async ({ params, request }) => {
    await randomDelay()
    
    const body = await request.json() as { quantity: number; type: 'STOCK_IN' | 'STOCK_OUT' }
    const products = getProducts()
    const index = products.findIndex(p => p.id === params.id)
    
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    if (body.type === 'STOCK_OUT' && body.quantity > products[index].stock) {
      return HttpResponse.json(
        { message: 'Insufficient stock available' },
        { status: 422 }
      )
    }
    
    if (body.type === 'STOCK_IN') {
      products[index].stock += body.quantity
    } else {
      products[index].stock -= body.quantity
    }
    products[index].updatedAt = new Date().toISOString()
    
    setProducts(products)
    
    return HttpResponse.json({ success: true })
  }),
]

export { resetMockData }
