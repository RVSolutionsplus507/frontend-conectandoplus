import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { usePlayerStore } from '@/store/playerStore'
import { toast } from 'sonner'
import type { Player } from '@/types/player'
import type { UpdateProfileInput } from '@/lib/schemas'

export function useProfileQuery() {
  const { currentPlayer } = usePlayerStore()
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.getProfile(),
    enabled: !!currentPlayer,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  const { setCurrentPlayer } = usePlayerStore()

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => apiClient.updateProfile(data),
    onSuccess: (updatedPlayer: Player) => {
      setCurrentPlayer(updatedPlayer)
      queryClient.setQueryData(['profile'], updatedPlayer)
      toast.success('¡Perfil actualizado exitosamente!')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al actualizar el perfil'
      toast.error(message)
    }
  })
}
