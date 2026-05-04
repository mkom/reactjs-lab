import axios from 'axios'

const baseURL = import.meta.env.VITE_ENABLE_MOCK === 'true'
  ? '/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

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

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      })
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          { refreshToken }
        )

        const { access_token } = response.data
        localStorage.setItem('token', access_token)

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject({
          message: 'Session expired. Please login again.',
          code: 'SESSION_EXPIRED',
        })
      }
    }

    if (error.response?.status === 403) {
      return Promise.reject({
        message: 'You do not have permission.',
        code: 'FORBIDDEN',
      })
    }

    if (error.response?.status === 404) {
      return Promise.reject({
        message: 'Resource not found.',
        code: 'NOT_FOUND',
      })
    }

    if (error.response?.status === 422) {
      return Promise.reject({
        message: 'Validation failed.',
        code: 'VALIDATION_ERROR',
        errors: error.response.data.errors,
      })
    }

    if (error.response?.status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
      })
    }

    return Promise.reject({
      message: error.response?.data?.message || 'Something went wrong.',
      code: 'ERROR',
    })
  }
)

export default api