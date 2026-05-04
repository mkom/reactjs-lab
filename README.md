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
| `npm run generate:feature` | Generate new feature boilerplate |

## Adding New Features

### Using the Feature Generator

Use the built-in generator to create boilerplate code for new features:

```bash
npm run generate:feature <feature-name>
```

Example:
```bash
npm run generate:feature order
```

This will create 4 files:
- `src/services/orderService.ts` - Service layer (API calls)
- `src/hooks/useOrder.ts` - React hooks with TanStack Query
- `src/pages/OrderListPage.tsx` - List page with table
- `src/pages/OrderFormPage.tsx` - Create/edit form

After generating, you need to:
1. Add routes in `src/routes/index.tsx`
2. Add sidebar menu in `src/components/SidebarLayout.tsx`
3. Implement API calls in the service
4. Update endpoints in `src/services/endpoints.ts`

### Manual Setup

Alternatively, add features manually:

#### 1. Add New Service

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
