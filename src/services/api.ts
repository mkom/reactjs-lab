/**
 * API Client Configuration
 * 
 * Axios instance with security enhancements:
 * - Request/response interceptors for token management
 * - Token validation before sending
 * - Automatic token refresh on 401
 * - Secure error handling
 * 
 * PRODUCTION NOTE:
 * When using httpOnly cookies, uncomment the withCredentials option
 * and remove all token-related code (Authorization headers, localStorage access)
 * 
 * @module services/api
 */

import axios from 'axios'
import { authService } from './authService'
import { isValidTokenFormat } from '@/utils/security'

const baseURL = import.meta.env.VITE_ENABLE_MOCK === 'true'
  ? '/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Axios instance with security configurations
 */
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // PRODUCTION: Uncomment when using httpOnly cookies
  // withCredentials: true,
})

/**
 * Request Interceptor
 * 
 * Adds authentication token to requests and validates token format
 * before sending to prevent sending malformed tokens.
 */
api.interceptors.request.use(
  (config) => {
    // DEMO: Get token from authService (which uses localStorage)
    // PRODUCTION: Remove this block - httpOnly cookie sent automatically
    const token = authService.getAccessToken()
    
    if (token && config.headers) {
      // Security: Validate token format before sending
      if (!isValidTokenFormat(token)) {
        console.error('Invalid token format detected, clearing tokens')
        authService.clearTokens()
        // Redirect to login
        window.location.href = '/login'
        return Promise.reject(new Error('Invalid authentication token'))
      }
      
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response Interceptor
 * 
 * Handles errors and automatically refreshes token on 401 responses.
 * Implements secure error handling with specific error messages.
 */
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    // Network error (no response received)
    if (!originalRequest) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      })
    }

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt to refresh the token
        const newToken = await authService.refreshAccessToken()
        
        // Update the failed request with new token and retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Token refresh failed, clear auth and redirect to login
        authService.clearTokens()
        
        // Use replace to prevent back button returning to protected page
        window.location.replace('/login')
        
        return Promise.reject({
          message: 'Session expired. Please login again.',
          code: 'SESSION_EXPIRED',
        })
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      return Promise.reject({
        message: 'You do not have permission to access this resource.',
        code: 'FORBIDDEN',
      })
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      return Promise.reject({
        message: 'The requested resource was not found.',
        code: 'NOT_FOUND',
      })
    }

    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      return Promise.reject({
        message: 'Validation failed. Please check your input.',
        code: 'VALIDATION_ERROR',
        errors: error.response.data.errors,
      })
    }

    // Handle 429 Rate Limit
    if (error.response?.status === 429) {
      return Promise.reject({
        message: 'Too many requests. Please try again later.',
        code: 'RATE_LIMITED',
      })
    }

    // Handle Server Errors (5xx)
    if (error.response?.status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
      })
    }

    // Default error
    return Promise.reject({
      message: error.response?.data?.message || 'An unexpected error occurred.',
      code: 'ERROR',
    })
  }
)

export default api