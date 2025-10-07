import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Player } from '@/types/player'

interface PlayerStore {
  currentPlayer: Player | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setCurrentPlayer: (player: Player | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updatePlayerStats: (stats: Partial<Player['stats']>) => void
  logout: () => void
}

// Función para inicializar desde localStorage
const initializeFromStorage = () => {
  if (typeof window === 'undefined') return { currentPlayer: null, isAuthenticated: false }
  
  try {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (user && token) {
      const parsedUser = JSON.parse(user)
      console.log('🔍 DEBUG PlayerStore - Initializing from localStorage:', parsedUser)
      return {
        currentPlayer: parsedUser,
        isAuthenticated: true
      }
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
  
  return { currentPlayer: null, isAuthenticated: false }
}

export const usePlayerStore = create<PlayerStore>()(
  devtools(
    (set) => {
      const initialState = initializeFromStorage()
      return {
        currentPlayer: initialState.currentPlayer,
        isAuthenticated: initialState.isAuthenticated,
        isLoading: false,
        error: null,

        setCurrentPlayer: (player) =>
          set(() => ({
            currentPlayer: player,
            isAuthenticated: !!player,
            error: null
          }), false, 'setCurrentPlayer'),

        setAuthenticated: (authenticated) =>
          set(() => ({ isAuthenticated: authenticated }), false, 'setAuthenticated'),

        setLoading: (loading) =>
          set(() => ({ isLoading: loading }), false, 'setLoading'),

        setError: (error) =>
          set(() => ({ error }), false, 'setError'),

        updatePlayerStats: (stats) =>
          set((state) => {
            if (!state.currentPlayer) return state
            return {
              currentPlayer: {
                ...state.currentPlayer,
                stats: { ...state.currentPlayer.stats, ...stats },
                updatedAt: new Date()
              }
            }
          }, false, 'updatePlayerStats'),

        logout: () => {
          // Limpiar localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            console.log('🗑️ Token y usuario removidos del localStorage')
          }
          
          set(() => ({
            currentPlayer: null,
            isAuthenticated: false,
            error: null
          }), false, 'logout')
        }
      }
    },
    { name: 'player-store' }
  )
)
