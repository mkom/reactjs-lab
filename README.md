# ReactJS Lab - Full Stack Boilerplate

A modern, scalable React boilerplate with TypeScript, Tailwind CSS, and a complete API layer architecture. Features a clean white UI design with Google Font Outfit.

## Features

- **Build Tool**: Vite + TypeScript
- **Styling**: Tailwind CSS v3 + custom UI components
- **Typography**: Google Font Outfit
- **State Management**: Zustand (Auth) + TanStack Query (Server state)
- **Charts**: Recharts for data visualization
- **API Layer**: Axios with interceptors (token, error handling, refresh token)
- **Routing**: React Router v6 with protected routes
- **Forms**: React Hook Form + Zod validation
- **Mock Data**: MSW (Mock Service Worker) for testing without backend
- **Notifications**: Sonner toast notifications
- **Icons**: Lucide React

## Demo: Inventory Management System

This boilerplate includes a complete **Inventory Management System** with:

### Dashboard
- Real-time stats with trend indicators (Total Products, Stock Value, Low Stock, Out of Stock)
- Stock trend area chart (7-day overview)
- Transaction activity bar chart (Stock In vs Stock Out)
- Recent transactions table
- Low stock alerts

### Products Management
- Full CRUD operations
- Pagination & search
- Category filtering
- Table view with status badges

### Stock Transactions
- Stock In (Add inventory)
- Stock Out (Remove inventory)
- Transaction history with filters
- Table view with type indicators
- Auto-update product stock
- Stock validation (prevent negative stock)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Mock Data (set to 'true' to enable mock API)
VITE_ENABLE_MOCK=true
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable components
│   ├── ui/              # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── table.tsx    # Table components
│   ├── charts/          # Chart components
│   │   ├── StockTrendChart.tsx
│   │   ├── TransactionChart.tsx
│   │   └── index.ts
│   ├── Badge.tsx        # Status badge component
│   ├── EmptyState.tsx   # Empty state component
│   ├── PageHeader.tsx   # Page header component
│   ├── SidebarLayout.tsx # Sidebar navigation layout
│   └── StatsCard.tsx    # Dashboard stats card with trends
├── hooks/               # Custom hooks
│   ├── useAuth.ts       # Auth hooks (TanStack Query)
│   ├── useProduct.ts    # Product hooks (TanStack Query)
│   └── useTransaction.ts # Transaction hooks (TanStack Query)
├── lib/
│   ├── queryClient.ts   # TanStack Query client config
│   └── utils.ts         # Utility functions (cn, etc)
├── mocks/               # Mock API (MSW)
│   ├── data.ts          # Mock data & persistence
│   ├── handlers.ts      # MSW handlers
│   └── browser.ts       # MSW browser setup
├── pages/               # Page components
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── ProductFormPage.tsx
│   ├── ProductListPage.tsx
│   ├── RegisterPage.tsx
│   ├── TransactionPage.tsx      # Transaction list
│   └── TransactionFormPage.tsx  # Create transaction
├── routes/
│   └── index.tsx        # Route definitions
├── services/            # API services
│   ├── api.ts           # Axios instance + interceptors
│   ├── endpoints.ts     # API endpoints constants
│   ├── authService.ts   # Auth business logic
│   ├── productService.ts # Product business logic
│   └── transactionService.ts # Transaction business logic
├── store/
│   └── authStore.ts     # Zustand auth store
├── types/
│   └── index.ts         # TypeScript types
├── App.tsx
└── main.tsx
```

## Mock Data Testing

### Enable Mock Mode

Set `VITE_ENABLE_MOCK=true` in your `.env` file:

```env
VITE_ENABLE_MOCK=true
```

### Test Credentials

| Field | Value |
|-------|-------|
| Email | `user@example.com` |
| Password | `password` |

### Mock Features

- ✅ Login/Register/Logout
- ✅ 20 Pre-filled products
- ✅ 15 Pre-filled transactions
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Stock transactions (In/Out)
- ✅ Auto-update product stock on transaction
- ✅ Stock validation (prevent negative stock)
- ✅ Pagination (10 items per page)
- ✅ Search & filter
- ✅ Random delay simulation (500-1000ms)
- ✅ Data persistence to localStorage

### User Journey Examples

#### 1. Dashboard Overview
1. Login → Dashboard
2. View real-time stats with trend indicators:
   - Total Products count (+/- % from last month)
   - Total Stock Value (+/- % from last month)
   - Low Stock Items (stock < 10)
   - Out of Stock items
3. View Stock Trend chart (7-day area chart)
4. View Transaction Activity chart (bar chart)
5. Check Recent Transactions table
6. Review Low Stock Alerts

#### 2. Manage Products
1. Go to Products page
2. View products in table format with status badges
3. Create new product
4. Edit existing product
5. Delete product
6. Search & filter products

#### 3. Stock Transactions
1. Go to Transactions page
2. View transactions in table format
3. Click "New Transaction"
4. Select type: Stock In or Stock Out
5. Choose product
6. Enter quantity
7. Submit → Product stock auto-updates
8. View in Dashboard stats

### Reset Mock Data

To reset all mock data to initial state:

```javascript
import { resetMockData } from '@/mocks/handlers'
resetMockData()
```

Or manually clear these localStorage keys:
- `mock_products`
- `mock_transactions`
- `token`
- `refresh_token`

## Authentication Flow

1. User logs in with credentials
2. Backend returns JWT token + user data
3. Token stored in `localStorage`
4. Axios interceptor attaches token to all requests
5. On 401 error, interceptor attempts refresh token
6. If refresh fails, user is redirected to login

## Protected Routes

Routes under the SidebarLayout component require authentication:
- `/dashboard` - Dashboard page
- `/products` - Product list
- `/products/new` - Create product
- `/products/:id/edit` - Edit product
- `/transactions` - Transaction list
- `/transactions/new` - Create transaction

Public routes:
- `/login` - Login page
- `/register` - Register page

## API Architecture

### Service Layer Pattern

```typescript
// services/productService.ts
export const productService = {
  getProducts: async (params?: ProductFilters): Promise<ProductListResponse> => {
    return api.get(`${ENDPOINTS.PRODUCTS.LIST}?${queryParams}`)
  },
  getProduct: async (id: string): Promise<Product> => {
    return api.get(ENDPOINTS.PRODUCTS.DETAIL(id))
  },
  // ...
}

// services/transactionService.ts
export const transactionService = {
  getTransactions: async (params?: TransactionFilters): Promise<TransactionListResponse> => {
    return api.get(`${ENDPOINTS.TRANSACTIONS.LIST}?${queryParams}`)
  },
  createTransaction: async (data: CreateTransactionData): Promise<Transaction> => {
    return api.post(ENDPOINTS.TRANSACTIONS.CREATE, data)
  },
  // ...
}
```

### Custom Hooks Pattern

```typescript
// hooks/useProduct.ts
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(filters),
    queryFn: () => productService.getProducts(filters),
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() })
    },
  })
}

// hooks/useTransaction.ts
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionData) => transactionService.createTransaction(data),
    onSuccess: () => {
      // Invalidate both transactions and products queries
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
```

### Transaction Auto-Update Pattern

When a transaction is created:
1. MSW handler validates stock availability (for STOCK_OUT)
2. Creates transaction record
3. Updates product stock (add for IN, subtract for OUT)
4. Saves both to localStorage
5. Returns success response
6. TanStack Query invalidates related queries
7. Dashboard & Product pages auto-refresh

## UI Components

### Layout Components

#### SidebarLayout
Collapsible sidebar navigation with:
- Logo and branding
- Navigation menu (Dashboard, Products, Transactions)
- Active state highlighting
- Collapse/expand toggle
- User menu in header
- Mobile responsive drawer

```tsx
import { SidebarLayout } from '@/components/SidebarLayout'

// All protected routes use SidebarLayout
<SidebarLayout>
  <Outlet />
</SidebarLayout>
```

### Reusable Components

#### PageHeader
```tsx
import { PageHeader } from '@/components/PageHeader'

<PageHeader
  title="Products"
  description="Manage your inventory"
>
  <Button>New Product</Button>
</PageHeader>
```

#### StatsCard with Trend
```tsx
import { StatsCard } from '@/components/StatsCard'

<StatsCard
  title="Total Products"
  value={100}
  trend={12.5}
  trendLabel="from last month"
  icon={<Package className="h-5 w-5" />}
  description="Active products"
  variant="default" // 'default' | 'warning' | 'danger' | 'success'
/>
```

#### Badge
```tsx
import { Badge } from '@/components/Badge'

<Badge variant="success">In Stock</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="danger">Out of Stock</Badge>
```

#### EmptyState
```tsx
import { EmptyState } from '@/components/EmptyState'

<EmptyState
  title="No products found"
  description="Start by creating your first product"
  icon={<Package className="h-8 w-8" />}
  action={<Button>Create Product</Button>}
/>
```

### Table Components

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Category</TableHead>
      <TableHead className="text-right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {products.map((product) => (
      <TableRow key={product.id}>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.category}</TableCell>
        <TableCell className="text-right">${product.price}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Chart Components

#### StockTrendChart (Area Chart)
```tsx
import { StockTrendChart } from '@/components/charts'

<StockTrendChart
  data={stockTrendData}
  title="Stock Level Trend"
  description="Total inventory over 7 days"
/>
```

#### TransactionChart (Bar Chart)
```tsx
import { TransactionChart } from '@/components/charts'

<TransactionChart
  data={transactionData}
  title="Transaction Activity"
  description="Daily stock in vs stock out"
/>
```

### Base UI Components (shadcn-style)

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Click me</Button>
<Button variant="outline" size="sm">Small</Button>
<Button variant="ghost" disabled>Disabled</Button>
```

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Form with Validation

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})
```

## Styling

### Typography - Google Font Outfit

The project uses **Google Font Outfit** for clean, modern typography.

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

Usage: `className="font-outfit"`

### Tailwind Classes

Common patterns used:

```tsx
// Layout
className="min-h-screen bg-white"
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

// Spacing
className="space-y-4"
className="flex gap-4"
className="p-4"

// Typography
className="text-2xl font-semibold text-slate-900 font-outfit"
className="text-sm text-slate-500"

// Components
className="rounded-2xl border border-slate-200 shadow-sm"
className="hover:shadow-md transition-shadow duration-200"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
```

### Color System

Clean white theme with slate accents:

| Color | Usage |
|-------|-------|
| White/gray-50 | Background |
| Slate-900 | Primary text |
| Slate-500 | Secondary text |
| Slate-200 | Borders |
| Emerald | Success states |
| Amber | Warning states |
| Red | Danger states |

### Customizing Theme

Edit `tailwind.config.js`:

```javascript
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

## Adding New Features

### 1. Add New Service

```typescript
// services/userService.ts
import api from './api'
import { ENDPOINTS } from './endpoints'

export const userService = {
  getUsers: () => api.get(ENDPOINTS.USERS.LIST),
  getUser: (id: string) => api.get(ENDPOINTS.USERS.DETAIL(id)),
}
```

### 2. Add New Hook

```typescript
// hooks/useUser.ts
import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/userService'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  })
}
```

### 3. Add New Page

```typescript
// pages/UsersPage.tsx
import { useUsers } from '@/hooks/useUser'

export const UsersPage = () => {
  const { data, isLoading } = useUsers()
  // ...
}
```

### 4. Add Route

```typescript
// routes/index.tsx
<Route path="/users" element={<UsersPage />} />
```

### 5. Add MSW Handler (Optional)

```typescript
// mocks/handlers.ts
http.get('/api/users', async () => {
  await randomDelay()
  return HttpResponse.json(mockUsers)
})
```

## Error Handling

Global error handling via Axios interceptor:

- **401**: Redirect to login
- **403**: Show permission error
- **404**: Show not found error
- **422**: Show validation errors
- **500+**: Show server error

Component-level error handling:

```tsx
try {
  await mutation.mutateAsync(data)
} catch (err: any) {
  toast.error(err.message || 'An error occurred')
}
```

## Best Practices

1. **Use TypeScript**: Always define interfaces/types
2. **Use Custom Hooks**: Abstract data fetching logic
3. **Use Zustand**: Only for global client state (auth, UI)
4. **Use TanStack Query**: For all server state
5. **Use Service Layer**: Don't call API directly from components
6. **Handle Errors**: Always catch and display errors
7. **Loading States**: Always show loading indicators
8. **Form Validation**: Always validate with Zod
9. **Flat Structure**: Keep folder structure flat (1 level max)
10. **Reusable Components**: Make components generic, not feature-specific

## Troubleshooting

### Build Errors

If you get TypeScript errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### MSW Not Working

1. Check `VITE_ENABLE_MOCK=true` in `.env`
2. Clear browser cache
3. Check console for MSW initialization message

### Token Issues

Clear localStorage:
```javascript
localStorage.clear()
```

### Data Not Persisting

Check localStorage keys:
```javascript
// In browser console
Object.keys(localStorage)
// Should see: 'mock_products', 'mock_transactions', 'token', etc.
```

## Security Features

This boilerplate includes comprehensive security measures:

### Content Security Policy (CSP)
Protects against XSS and data injection attacks by controlling resource loading.

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
frame-ancestors 'none';
```

### XSS Prevention
Built-in sanitization utilities using DOMPurify:

```typescript
import { sanitizeHTML, sanitizeInput } from '@/utils/security'

// Sanitize user-generated HTML
const safeHTML = sanitizeHTML(userContent)

// Sanitize text input
const safeText = sanitizeInput(userInput)
```

### Security Headers
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Legacy XSS protection
- `Referrer-Policy` - Controls referrer information

### Authentication Security
- Token format validation before API calls
- Token expiration checking
- Automatic redirect on invalid tokens
- Secure auth service pattern (ready for httpOnly cookies)

### Production Security Checklist
When deploying to production:

- [ ] Use HTTPS (required for secure cookies)
- [ ] Migrate to httpOnly cookies (see AGENTS.md)
- [ ] Enable CORS with specific origins only
- [ ] Set up rate limiting on backend
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Test CSP in browser DevTools

For detailed security documentation, see [AGENTS.md](./AGENTS.md).

## License

MIT

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## Support

For issues and feature requests, please open an issue on GitHub.
