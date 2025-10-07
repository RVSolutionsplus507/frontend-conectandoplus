import { useEffect, useCallback } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { useLoginMutation, useRegisterMutation, useCreateAdminMutation } from './useAuthQueries'

export function useAuth() {
  const {
    currentPlayer,
    isAuthenticated,
    isLoading,
    error,
    logout
  } = usePlayerStore()

  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const createAdminMutation = useCreateAdminMutation()

  const login = async (email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password })
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
  }) => {
    return registerMutation.mutateAsync(userData)
  }

  // Initialize admin user on first load
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        await createAdminMutation.mutateAsync()
      } catch {
        // Admin user creation failed or already exists
      }
    }
    
    initializeAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once on mount

  const createAdminUser = useCallback(async () => {
    return createAdminMutation.mutateAsync()
  }, [createAdminMutation])

  return {
    currentPlayer,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    error,
    login,
    register,
    logout,
    createAdminUser
  }
}
