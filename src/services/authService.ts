/**
 * Authentication Service
 * 
 * ⚠️ SECURITY NOTICE:
 * This implementation uses localStorage for demo purposes.
 * In production, you MUST use httpOnly cookies instead.
 * 
 * Why httpOnly cookies are more secure:
 * - Cannot be accessed by JavaScript (XSS protection)
 * - Automatically sent with requests (CSRF protection with SameSite)
 * - Server-controlled expiration
 * - Secure flag ensures HTTPS only
 * 
 * Migration to production:
 * 1. Remove all localStorage token operations
 * 2. Set withCredentials: true in api.ts
 * 3. Backend must set cookies with: HttpOnly; Secure; SameSite=Strict
 * 4. Backend handles all token storage/retrieval
 * 
 * @module services/authService
 */

import api from './api'
import { ENDPOINTS } from './endpoints'
import { isValidTokenFormat, isTokenExpired } from '@/utils/security'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
  refresh_token?: string
}

// Storage keys - consider these as temporary/demo only
const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/**
 * Authentication Service
 * 
 * Provides methods for login, register, logout, and token management.
 * 
 * IMPORTANT: This is a DEMO implementation using localStorage.
 * For production, replace localStorage operations with httpOnly cookies.
 */
export const authService = {
  /**
   * Authenticate user with credentials
   * 
   * DEMO: Stores tokens in localStorage
   * PRODUCTION: Backend sets httpOnly cookie, frontend just receives success response
   * 
   * @param credentials - User email and password
   * @returns AuthResponse with user data and tokens
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const data = await api.post(ENDPOINTS.AUTH.LOGIN, credentials) as AuthResponse
    
    // DEMO ONLY: Store tokens in localStorage
    // PRODUCTION: Remove this block - tokens stored in httpOnly cookie by backend
    if (data.token) {
      // Validate token format before storing
      if (!isValidTokenFormat(data.token)) {
        throw new Error('Invalid token format received from server')
      }
      
      localStorage.setItem(TOKEN_KEY, data.token)
      
      if (data.refresh_token) {
        if (!isValidTokenFormat(data.refresh_token)) {
          throw new Error('Invalid refresh token format received from server')
        }
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
      }
    }
    
    return data
  },

  /**
   * Register new user
   * 
   * DEMO: Stores tokens in localStorage (auto-login after register)
   * PRODUCTION: Backend sets httpOnly cookie
   * 
   * @param userData - User registration data
   * @returns AuthResponse with user data and tokens
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const data = await api.post(ENDPOINTS.AUTH.REGISTER, userData) as AuthResponse
    
    // DEMO ONLY: Store tokens in localStorage
    // PRODUCTION: Remove this block
    if (data.token) {
      if (!isValidTokenFormat(data.token)) {
        throw new Error('Invalid token format received from server')
      }
      
      localStorage.setItem(TOKEN_KEY, data.token)
      
      if (data.refresh_token) {
        if (!isValidTokenFormat(data.refresh_token)) {
          throw new Error('Invalid refresh token format received from server')
        }
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
      }
    }
    
    return data
  },

  /**
   * Logout user
   * 
   * DEMO: Removes tokens from localStorage
   * PRODUCTION: Backend clears httpOnly cookie
   * 
   * Note: Always call logout() on the server even if localStorage fails
   * to ensure server-side session is properly terminated.
   */
  logout: async (): Promise<void> => {
    try {
      // Always inform backend about logout
      await api.post(ENDPOINTS.AUTH.LOGOUT)
    } finally {
      // DEMO ONLY: Clear localStorage
      // PRODUCTION: Remove these lines
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  },

  /**
   * Get current user information
   * 
   * @returns Current authenticated user data
   */
  getMe: async (): Promise<AuthUser> => {
    return api.get(ENDPOINTS.AUTH.ME) as Promise<AuthUser>
  },

  // ============================================================================
  // TOKEN MANAGEMENT METHODS
  // ============================================================================
  // 
  // ⚠️ DEMO ONLY - Remove all methods below when migrating to httpOnly cookies
  // 
  // These methods exist solely for the demo implementation.
  // In production with httpOnly cookies, the browser handles everything automatically.

  /**
   * Get access token from storage
   * 
   * DEMO: Retrieves from localStorage
   * PRODUCTION: Remove this method - cookie sent automatically by browser
   * 
   * @returns Access token or null
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  /**
   * Get refresh token from storage
   * 
   * DEMO: Retrieves from localStorage
   * PRODUCTION: Remove this method - cookie sent automatically by browser
   * 
   * @returns Refresh token or null
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  /**
   * Update stored tokens (used after token refresh)
   * 
   * DEMO: Updates localStorage
   * PRODUCTION: Remove this method - backend handles via httpOnly cookie
   * 
   * @param accessToken - New access token
   * @param refreshToken - New refresh token (optional)
   */
  setTokens: (accessToken: string, refreshToken?: string): void => {
    // Validate before storing
    if (!isValidTokenFormat(accessToken)) {
      console.error('Attempted to store invalid token format')
      return
    }
    
    localStorage.setItem(TOKEN_KEY, accessToken)
    
    if (refreshToken) {
      if (!isValidTokenFormat(refreshToken)) {
        console.error('Attempted to store invalid refresh token format')
        return
      }
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  },

  /**
   * Clear all tokens from storage
   * 
   * DEMO: Clears localStorage
   * PRODUCTION: Remove this method - backend clears via httpOnly cookie
   */
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  /**
   * Check if current token is valid and not expired
   * 
   * DEMO: Checks localStorage token
   * PRODUCTION: Remove this method - backend validates via httpOnly cookie
   * 
   * @returns True if valid and not expired
   */
  isTokenValid: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return false
    
    return isValidTokenFormat(token) && !isTokenExpired(token)
  },

  /**
   * Refresh access token using refresh token
   * 
   * DEMO: Uses localStorage refresh token
   * PRODUCTION: Remove this method - backend handles via httpOnly cookie
   * 
   * @returns New access token
   */
  refreshAccessToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await api.post(ENDPOINTS.AUTH.REFRESH, { refreshToken }) as { token: string }
    
    if (response.token) {
      authService.setTokens(response.token, refreshToken)
      return response.token
    }
    
    throw new Error('Token refresh failed')
  },
}

export default authService