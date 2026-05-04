/**
 * Application Routes
 * 
 * Route configuration with security-enhanced ProtectedRoute.
 * 
 * Security Features:
 * - ProtectedRoute validates both auth state and token validity
 * - Automatic redirect to login for unauthenticated users
 * - Token expiration checking
 * 
 * @module routes/index
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import { SidebarLayout } from '@/components/SidebarLayout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProductListPage } from '@/pages/ProductListPage'
import { ProductFormPage } from '@/pages/ProductFormPage'
import { TransactionPage } from '@/pages/TransactionPage'
import { TransactionFormPage } from '@/pages/TransactionFormPage'

/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication. Performs security checks:
 * 1. Validates authentication state from auth store
 * 2. Validates token format and expiration
 * 3. Clears invalid tokens and redirects to login
 * 
 * SECURITY NOTE:
 * This component provides client-side protection only. Always implement
 * server-side authentication checks for all protected API endpoints.
 * 
 * PRODUCTION NOTE:
 * When using httpOnly cookies, the token validation can be simplified
 * as the browser handles cookie management automatically.
 * 
 * @param children - Child components to render if authenticated
 * @returns Navigate component (redirect) or children
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  // Security: Validate token in addition to auth state
  // This catches cases where isAuthenticated is true but token is invalid/expired
  const isTokenValid = authService.isTokenValid()
  
  // If not authenticated OR token is invalid, redirect to login
  if (!isAuthenticated || !isTokenValid) {
    // Security: Clear any invalid state before redirecting
    if (!isTokenValid && isAuthenticated) {
      authService.clearTokens()
      useAuthStore.getState().logout()
    }
    
    // Use replace to prevent back button from returning to protected page
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

/**
 * Public Route Component
 * 
 * Wraps routes that should only be accessible to non-authenticated users.
 * Redirects authenticated users to dashboard.
 * 
 * @param children - Child components to render
 * @returns Navigate component (redirect) or children
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isTokenValid = authService.isTokenValid()
  
  // If already authenticated with valid token, redirect to dashboard
  if (isAuthenticated && isTokenValid) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

/**
 * Application Routes Configuration
 * 
 * Route structure:
 * - /login, /register: Public routes (redirect if authenticated)
 * - /*: Protected routes (require authentication)
 *   - /dashboard: Main dashboard
 *   - /profile: User profile
 *   - /settings: Application settings
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible only when NOT authenticated */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      
      {/* Protected Routes - Require authentication */}
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
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}