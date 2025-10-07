export interface Player {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'ADMIN' | 'USER'
  gameRole?: 'PLAYER' | 'MODERATOR' | 'PLAYER_MODERATOR'
  isOnline: boolean
  currentGameId?: string
  stats: PlayerStats
  createdAt: Date
  updatedAt: Date
}

export interface PlayerStats {
  gamesPlayed: number
  gamesWon: number
  totalScore: number
  averageScore: number
  categoryStats: {
    RC: CategoryStats
    AC: CategoryStats
    E: CategoryStats
    CE: CategoryStats
  }
}

export interface CategoryStats {
  questionsAnswered: number
  correctAnswers: number
  totalPoints: number
  accuracy: number
}

export interface PlayerAction {
  type: 'JOIN_GAME' | 'LEAVE_GAME' | 'READY' | 'ANSWER' | 'DRAW_CARD'
  playerId: string
  gameId: string
  payload?: unknown
  timestamp: Date
}

export interface PlayerSession {
  playerId: string
  gameId: string
  joinedAt: Date
  isReady: boolean
  currentScore: number
}
