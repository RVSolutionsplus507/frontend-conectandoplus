import { CardCategory } from './game'

export interface Card {
  id: string
  category: CardCategory
  type: 'question' | 'explanation'
  question: string
  options?: string[]
  correctAnswer?: number
  points: number
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags?: string[]
  imageUrl?: string
  cardNumber?: number
  createdAt: Date
  updatedAt: Date
}

export interface CardDeck {
  RC: Card[]
  AC: Card[]
  E: Card[]
  CE: Card[]
}

export interface CardAnswer {
  cardId: string
  playerId: string
  selectedOption: number
  isCorrect: boolean
  timeSpent: number
  pointsEarned: number
  answeredAt: Date
}

export const CATEGORY_INFO = {
  RC: {
    name: 'Resolución de Conflictos',
    description: 'Situaciones de conflicto y estrategias de resolución',
    color: 'yellow',
    cssVar: '--yellow-card'
  },
  AC: {
    name: 'Autoconocimiento',
    description: 'Reflexión personal y autoconocimiento',
    color: 'pink',
    cssVar: '--pink-card'
  },
  E: {
    name: 'Empatía',
    description: 'Desarrollo de empatía y comprensión del otro',
    color: 'blue',
    cssVar: '--blue-card'
  },
  CE: {
    name: 'Comunicación Efectiva',
    description: 'Habilidades de comunicación efectiva',
    color: 'green',
    cssVar: '--green-card'
  }
} as const
