import api from './api'
import { ENDPOINTS } from './endpoints'

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

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const data = await api.post(ENDPOINTS.AUTH.LOGIN, credentials) as AuthResponse
    if (data.token) {
      localStorage.setItem('token', data.token)
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
    }
    return data
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const data = await api.post(ENDPOINTS.AUTH.REGISTER, userData) as AuthResponse
    if (data.token) {
      localStorage.setItem('token', data.token)
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
    }
    return data
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
    }
  },

  getMe: async (): Promise<AuthUser> => {
    return api.get(ENDPOINTS.AUTH.ME) as Promise<AuthUser>
  },
}