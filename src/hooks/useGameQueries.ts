import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { toast } from 'sonner'
import type { CreateGameInput } from '@/lib/schemas'

export function useGamesQuery() {
  return useQuery({
    queryKey: ['games'],
    queryFn: () => apiClient.getAvailableGames(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export function useCreateGameMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateGameInput) => apiClient.createGame(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      toast.success('¡Partida creada exitosamente!')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al crear la partida'
      toast.error(message)
    }
  })
}

export function useJoinGameMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gameId: string) => apiClient.joinGame(gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      toast.success('¡Te has unido a la partida!')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al unirse a la partida'
      toast.error(message)
    }
  })
}
