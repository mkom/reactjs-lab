export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface ApiError {
  message: string
  code: string
  errors?: Record<string, string[]>
  status?: number
}