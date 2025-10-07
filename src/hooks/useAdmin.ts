import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { User, Game, GlobalStats, CreateUserData, CreateGameData } from '@/types/admin'
import { toast } from 'sonner'

export function useAdmin() {
  const queryClient = useQueryClient()

  // Queries
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError
  } = useQuery<User[], Error>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const result = await apiClient.getUsers()
      console.log('🔍 DEBUG - Usuarios del backend:', result)
      console.log('🔍 DEBUG - Cantidad total:', result?.length || 0)
      console.log('🔍 DEBUG - Usuarios USER:', result?.filter(u => u.role === 'USER') || [])
      return result
    }
  })

  const {
    data: games,
    isLoading: gamesLoading,
    error: gamesError
  } = useQuery<Game[], Error>({
    queryKey: ['admin', 'games'],
    queryFn: () => apiClient.getGames()
  })

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useQuery<GlobalStats, Error>({
    queryKey: ['admin', 'stats'],
    queryFn: () => apiClient.getGlobalStats()
  })

  // Mutations
  const createUser = useMutation<User, Error, CreateUserData>({
    mutationFn: (userData: CreateUserData) => apiClient.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Usuario creado exitosamente')
    },
    onError: (error: Error) => {
      console.error('Error creating user:', error)
      toast.error('Error al crear usuario')
    }
  })

  const updateUserMutation = useMutation<User, Error, { userId: string; userData: Partial<CreateUserData> }>({
    mutationFn: ({ userId, userData }: { userId: string; userData: Partial<CreateUserData> }) =>
      apiClient.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Usuario actualizado exitosamente')
    },
    onError: (error: Error) => {
      console.error('Error updating user:', error)
      toast.error('Error al actualizar usuario')
    }
  })

  const deleteUser = useMutation<{ message: string }, Error, string>({
    mutationFn: (userId: string) => apiClient.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Usuario eliminado exitosamente')
    },
    onError: (error: Error) => {
      console.error('Error deleting user:', error)
      toast.error('Error al eliminar usuario')
    }
  })

  const createGame = useMutation<Game, Error, CreateGameData>({
    mutationFn: (gameData: CreateGameData) => apiClient.createGameAdmin(gameData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Partida creada exitosamente')
    },
    onError: (error: Error) => {
      console.error('Error creating game:', error)
      toast.error('Error al crear partida')
    }
  })

  const updateGameStatus = useMutation<{ id: string; status: string; updatedAt: string }, Error, { gameId: string; status: string }>({
    mutationFn: ({ gameId, status }: { gameId: string; status: string }) => 
      apiClient.updateGameStatus(gameId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Estado de partida actualizado')
    },
    onError: (error: Error) => {
      console.error('Error updating game status:', error)
      toast.error('Error al actualizar estado de partida')
    }
  })

  return {
    // Data
    users: users || [],
    games: games || [],
    stats,
    
    // Loading states
    usersLoading,
    gamesLoading,
    statsLoading,
    
    // Error states
    usersError,
    gamesError,
    statsError,
    
    // Mutations
    createUser: createUser.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUser.mutate,
    createGame: createGame.mutate,
    updateGameStatus: updateGameStatus.mutate,
    
    // Loading states for mutations
    isCreatingUser: createUser.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    isDeletingUser: deleteUser.isPending,
    isCreatingGame: createGame.isPending,
    isUpdatingGameStatus: updateGameStatus.isPending
  }
}
