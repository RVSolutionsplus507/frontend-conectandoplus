'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { CardImage } from './CardImage'
import type { Card as GameCard } from '@/lib/schemas'

interface CardDisplayProps {
  card: GameCard
  isCurrentPlayerTurn: boolean
}

export function CardDisplay({ card, isCurrentPlayerTurn }: CardDisplayProps) {
  const { settings, answerQuestion, skipCard } = useGameStore()
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    setTimeLeft(settings.timeLimit)
    setHasAnswered(false)
    setIsCorrect(null)
    setSelectedAnswer('')
  }, [card, settings.timeLimit])

  useEffect(() => {
    const handleTimeUp = () => {
      setHasAnswered(true)
      setIsCorrect(false)
      skipCard()
    }

    if ((timeLeft ?? 0) > 0 && !hasAnswered && isCurrentPlayerTurn) {
      const timer = setTimeout(() => setTimeLeft((prev) => (prev ?? 0) - 1), 1000)
      return () => clearTimeout(timer)
    } else if ((timeLeft ?? 0) === 0 && !hasAnswered && isCurrentPlayerTurn) {
      handleTimeUp()
    }
  }, [timeLeft, hasAnswered, isCurrentPlayerTurn, skipCard])


  const handleAnswer = (answer: string) => {
    if (hasAnswered || !isCurrentPlayerTurn) return
    
    setSelectedAnswer(answer)
    setHasAnswered(true)
    
    const correct = answer === card.correctAnswer
    setIsCorrect(correct)
    
    answerQuestion(answer, correct)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'RC': return 'bg-yellow-card border-yellow-600 text-yellow-800'
      case 'AC': return 'bg-pink-card border-pink-600 text-pink-800'
      case 'E': return 'bg-blue-card border-blue-600 text-blue-800'
      case 'CE': return 'bg-green-card border-green-600 text-green-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'RC': return 'Resolución de Conflictos'
      case 'AC': return 'Autoconocimiento'
      case 'E': return 'Empatía'
      case 'CE': return 'Comunicación Efectiva'
      default: return category
    }
  }

  return (
    <Card className={`w-full ${getCategoryColor(card.category)} border-2`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/80">
              {card.category}
            </Badge>
            <span className="text-lg">{getCategoryName(card.category)}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{card.points} puntos</Badge>
            {isCurrentPlayerTurn && !hasAnswered && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm">{timeLeft ?? 0}s</span>
              </div>
            )}
          </div>
        </div>
        {isCurrentPlayerTurn && !hasAnswered && (
          <Progress value={((timeLeft ?? 0) / (settings?.timeLimit || 30)) * 100} className="h-2" />
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {card.imageUrl && (
          <div className="flex justify-center">
            <CardImage 
              imageUrl={card.imageUrl}
              cardNumber={card.cardNumber}
              category={card.category}
              className="w-48 h-32"
            />
          </div>
        )}
        
        <div className="bg-white/80 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Pregunta:</h3>
          <p className="text-lg">{card.question}</p>
        </div>

        {card.type === 'multiple_choice' && card.options && (
          <div className="space-y-2">
            <h4 className="font-medium">Opciones:</h4>
            {card.options.map((option: string, index: number) => {
              const letter = String.fromCharCode(65 + index)
              const isSelected = selectedAnswer === option
              const isCorrectOption = hasAnswered && option === card.correctAnswer
              const isWrongSelected = hasAnswered && isSelected && !isCorrectOption
              
              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto p-3 ${
                    isCorrectOption ? 'bg-green-100 border-green-500 text-green-800' :
                    isWrongSelected ? 'bg-red-100 border-red-500 text-red-800' : ''
                  }`}
                  onClick={() => handleAnswer(option)}
                  disabled={hasAnswered || !isCurrentPlayerTurn}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{letter})</span>
                    <span>{option}</span>
                    {hasAnswered && isCorrectOption && <CheckCircle className="h-4 w-4 ml-auto" />}
                    {hasAnswered && isWrongSelected && <XCircle className="h-4 w-4 ml-auto" />}
                  </div>
                </Button>
              )
            })}
          </div>
        )}

        {card.type === 'open_ended' && (
          <div className="bg-white/80 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Pregunta abierta - Responde en voz alta y el grupo decidirá si es correcta
            </p>
            {isCurrentPlayerTurn && !hasAnswered && (
              <div className="flex gap-2 mt-3">
                <Button onClick={() => handleAnswer('correct')} className="bg-green-600 hover:bg-green-700">
                  Respuesta Correcta
                </Button>
                <Button onClick={() => handleAnswer('incorrect')} variant="destructive">
                  Respuesta Incorrecta
                </Button>
              </div>
            )}
          </div>
        )}

        {hasAnswered && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <div className="flex items-center gap-2">
              {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
              <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? `¡Correcto! +${card.points} puntos` : 'Incorrecto - Sin puntos'}
              </span>
            </div>
            {card.explanation && (
              <p className="mt-2 text-sm text-gray-700">
                <strong>Explicación:</strong> {card.explanation}
              </p>
            )}
          </div>
        )}

        {!isCurrentPlayerTurn && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700 text-center">
              Esperando respuesta del jugador actual...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
