export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  stats: {
    gamesPlayed: number
    gamesWon: number
    totalScore: number
    avgScore: number
  }
}

export interface Game {
  id: string
  roomCode: string
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED'
  currentTurn: number
  phase: 'EXPLANATION' | 'NORMAL'
  targetScore: number | null
  createdAt: string
  players: GamePlayer[]
  winner?: {
    id: string
    name: string
    score: number
  }
}

export interface GamePlayer {
  id: string
  name: string
  score: number
  isHost: boolean
}

export interface GlobalStats {
  overview: {
    totalUsers: number
    totalGames: number
    activeGames: number
    finishedGames: number
  }
  topPlayers: {
    name: string
    totalScore: number
    gamesPlayed: number
  }[]
}

export interface CreateGameData {
  roomCode: string
  targetScore?: number
  selectedUsers?: string[]
  allowedCategories?: string[]
  playerRole?: 'PLAYER' | 'MODERATOR' | 'PLAYER_MODERATOR'
}

export interface CreateUserData {
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}
