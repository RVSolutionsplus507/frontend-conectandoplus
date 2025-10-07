import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { usePlayerStore } from '@/store/playerStore'
import { toast } from 'sonner'
import type { LoginInput, RegisterInput } from '@/lib/schemas'

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const { setCurrentPlayer, setLoading, setError } = usePlayerStore()

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      setLoading(true)
      setError(null)
      return apiClient.login(data.email, data.password)
    },
    onSuccess: (response) => {
      // Crear stats por defecto si no existen
      const userWithStats = {
        ...response.user,
        stats: response.user.stats || {
          gamesPlayed: 0,
          gamesWon: 0,
          totalScore: 0,
          averageScore: 0,
          categoryStats: {
            RC: { questionsAnswered: 0, correctAnswers: 0, totalPoints: 0, accuracy: 0 },
            AC: { questionsAnswered: 0, correctAnswers: 0, totalPoints: 0, accuracy: 0 },
            E: { questionsAnswered: 0, correctAnswers: 0, totalPoints: 0, accuracy: 0 },
            CE: { questionsAnswered: 0, correctAnswers: 0, totalPoints: 0, accuracy: 0 }
          }
        }
      }
      setCurrentPlayer(userWithStats)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('¡Inicio de sesión exitoso!')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
      setError(message)
      toast.error(message)
    },
    onSettled: () => {
      setLoading(false)
    }
  })
}

export function useRegisterMutation() {
  const queryClient = useQueryClient()
  const { setCurrentPlayer, setLoading, setError } = usePlayerStore()

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      setLoading(true)
      setError(null)
      return apiClient.register(data)
    },
    onSuccess: (response) => {
      // Crear stats por defecto si no existen
      const userWithStats = {
        ...response.user,
        stats: response.user.stats || {
          gamesPlayed: 0,
          gamesWon: 0,
          totalScore: 0,
          averageScore: 0,
          categoryStats: {
            RC: { questionsAnswered: 0, correctAnswers: 0, totalPoints: 0, accuracy: 0 },
            AC: { questionsAnswered: 0, correctAnswers: 0, totalPoints: 0, accuracy: 0 },
            E: { questionsAnswered: 0, correctAnswers: 0, totalPoints: 0, accuracy: 0 },
            CE: { questionsAnswered: 0, correctAnswers: 0, totalPoints: 0, accuracy: 0 }
          }
        }
      }
      setCurrentPlayer(userWithStats)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('¡Registro exitoso!')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al registrarse'
      setError(message)
      toast.error(message)
    },
    onSettled: () => {
      setLoading(false)
    }
  })
}

export function useCreateAdminMutation() {
  const { setLoading, setError } = usePlayerStore()

  return useMutation({
    mutationFn: async () => {
      setLoading(true)
      setError(null)
      return apiClient.createAdminUser()
    },
    onSuccess: () => {
      console.log('Admin user created successfully')
    },
    onError: () => {
      console.log('Admin user creation failed or already exists')
    },
    onSettled: () => {
      setLoading(false)
    }
  })
}
