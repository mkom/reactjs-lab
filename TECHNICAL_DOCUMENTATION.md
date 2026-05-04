# Technical Documentation - ReactJS Lab

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [UI Design System](#ui-design-system)
3. [Inventory Management System](#inventory-management-system)
4. [API Layer](#api-layer)
5. [State Management](#state-management)
6. [Routing](#routing)
7. [Authentication Flow](#authentication-flow)
8. [Mock System](#mock-system)
9. [Error Handling Strategy](#error-handling-strategy)

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         React App                            │
├─────────────────────────────────────────────────────────────┤
│  Pages  │  Components  │  Hooks  │  Store  │  Services      │
├─────────────────────────────────────────────────────────────┤
│                    TanStack Query                            │
├─────────────────────────────────────────────────────────────┤
│                      Zustand Store                           │
├─────────────────────────────────────────────────────────────┤
│                   Service Layer (Axios)                      │
├─────────────────────────────────────────────────────────────┤
│  Real API  │  MSW Mock API  │  LocalStorage (Persistence)   │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Category | Technology |
|----------|------------|
| Build Tool | Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| Typography | Google Font Outfit |
| State (Server) | TanStack Query |
| State (Client) | Zustand |
| Charts | Recharts |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Mock API | MSW |
| Notifications | Sonner |

### Data Flow

```
User Action → Component → Hook → Service → API → Backend/Mock
     ↑                                                    ↓
     └────────────── Response ← Hook ← Service ←──────────┘
```

## UI Design System

### Typography - Google Font Outfit

The project uses **Google Font Outfit** for clean, modern typography.

**Configuration:**
```html
<!-- index.html -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
}
```

**Usage:**
```tsx
<h1 className="text-2xl font-semibold font-outfit">Title</h1>
```

### Color System

Clean white theme with slate accents:

| Color | Usage | Tailwind |
|-------|-------|----------|
| Background | Main app background | `bg-white`, `bg-gray-50` |
| Primary Text | Headlines, important text | `text-slate-900` |
| Secondary Text | Descriptions, labels | `text-slate-500`, `text-slate-600` |
| Borders | Cards, inputs borders | `border-slate-200` |
| Success | Positive actions, stock in | `text-emerald-600`, `bg-emerald-100` |
| Warning | Caution states, low stock | `text-amber-600`, `bg-amber-100` |
| Danger | Errors, out of stock | `text-red-600`, `bg-red-100` |

### Component Styling Patterns

**Cards:**
```tsx
<Card className="shadow-sm border-slate-200">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**Tables:**
```tsx
<Card className="shadow-sm border-slate-200 overflow-hidden">
  <Table>
    <TableHeader>
      <TableRow className="bg-slate-50/50">
        <TableHead>Column</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Data</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</Card>
```

**Buttons:**
```tsx
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
```

### Layout - SidebarLayout

**File:** `src/components/SidebarLayout.tsx`

The SidebarLayout provides a collapsible sidebar navigation with header.

**Features:**
- Collapsible sidebar (20px collapsed, 256px expanded)
- Active state highlighting for current route
- Mobile responsive drawer
- Top header with breadcrumb
- User menu display
- Search and notification icons

**Structure:**
```
┌────────────────────────────────────────────┐
│  Logo    │  Header (breadcrumb, user, menu) │
├──────────┼──────────────────────────────────┤
│  Nav     │                                  │
│  ───     │     Main Content                  │
│  Menu    │     (Outlet)                      │
│  Items   │                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

**Navigation Items:**
| Path | Label | Icon |
|------|-------|------|
| `/dashboard` | Dashboard | LayoutDashboard |
| `/products` | Products | Package |
| `/transactions` | Transactions | ArrowLeftRight |

**Usage:**
```tsx
<Route
  element={
    <ProtectedRoute>
      <SidebarLayout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/products" element={<ProductListPage />} />
  <Route path="/transactions" element={<TransactionPage />} />
</Route>
```

## UI Components Library

### Base Components (`src/components/ui/`)

| Component | File | Description |
|-----------|------|-------------|
| Button | `button.tsx` | Polymorphic button with variants |
| Card | `card.tsx` | Card container with header, content, footer |
| Input | `input.tsx` | Text input with styling |
| Label | `label.tsx` | Form label |
| Table | `table.tsx` | Table with header, body, row, head, cell |

### Application Components (`src/components/`)

| Component | File | Description |
|-----------|------|-------------|
| Badge | `Badge.tsx` | Status badge with variants |
| EmptyState | `EmptyState.tsx` | Empty state display |
| PageHeader | `PageHeader.tsx` | Page title with actions slot |
| SidebarLayout | `SidebarLayout.tsx` | Main layout with sidebar |
| StatsCard | `StatsCard.tsx` | Dashboard stat with trend |

### Chart Components (`src/components/charts/`)

| Component | File | Description |
|-----------|------|-------------|
| StockTrendChart | `StockTrendChart.tsx` | Area chart for stock trends |
| TransactionChart | `TransactionChart.tsx` | Bar chart for transactions |
| index | `index.ts` | Barrel exports |

### StatsCard Component

Enhanced stats card with trend indicators:

```tsx
interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  variant?: 'default' | 'warning' | 'danger' | 'success'
  trend?: number
  trendLabel?: string
}
```

**Usage:**
```tsx
<StatsCard
  title="Total Products"
  value={100}
  trend={12.5}
  trendLabel="from last month"
  icon={<Package className="h-5 w-5" />}
  description="Active products in inventory"
  variant="default"
/>
```

### Chart Components

**StockTrendChart (Area Chart):**
```tsx
interface StockTrendData {
  date: string
  stock: number
}

<StockTrendChart
  data={[
    { date: 'Mon', stock: 320 },
    { date: 'Tue', stock: 340 },
    { date: 'Wed', stock: 310 },
  ]}
  title="Stock Level Trend"
  description="Total inventory over 7 days"
/>
```

**TransactionChart (Bar Chart):**
```tsx
interface TransactionData {
  date: string
  stockIn: number
  stockOut: number
}

<TransactionChart
  data={[
    { date: 'Mon', stockIn: 50, stockOut: 30 },
    { date: 'Tue', stockIn: 40, stockOut: 25 },
  ]}
  title="Transaction Activity"
  description="Daily stock in vs stock out"
/>
```

### Table Component

**Parts:**
- `Table` - Container with overflow scroll
- `TableHeader` - Header section
- `TableBody` - Body section
- `TableRow` - Row with hover effects
- `TableHead` - Header cell
- `TableCell` - Data cell

**Usage:**
```tsx
<Card className="shadow-sm border-slate-200 overflow-hidden">
  <Table>
    <TableHeader>
      <TableRow className="bg-slate-50/50">
        <TableHead>Name</TableHead>
        <TableHead>Category</TableHead>
        <TableHead className="text-right">Price</TableHead>
        <TableHead className="text-center">Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {products.map((product) => (
        <TableRow key={product.id}>
          <TableCell>{product.name}</TableCell>
          <TableCell>{product.category}</TableCell>
          <TableCell className="text-right">${product.price}</TableCell>
          <TableCell className="text-center">
            <Badge variant="success">In Stock</Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">Edit</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Card>
```

## Inventory Management System

### System Overview

The boilerplate includes a complete Inventory Management System with:

1. **Dashboard** - Real-time statistics, charts, and alerts
2. **Products Management** - Full CRUD operations with table view
3. **Stock Transactions** - Track inventory movements with table view
4. **Auto-updates** - Related data updates automatically

### Data Models

#### Product
```typescript
interface Product {
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
```

#### Transaction
```typescript
interface Transaction {
  id: string
  type: 'STOCK_IN' | 'STOCK_OUT'
  productId: string
  productName: string
  quantity: number
  note?: string
  createdAt: string
}
```

### Dashboard Statistics Calculation

```typescript
// Real-time stats calculated from products data
const stats = {
  totalProducts: products.length,
  totalStockValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  lowStockItems: products.filter(p => p.stock < 10 && p.stock > 0).length,
  outOfStockItems: products.filter(p => p.stock === 0).length,
}
```

### Stock Transaction Flow

```
User creates transaction
         ↓
MSW Handler validates stock (for STOCK_OUT)
         ↓
Create transaction record
         ↓
Update product stock (+ for IN, - for OUT)
         ↓
Save both to localStorage
         ↓
Return success response
         ↓
TanStack Query invalidates queries
         ↓
Dashboard & Products auto-refresh
```

### Key Pattern: Transaction Auto-Update

When a transaction is created, multiple queries are invalidated:

```typescript
// hooks/useTransaction.ts
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.lists() })
      // Invalidate products (stock changed)
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
```

### MSW Transaction Handler

```typescript
http.post('/api/transactions', async ({ request }) => {
  await randomDelay()
  const body = await request.json()

  // 1. Validate stock availability
  const product = products.find(p => p.id === body.productId)
  if (body.type === 'STOCK_OUT' && body.quantity > product.stock) {
    return HttpResponse.json(
      { message: 'Insufficient stock available' },
      { status: 422 }
    )
  }

  // 2. Create transaction
  const transaction = { id: String(Date.now()), ...body }

  // 3. Update product stock
  if (body.type === 'STOCK_IN') {
    product.stock += body.quantity
  } else {
    product.stock -= body.quantity
  }

  // 4. Persist both
  transactions.push(transaction)
  setProducts(products)
  setTransactions(transactions)

  return HttpResponse.json(transaction, { status: 201 })
})
```

## API Layer

### Axios Configuration

**File**: `src/services/api.ts`

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})
```

### Request Interceptor

Attaches JWT token to all requests:

```typescript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
```

### Response Interceptor

Handles common error scenarios:

| Status | Code | Action |
|--------|------|--------|
| 401 | UNAUTHORIZED | Attempt refresh token → Redirect to login |
| 403 | FORBIDDEN | Return permission error |
| 404 | NOT_FOUND | Return not found error |
| 422 | VALIDATION_ERROR | Return validation errors |
| 500+ | SERVER_ERROR | Return server error |

```typescript
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    // 401 - Try refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post('/api/auth/refresh', { refreshToken })
        const { access_token } = response.data
        localStorage.setItem('token', access_token)
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch {
        // Refresh failed - logout
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    // ... other error handling
  }
)
```

### Service Layer Pattern

Each domain has its own service:

```typescript
// services/productService.ts
export const productService = {
  getProducts: async (params?: ProductFilters): Promise<ProductListResponse> => {
    return api.get(`${ENDPOINTS.PRODUCTS.LIST}?${queryParams}`)
  },

  getProduct: async (id: string): Promise<Product> => {
    return api.get(ENDPOINTS.PRODUCTS.DETAIL(id))
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    return api.post(ENDPOINTS.PRODUCTS.CREATE, data)
  },

  updateProduct: async (id: string, data: UpdateProductData): Promise<Product> => {
    return api.put(ENDPOINTS.PRODUCTS.UPDATE(id), data)
  },

  deleteProduct: async (id: string): Promise<void> => {
    return api.delete(ENDPOINTS.PRODUCTS.DELETE(id))
  },
}

// services/transactionService.ts
export const transactionService = {
  getTransactions: async (params?: TransactionFilters): Promise<TransactionListResponse> => {
    return api.get(`${ENDPOINTS.TRANSACTIONS.LIST}?${queryParams}`)
  },

  createTransaction: async (data: CreateTransactionData): Promise<Transaction> => {
    return api.post(ENDPOINTS.TRANSACTIONS.CREATE, data)
  },
}
```

### Endpoint Constants

Centralized endpoint definitions:

```typescript
// services/endpoints.ts
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    DETAIL: (id: string) => `/transactions/${id}`,
    CREATE: '/transactions',
    UPDATE_STOCK: (id: string) => `/products/${id}/stock`,
  },
} as const
```

## State Management

### TanStack Query (React Query)

Used for **server state** management.

#### Query Keys Pattern

```typescript
const PRODUCT_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
  list: (filters: ProductFilters) => [...PRODUCT_KEYS.lists(), filters] as const,
  details: () => [...PRODUCT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
}
```

#### Query Hook Example

```typescript
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  })
}
```

#### Mutation Hook Example

```typescript
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductData) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      productService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(PRODUCT_KEYS.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() })
    },
  })
}
```

### Zustand Store

Used for **global client state**.

#### Auth Store

```typescript
// store/authStore.ts
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        set({ user: null, isAuthenticated: false })
      },
    }),
    { name: 'auth-storage' }
  )
)
```

## Routing

### Route Structure

```typescript
// routes/index.tsx
<Routes>
  {/* Public Routes */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Protected Routes with SidebarLayout */}
  <Route
    element={
      <ProtectedRoute>
        <SidebarLayout />
      </ProtectedRoute>
    }
  >
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/products" element={<ProductListPage />} />
    <Route path="/products/new" element={<ProductFormPage />} />
    <Route path="/products/:id/edit" element={<ProductFormPage />} />
    <Route path="/transactions" element={<TransactionPage />} />
    <Route path="/transactions/new" element={<TransactionFormPage />} />
  </Route>
</Routes>
```

### Protected Route Implementation

```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
```

## Authentication Flow

### Login Flow

```
1. User enters credentials
   ↓
2. POST /api/auth/login
   ↓
3. Backend returns { user, token, refresh_token }
   ↓
4. Store tokens in localStorage
   ↓
5. Update Zustand store (setUser)
   ↓
6. Redirect to /dashboard
```

### Token Refresh Flow

```
1. API request with expired token
   ↓
2. 401 Unauthorized
   ↓
3. Interceptor catches error
   ↓
4. POST /api/auth/refresh with refresh_token
   ↓
5. Backend returns new access_token
   ↓
6. Update localStorage token
   ↓
7. Retry original request
   ↓
8. If refresh fails → Logout → Redirect to login
```

## Mock System

### MSW (Mock Service Worker) Architecture

```
┌─────────────────────────────────────────┐
│           Browser/App                   │
├─────────────────────────────────────────┤
│           MSW Worker                    │
│  ┌─────────────────────────────────┐   │
│  │  Intercept HTTP Requests        │   │
│  │  - Match URL pattern            │   │
│  │  - Execute handler              │   │
│  │  - Return mock response         │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│     Real API / Mock Response            │
└─────────────────────────────────────────┘
```

### Enabling Mock Mode

**Environment Variable:**
```env
VITE_ENABLE_MOCK=true
```

**Initialization** (main.tsx):
```typescript
if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
```

### Mock Data Persistence

| Data | Storage Key | Operations |
|------|-------------|------------|
| Products | `mock_products` | Create, Read, Update, Delete |
| Transactions | `mock_transactions` | Create, Read |
| Auth Tokens | `token`, `refresh_token` | Create, Refresh, Delete |

## Error Handling Strategy

### Error Hierarchy

```
Error
├── Network Error (no connection)
├── HTTP Error (response received)
│   ├── 401 Unauthorized
│   ├── 403 Forbidden
│   ├── 404 Not Found
│   ├── 422 Validation Error
│   └── 500+ Server Error
└── Unknown Error
```

### Error Handling Layers

#### 1. Axios Interceptor (Global)

```typescript
// services/api.ts
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const standardError = {
      message: error.response?.data?.message || 'Something went wrong',
      code: determineErrorCode(error),
      status: error.response?.status,
    }
    return Promise.reject(standardError)
  }
)
```

#### 2. Component Level

```tsx
// Component.tsx
try {
  await createProduct.mutateAsync(data)
  toast.success('Product created!')
} catch (err: unknown) {
  const error = err as { message?: string }
  toast.error(error.message || 'Failed to create product')
}
```

### Error Display Patterns

| Error Type | Display |
|------------|---------|
| Form Validation | Inline under input fields |
| API Error | Toast notification |
| Auth Error | Redirect to login + message |
| Network Error | Toast + retry button |

## Form Validation

### Zod Schema Pattern

```typescript
const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Price must be a positive number',
  }),
  category: z.string().min(1, 'Category is required'),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), {
    message: 'Stock must be a positive integer',
  }),
})

type ProductForm = z.infer<typeof productSchema>
```

### React Hook Form Integration

```typescript
const { register, handleSubmit, formState: { errors } } = useForm<ProductForm>({
  resolver: zodResolver(productSchema),
})

<form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register('name')} />
  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
</form>
```

## Best Practices Summary

1. **Always use TypeScript** - No `any` types
2. **Follow service layer pattern** - No direct API calls in components
3. **Use TanStack Query** - For all server state
4. **Use Zustand** - Only for global client state
5. **Handle errors** - Always catch and display
6. **Show loading states** - Never leave user waiting
7. **Validate forms** - Always use Zod
8. **Use path aliases** - `@/` for clean imports
9. **Keep components small** - < 200 lines
10. **Test with mocks** - Before integrating real API
11. **Use Table components** - For list views
12. **Use Chart components** - For data visualization
