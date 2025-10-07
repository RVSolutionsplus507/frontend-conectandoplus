export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

export const GAME_CONFIG = {
  MAX_PLAYERS: 8,
  MIN_PLAYERS: 2,
  DEFAULT_TARGET_SCORE: 50,
  CARD_ANSWER_TIME: 30, // seconds
  EXPLANATION_TIME: 10, // seconds
  CATEGORIES: ['RC', 'AC', 'E', 'CE'] as const
} as const

export const ROUTES = {
  HOME: '/',
  LOBBY: '/lobby',
  GAME: '/game',
  PROFILE: '/profile',
  RULES: '/rules',
  ADMIN: '/admin'
} as const
