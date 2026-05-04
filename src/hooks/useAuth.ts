import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, type LoginCredentials, type RegisterData } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'

const AUTH_KEYS = {
  all: ['auth'] as const,
  user: () => [...AUTH_KEYS.all, 'user'] as const,
}

export const useAuth = () => {
  return useQuery({
    queryKey: AUTH_KEYS.user(),
    queryFn: authService.getMe,
    retry: false,
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.setQueryData(AUTH_KEYS.user(), data.user)
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.setQueryData(AUTH_KEYS.user(), data.user)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
  })
}