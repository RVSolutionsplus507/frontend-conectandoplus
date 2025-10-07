export type GamePhase = 'lobby' | 'explanation' | 'playing' | 'finished'

export type CardCategory = 'RC' | 'AC' | 'E' | 'CE'

export interface Card {
  id: string
  category: CardCategory
  type: 'multiple_choice' | 'open_ended' | 'explanation'
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags?: string[]
}

export interface GameState {
  id: string
  phase: GamePhase
  currentPlayerId?: string
  currentPlayerIndex: number
  players: string[]
  scores: Record<string, number>
  currentCard: Card | null
  usedCards: string[]
  cardPiles: {
    RC: Card[]
    AC: Card[]
    E: Card[]
    CE: Card[]
  }
  settings: {
    maxPlayers: number
    targetScore: number
    timeLimit: number
    allowedCategories?: CardCategory[]
  }
  createdAt: Date
  updatedAt: Date
  status?: 'WAITING' | 'IN_PROGRESS' | 'FINISHED'
  round?: number
  timeRemaining?: number
  isInDebate?: boolean
  currentAnswer?: {
    playerId: string
    playerName: string
    votes: Map<string, 'agree' | 'disagree'>
  }
}

export interface GameAction {
  type: 'DRAW_CARD' | 'ANSWER_CARD' | 'NEXT_TURN' | 'END_GAME' | 'START_GAME'
  playerId: string
  payload?: unknown
}

export interface GameRoom {
  id: string
  name: string
  hostId: string
  players: string[]
  maxPlayers: number
  isPrivate: boolean
  status: 'waiting' | 'playing' | 'finished'
  targetScore?: number
  allowedCategories?: CardCategory[]
  createdAt: Date
}

export interface DebateInfo {
  playerId: string
  playerName: string
  agreeVotes: number
  disagreeVotes: number
  totalVotes: number
  votes: Array<{
    playerId: string
    playerName?: string
    vote: 'agree' | 'disagree'
  }>
}
