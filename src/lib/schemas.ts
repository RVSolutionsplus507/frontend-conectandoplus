import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['admin', 'player']).optional()
})

// Game schemas
export const createGameSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  maxPlayers: z.number().min(2).max(8),
  isPrivate: z.boolean()
})

export const cardSchema = z.object({
  id: z.string(),
  category: z.enum(['RC', 'AC', 'E', 'CE']),
  type: z.enum(['multiple_choice', 'open_ended', 'explanation']),
  question: z.string().min(10, 'La pregunta debe tener al menos 10 caracteres'),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  points: z.number().min(1).max(4),
  explanation: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  cardNumber: z.number().optional()
})

// Player schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  avatar: z.string().url('URL de avatar inválida').optional()
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateGameInput = z.infer<typeof createGameSchema>
export type Card = z.infer<typeof cardSchema>
export type CardInput = z.infer<typeof cardSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
