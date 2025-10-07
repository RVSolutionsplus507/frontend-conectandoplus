import axios from 'axios'
import { API_BASE_URL } from './constants'
import { Player } from '@/types/player'
import { Card } from '@/types/card'
import { User, Game, GlobalStats, CreateGameData, CreateUserData } from '@/types/admin'

interface AuthResponse {
  user: Player
  token: string
}

interface PlayerResponse {
  id: string
  name: string
  score: number
  color: string
  isHost: boolean
  hasReadExplanations: boolean
}

interface GameResponse {
  id: string
  roomCode: string
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED'
  phase: 'WAITING' | 'EXPLANATION' | 'IN_PROGRESS' | 'FINISHED' | 'COMPLETED'
  currentTurn: number
  targetScore: number | null
  isFinished?: boolean
  winner?: {
    id: string
    name: string
    score: number
  } | null
  players: PlayerResponse[]
}

class ApiClient {
  private client: ReturnType<typeof axios.create>

  constructor(baseUrl: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Interceptor para agregar token de autenticación
    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        console.log('🔑 Token desde localStorage:', token ? 'Existe' : 'No existe')
        if (token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
          console.log('📤 Enviando token en header Authorization')
        }
      }
      return config
    })
  }

  private async request<T>(url: string, method: string = 'GET', data?: unknown): Promise<T> {
    try {
      const response = await this.client.request({
        url,
        method,
        data
      })
      
      // Si la respuesta tiene estructura { success: true, data: ... }, extraer data
      if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
        return response.data.data as T
      }
      
      return response.data as T
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', 'POST', { email, password })
    
    // Guardar token y usuario en localStorage
    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      console.log('💾 Token y usuario guardados en localStorage')
    }
    
    return response
  }

  async register(userData: {
    name: string
    email: string
    password: string
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', 'POST', { ...userData, role: 'USER' })
    
    // Guardar token y usuario en localStorage
    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      console.log('💾 Token y usuario guardados en localStorage')
    }
    
    return response
  }

  async createAdminUser(): Promise<Player> {
    return this.request<Player>('/auth/admin', 'POST', {
      email: 'admin@conectandoplus.com',
      password: 'Admin123!'
    })
  }

  // Game endpoints
  async createGame(gameData: {
    name: string
    maxPlayers: number
    isPrivate: boolean
  }): Promise<GameResponse> {
    return this.request<GameResponse>('/api/games', 'POST', gameData)
  }

  async getAvailableGames(): Promise<GameResponse[]> {
    return this.request<GameResponse[]>('/api/games')
  }

  async joinGame(gameId: string): Promise<GameResponse> {
    return this.request<GameResponse>(`/api/games/${gameId}/join`, 'POST')
  }

  // Player endpoints
  async getProfile(): Promise<Player> {
    return this.request<Player>('/api/players/profile')
  }

  async updateProfile(profileData: Partial<Player>): Promise<Player> {
    return this.request<Player>('/api/players/profile', 'PUT', profileData)
  }

  // Card endpoints
  async getCards(): Promise<Card[]> {
    return this.request<Card[]>('/api/cards')
  }

  async createCard(cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> {
    return this.request<Card>('/api/cards', 'POST', cardData)
  }

  // Admin endpoints
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/admin/users')
  }

  async createUser(userData: CreateUserData): Promise<User> {
    return this.request<User>('/api/admin/users', 'POST', userData)
  }

  async updateUser(userId: string, userData: Partial<CreateUserData>): Promise<User> {
    return this.request<User>(`/api/admin/users/${userId}`, 'PUT', userData)
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/admin/users/${userId}`, 'DELETE')
  }

  async getGames(): Promise<Game[]> {
    return this.request<Game[]>('/api/admin/games')
  }

  async createGameAdmin(gameData: CreateGameData): Promise<Game> {
    return this.request<Game>('/api/admin/games', 'POST', gameData)
  }

  async getGameDetails(gameId: string): Promise<Game> {
    return this.request<Game>(`/api/admin/games/${gameId}`)
  }

  async updateGameStatus(gameId: string, status: string): Promise<{ id: string; status: string; updatedAt: string }> {
    return this.request<{ id: string; status: string; updatedAt: string }>(`/api/admin/games/${gameId}/status`, 'PUT', { status })
  }

  async getGlobalStats(): Promise<GlobalStats> {
    return this.request<GlobalStats>('/api/admin/stats')
  }
}

export const apiClient = new ApiClient()
