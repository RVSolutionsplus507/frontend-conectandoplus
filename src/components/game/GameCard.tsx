'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LucideIcon, Star } from 'lucide-react'
import { CardImage } from './CardImage'

interface GameCardData {
  id: string
  type: 'RC' | 'AC' | 'E' | 'CE'
  question: string
  options?: string[]
  points: number
  difficulty: string
  imageUrl?: string
  cardNumber?: number
}

interface CardCategory {
  type: 'RC' | 'AC' | 'E' | 'CE'
  name: string
  color: string
  icon: LucideIcon
}

interface GameCardProps {
  card: GameCardData
  category?: CardCategory
  isMyTurn: boolean
  onShowAnswer: () => void
}

export function GameCard({ card, category, isMyTurn, onShowAnswer }: GameCardProps) {
  const Icon = category?.icon

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 1
      case 'medium':
        return 2
      case 'hard':
        return 3
      default:
        return 1
    }
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && category && (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{category?.name || card.type}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getDifficultyColor(card.difficulty)}>
                  {card.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  {Array.from({ length: getDifficultyStars(card.difficulty) }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Badge className="bg-blue-600 text-white">
            {card.points} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {card.imageUrl && (
          <div className="flex justify-center">
            <CardImage 
              imageUrl={card.imageUrl}
              cardNumber={card.cardNumber}
              category={card.type}
              className="w-40 h-28"
            />
          </div>
        )}
        
        <div className="p-4 bg-white rounded-lg border-l-4 border-l-blue-500">
          <p className="text-lg leading-relaxed">{card.question}</p>
        </div>

        {card.options && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Opciones:</p>
            <div className="grid gap-2">
              {Array.isArray(card.options) ? (
                card.options.map((option: string, index: number) => (
                  <div key={index} className="p-2 bg-gray-50 rounded border text-sm">
                    {String.fromCharCode(65 + index)}. {option}
                  </div>
                ))
              ) : (
                <div className="p-2 bg-gray-50 rounded border text-sm">
                  {JSON.stringify(card.options)}
                </div>
              )}
            </div>
          </div>
        )}

        {isMyTurn && (
          <div className="flex justify-center pt-4">
            <Button 
              onClick={onShowAnswer}
              size="lg"
              className="flex items-center gap-2"
            >
              Responder Pregunta
            </Button>
          </div>
        )}

        {!isMyTurn && (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              Esperando respuesta del jugador actual...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
