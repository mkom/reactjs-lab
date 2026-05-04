# ReactJS Starter Template

This is a **React TypeScript Starter Template** designed for building scalable web applications with a clean architecture. It features a modern clean white UI design with Google Font Outfit.

## Quick Start

1. Clone this repository
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Run `npm run dev`

**Test Credentials:**
- Email: `user@example.com`
- Password: `password`

## Project Structure

This starter includes:

| Feature | Location |
|---------|----------|
| Auth System | `src/services/authService.ts`, `src/hooks/useAuth.ts` |
| User Profile | `src/pages/ProfilePage.tsx` |
| Settings | `src/pages/SettingsPage.tsx` (theme toggle, language, notifications) |
| Base UI Components | `src/components/ui/` |
| Layout | `src/components/SidebarLayout.tsx` |
| Chart Components | `src/components/charts/` (Recharts) |

## Adding New Features

Use the built-in generator:

```bash
npm run generate:feature <feature-name>
```

Example:
```bash
npm run generate:feature order
```

This will create:
- `src/services/orderService.ts`
- `src/hooks/useOrder.ts`
- `src/pages/OrderListPage.tsx`
- `src/pages/OrderFormPage.tsx`

Then:
1. Add routes in `src/routes/index.tsx`
2. Add sidebar menu in `src/components/SidebarLayout.tsx`
3. Implement API calls in the service, update endpoints in `src/services/endpoints.ts`

## Customization

### Branding
Update logo and brand name in `src/components/SidebarLayout.tsx`:
- Logo icon: Change the Sparkles icon
- Brand name: Change "Starter" text

### Theme
- Dark mode toggle available in Settings page
- Colors: Update `tailwind.config.js`
- Font: Currently using Outfit (Google Fonts)

### Mock API
- Enable/disable in `.env`: `VITE_ENABLE_MOCK=true/false`
- Mock handlers: `src/mocks/handlers.ts`
- Add new mock endpoints as needed

## Tech Stack

| Category | Technology |
|----------|------------|
| Build Tool | Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| Typography | Google Font Outfit |
| State (Server) | TanStack Query |
| State (Client) | Zustand |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Mock API | MSW |
| Notifications | Sonner |

---

# Agents Guide - ReactJS Lab

This document provides context and guidelines for AI agents working on this project.

## Project Context

### Overview
This is a **React TypeScript boilerplate** designed for building scalable web applications with a clean architecture. It features a modern clean white UI design with Google Font Outfit.

### Demo Application
This boilerplate includes a complete **Inventory Management System** demonstrating:
- Dashboard with real-time stats and trend indicators
- Stock trend and transaction charts (Recharts)
- Product management (CRUD) with table view
- Stock transactions (In/Out) with table view
- Auto-update patterns
- Mock data with persistence

### Tech Stack

| Category | Technology |
|----------|------------|
| Build Tool | Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| Typography | Google Font Outfit |
| State (Server) | TanStack Query |
| State (Client) | Zustand |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Mock API | MSW |
| Notifications | Sonner |

### Key Decisions

1. **Why Zustand over Redux?**
   - Simpler API
   - Less boilerplate
   - Better TypeScript support
   - Persist middleware built-in

2. **Why TanStack Query?**
   - Automatic caching
   - Background refetching
   - Optimistic updates
   - DevTools support

3. **Why MSW for mocks?**
   - Intercepts real HTTP requests
   - No code changes needed between mock/real API
   - Can test error scenarios
   - Network delay simulation

4. **Why Recharts for charts?**
   - Composable components
   - SVG-based with responsive container
   - Good TypeScript support
   - Lightweight

5. **Why Flat Structure?**
   - Easier navigation
   - No deep nesting
   - Scalable without complexity

## Architecture Patterns

### Service Layer Pattern
All API calls go through services:
```
Component → Hook → Service → API
```

**Never** call API directly from components.

### Feature-Based Organization
Group by feature, not by type:
```
services/authService.ts         ✅
services/productService.ts      ✅
services/transactionService.ts  ✅

api/auth.ts                     ❌
components/AuthButton.tsx        ❌
```

### State Management Strategy

| Type | Tool | Example |
|------|------|---------|
| Server State | TanStack Query | Products, Transactions |
| Global Client State | Zustand | Auth, Theme |
| Local State | useState | Form inputs, UI toggles |

## Coding Conventions

### Naming

```typescript
// Files
authService.ts          // camelCase for services
useAuth.ts              // camelCase for hooks
DashboardPage.tsx        // PascalCase for pages
PageHeader.tsx          // PascalCase for reusable components
StockTrendChart.tsx     // PascalCase for chart components

// Variables
const user              // camelCase
const ProductCard        // PascalCase for components
const AUTH_KEYS         // UPPER_SNAKE_CASE for constants

// Functions
const fetchUser = ()    // camelCase, verb prefix
const handleSubmit       // handler prefix for event handlers
const onClick            // on prefix for callbacks
```

### Component Structure

```tsx
// 1. Imports (external first, then internal)
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

// 2. Types/Interfaces
interface Props {
  userId: string
}

// 3. Component
export const UserCard = ({ userId }: Props) => {
  // Hooks first
  const { data } = useUser(userId)
  const [isOpen, setIsOpen] = useState(false)

  // Handlers
  const handleToggle = () => setIsOpen(!isOpen)

  // Render
  return (
    <Card>
      <CardContent>{data?.name}</CardContent>
    </Card>
  )
}
```

### Error Handling

Always use try-catch with mutations:

```tsx
try {
  await mutateAsync(data)
  toast.success('Success!')
} catch (err: unknown) {
  const error = err as { message?: string }
  toast.error(error.message || 'Something went wrong')
}
```

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

**File:** `src/components/SidebarLayout.tsx`

```tsx
// Usage in routes
<Route
  element={
    <ProtectedRoute>
      <SidebarLayout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<DashboardPage />} />
  {/* ... */}
</Route>
```

### Reusable Components

#### StatsCard with Trend
StatsCard with trend indicators for dashboard.

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

#### Table Components
Use Table components for list views (products, transactions).

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead className="text-right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell className="text-right">${item.price}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Chart Components
Use Recharts-based chart components for data visualization.

```tsx
import { StockTrendChart } from '@/components/charts'
import { TransactionChart } from '@/components/charts'

// Area chart for trends
<StockTrendChart data={data} title="Stock Trend" />

// Bar chart for comparisons
<TransactionChart data={data} title="Transactions" />
```

## Adding New Features

### Step-by-Step Guide

#### 1. Define Types

```typescript
// services/userService.ts or types/index.ts
export interface User {
  id: string
  name: string
  email: string
}

export interface CreateUserData {
  name: string
  email: string
}
```

#### 2. Create Service

```typescript
// services/userService.ts
import api from './api'
import { ENDPOINTS } from './endpoints'
import type { User, CreateUserData } from '@/types'

export const userService = {
  getUsers: async (): Promise<User[]> => {
    return api.get(ENDPOINTS.USERS.LIST) as Promise<User[]>
  },

  getUser: async (id: string): Promise<User> => {
    return api.get(ENDPOINTS.USERS.DETAIL(id)) as Promise<User>
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    return api.post(ENDPOINTS.USERS.CREATE, data) as Promise<User>
  },
}
```

#### 3. Add Endpoints

```typescript
// services/endpoints.ts
export const ENDPOINTS = {
  // ... existing endpoints
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
} as const
```

#### 4. Create Hooks

```typescript
// hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService, type CreateUserData } from '@/services/userService'

const USER_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_KEYS.all, 'list'] as const,
  list: (filters: unknown) => [...USER_KEYS.lists(), filters] as const,
  details: () => [...USER_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
}

export const useUsers = () => {
  return useQuery({
    queryKey: USER_KEYS.lists(),
    queryFn: userService.getUsers,
  })
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() })
    },
  })
}
```

#### 5. Create Page with Table

```tsx
// pages/UsersPage.tsx
import { useUsers, useCreateUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

export const UsersPage = () => {
  const { data: users, isLoading } = useUsers()
  const createUser = useCreateUser()

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div>
      <PageHeader title="Users" description="Manage users">
        <Button>New User</Button>
      </PageHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

#### 6. Add Route

```typescript
// routes/index.tsx
<Route path="/users" element={<UsersPage />} />
<Route path="/users/new" element={<UserFormPage />} />
```

#### 7. Add Mock Handler (Optional)

```typescript
// mocks/handlers.ts
http.get('/api/users', async () => {
  await randomDelay()
  return HttpResponse.json(mockUsers)
}),

http.post('/api/users', async ({ request }) => {
  await randomDelay()
  const body = await request.json() as CreateUserData
  const newUser = { id: String(Date.now()), ...body }
  mockUsers.push(newUser)
  return HttpResponse.json(newUser, { status: 201 })
}),
```

### Complex Example: Transaction System

This pattern is used for the inventory transaction system:

```typescript
// services/transactionService.ts
export const transactionService = {
  createTransaction: async (data: CreateTransactionData): Promise<Transaction> => {
    return api.post(ENDPOINTS.TRANSACTIONS.CREATE, data) as Promise<Transaction>
  },
}

// hooks/useTransaction.ts
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      // Invalidate both transactions and products
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// mocks/handlers.ts
http.post('/api/transactions', async ({ request }) => {
  await randomDelay()
  const body = await request.json()

  // 1. Validate stock
  const product = products.find(p => p.id === body.productId)
  if (body.type === 'STOCK_OUT' && body.quantity > product.stock) {
    return HttpResponse.json({ message: 'Insufficient stock' }, { status: 422 })
  }

  // 2. Create transaction
  const transaction = { id: String(Date.now()), ...body }

  // 3. Update product stock
  if (body.type === 'STOCK_IN') {
    product.stock += body.quantity
  } else {
    product.stock -= body.quantity
  }

  // 4. Save both
  transactions.push(transaction)
  setProducts(products)
  setTransactions(transactions)

  return HttpResponse.json(transaction, { status: 201 })
})
```

## Common Tasks

### Adding a New Page

1. Create page component in `src/pages/`
2. Add route in `src/routes/index.tsx`
3. If protected, put inside SidebarLayout

### Adding Form Validation

```typescript
const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+'),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})
```

### Adding Loading State

```tsx
const { data, isLoading } = useQuery({...})

if (isLoading) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
    </div>
  )
}
```

### Adding Error State

```tsx
const { data, error } = useQuery({...})

if (error) {
  return (
    <Card className="flex flex-col items-center justify-center py-12">
      <p className="text-red-500 text-center mb-4">Failed to load data</p>
      <Button variant="outline" onClick={() => navigate('/products')}>
        Back to Products
      </Button>
    </Card>
  )
}
```

### Creating Reusable Components

**Rules for reusable components:**
1. Keep them generic (not feature-specific)
2. Accept props for customization
3. Use composition pattern

```tsx
// components/StatsCard.tsx - Reusable
type StatsCardProps = {
  title: string
  value: string | number
  icon?: React.ReactNode
  variant?: 'default' | 'warning' | 'danger' | 'success'
  trend?: number
  trendLabel?: string
}

export const StatsCard = ({ title, value, icon, variant = 'default', trend, trendLabel }: StatsCardProps) => {
  // Implementation with trend indicator
}

// Usage in DashboardPage.tsx
<StatsCard
  title="Total Products"
  value={totalProducts}
  icon={<Package className="h-5 w-5" />}
  trend={12.5}
  trendLabel="from last month"
/>
```

## Testing with Mock Data

### Enable Mock Mode

Set in `.env`:
```
VITE_ENABLE_MOCK=true
```

### Test Credentials
- Email: `user@example.com`
- Password: `password`

### Inventory Management Testing

**Test Stock Transaction Flow:**
1. Login → Dashboard
2. View stats with trend indicators
3. View stock trend chart
4. View transaction activity chart
5. Go to Products → View table
6. Go to Transactions → View table with filters
7. Go to Transactions → New Transaction
8. Select "Stock Out"
9. Choose product
10. Try to exceed available stock → Should show error
11. Enter valid quantity
12. Submit
13. Check Dashboard → Stats should update
14. Check Products → Stock should decrease

### Simulate Errors

Modify handler to return error:
```typescript
http.get('/api/products', async () => {
  await randomDelay()
  return HttpResponse.json(
    { message: 'Server error' },
    { status: 500 }
  )
}),
```

### Simulate Slow Network

Increase delay:
```typescript
export const randomDelay = () => delay(Math.random() * 2000 + 1000) // 1-3s
```

## File Organization Rules

### DO ✅
- Group by feature
- Keep components flat (max 1 level)
- Use index.ts for barrel exports (e.g., charts/index.ts)
- Keep components small (< 200 lines)
- Extract reusable logic to hooks
- Create reusable components in `components/` (not per-feature)
- Use Table components for list views

### DON'T ❌
- Don't create nested folders like `components/inventory/ProductTable.tsx`
- Don't put business logic in components
- Don't use `any` type
- Don't import from '../..' - use @/ alias

## Flat Structure Example

```
src/
├── components/          # Reusable only
│   ├── ui/              # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── table.tsx
│   ├── charts/          # Chart components
│   │   ├── StockTrendChart.tsx
│   │   ├── TransactionChart.tsx
│   │   └── index.ts
│   ├── PageHeader.tsx
│   ├── StatsCard.tsx
│   ├── SidebarLayout.tsx
│   └── Badge.tsx
├── pages/               # Full features
│   ├── DashboardPage.tsx
│   ├── ProductListPage.tsx
│   └── TransactionPage.tsx
├── hooks/               # 1 file per domain
│   ├── useProduct.ts
│   └── useTransaction.ts
├── services/            # 1 file per domain
│   ├── productService.ts
│   └── transactionService.ts
```

## Performance Guidelines

1. **Use React.memo** for expensive components
2. **Use useMemo** for expensive calculations
3. **Use useCallback** for callbacks passed to children
4. **Lazy load** routes with React.lazy()
5. **Code split** large libraries
6. **Use TanStack Query** for caching server data

## Security Implementation

This template implements comprehensive client-side security measures. All security features are production-ready patterns with clear migration paths.

### Security Features Implemented

| Feature | Location | Status |
|---------|----------|--------|
| Content Security Policy (CSP) | `index.html`, `vite.config.ts` | ✅ Active |
| Security Headers | `vite.config.ts` | ✅ Active |
| XSS Prevention (DOMPurify) | `src/utils/security.ts` | ✅ Active |
| Input Sanitization | `src/utils/security.ts` | ✅ Active |
| Token Validation | `src/services/authService.ts` | ✅ Active |
| Secure Auth Pattern | `src/services/api.ts` | ✅ Active |
| Protected Routes | `src/routes/index.tsx` | ✅ Enhanced |

### Content Security Policy (CSP)

CSP is configured via meta tag and Vite server headers:

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

**Key protections:**
- Blocks inline scripts (except necessary React scripts)
- Restricts resource loading to approved domains
- Prevents clickjacking (frame-ancestors)
- Forces form submissions to same origin

### XSS Prevention

All user input should be sanitized using utilities in `src/utils/security.ts`:

```typescript
import { sanitizeHTML, sanitizeInput, sanitizeUrl } from '@/utils/security'

// For rich text content
const safeHTML = sanitizeHTML(userContent)
<div dangerouslySetInnerHTML={{ __html: safeHTML }} />

// For plain text inputs
const safeText = sanitizeInput(userInput)
<input value={safeText} />

// For URLs
const safeUrl = sanitizeUrl(userUrl)
<a href={safeUrl}>Link</a>
```

**Never use `dangerouslySetInnerHTML` without sanitization!**

### Authentication Security

#### Current Implementation (Demo Mode)
- Tokens stored in localStorage (for demo purposes only)
- Token format validation before API calls
- Token expiration checking
- Automatic redirect on invalid tokens

#### Production Migration (httpOnly Cookies)
To migrate to production-ready authentication:

1. **Backend Changes:**
   - Set cookies with: `HttpOnly; Secure; SameSite=Strict`
   - Remove token from response body
   - Implement proper CSRF protection if needed

2. **Frontend Changes:**
   ```typescript
   // In api.ts, uncomment:
   withCredentials: true,
   
   // Remove from authService.ts:
   - All localStorage operations
   - getAccessToken(), getRefreshToken()
   - setTokens(), clearTokens()
   
   // ProtectedRoute stays the same (checks auth state)
   ```

3. **Why httpOnly Cookies?**
   - Cannot be accessed by JavaScript (XSS protection)
   - Automatically sent with requests
   - Server-controlled expiration
   - Secure flag ensures HTTPS only

### Security Headers

Vite development server configured with:

```typescript
'X-Frame-Options': 'DENY',           // Prevent clickjacking
'X-Content-Type-Options': 'nosniff', // Prevent MIME sniffing
'X-XSS-Protection': '1; mode=block', // Legacy XSS protection
'Referrer-Policy': 'strict-origin-when-cross-origin',
'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
```

### Input Validation

All forms use Zod for validation:

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
})
```

**Validation layers:**
1. **Client-side (Zod):** Immediate UX feedback
2. **Server-side (Backend):** Security validation (always required)

### Security Checklist for New Features

When adding new features, ensure:

- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] All user inputs validated with Zod
- [ ] Sensitive data not stored in localStorage
- [ ] API endpoints require authentication (if protected)
- [ ] File uploads validate file types and sizes
- [ ] URLs validated before use (prevent `javascript:` protocol)

### Security Dependencies

```bash
# XSS Prevention
npm install dompurify

# Already included:
# - Zod (validation)
# - React Hook Form (form management)
```

### Testing Security

```bash
# Run security audit
npm audit

# Test CSP in browser DevTools
# 1. Open Application tab → Frames → CSP
# 2. Check Console for CSP violations

# Verify headers
curl -I http://localhost:5173
```

### Common Security Anti-Patterns

**❌ DON'T:**
```typescript
// Never store sensitive data in localStorage
localStorage.setItem('password', password)

// Never use innerHTML with user input
element.innerHTML = userInput

// Never trust client-side validation alone
// Backend must always validate

// Never disable CSP in production
```

**✅ DO:**
```typescript
// Use httpOnly cookies for tokens (production)
// Sanitize all user-generated content
const safe = sanitizeHTML(userContent)

// Validate on both client and server
const result = schema.safeParse(data)
if (!result.success) return error

// Use strict CSP policy
```

## Questions?

If you're unsure about:
- Where to put a file → Look at existing similar features
- Which state management to use → See State Management Strategy table
- How to structure a component → Follow Component Structure section
- Error handling → Always wrap mutations in try-catch with toast
- Should I make this component reusable? → If used in 2+ pages, yes
