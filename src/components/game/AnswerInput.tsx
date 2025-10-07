'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Send } from 'lucide-react'

interface Card {
  id: string
  type: 'RC' | 'AC' | 'E' | 'CE'
  question: string
  options?: string[]
  points: number
  difficulty: string
}

interface AnswerInputProps {
  card: Card | null
  timeRemaining?: number
  onSubmitAnswer: (answer: string, timeUsed: number) => void
  onCancel?: () => void
}

export function AnswerInput({ card, timeRemaining = 60, onSubmitAnswer, onCancel }: AnswerInputProps) {
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(timeRemaining)

  const handleSubmit = useCallback(() => {
    const timeUsed = timeRemaining - timeLeft
    onSubmitAnswer(answer, timeUsed)
  }, [onSubmitAnswer, answer, timeLeft, timeRemaining])

  useEffect(() => {
    setTimeLeft(timeRemaining)
  }, [timeRemaining])

  useEffect(() => {
    if (timeLeft <= 0) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, handleSubmit])

  const getTimeColor = () => {
    if (timeLeft > 30) return 'bg-green-500'
    if (timeLeft > 15) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const progressValue = (timeLeft / timeRemaining) * 100

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-green-800">Tu Respuesta</CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className={`${getTimeColor()} text-white border-0`}>
              {timeLeft}s
            </Badge>
          </div>
        </div>
        <Progress value={progressValue} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {card && (
          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
            <p className="text-sm font-medium text-blue-800 mb-1">Pregunta:</p>
            <p className="text-sm text-blue-700">{card.question}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Escribe tu respuesta:
          </label>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Comparte tu reflexión, experiencia o respuesta..."
            className="min-h-[100px] resize-none"
            maxLength={500}
            autoFocus
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Todas las respuestas son válidas</span>
            <span>{answer.length}/500</span>
          </div>
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex items-center gap-2"
            >
              Cancelar
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            className="flex-1 flex items-center gap-2"
            disabled={timeLeft === 0}
          >
            <Send className="h-4 w-4" />
            Enviar Respuesta
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💡 Recuerda: Este es un espacio seguro para compartir y reflexionar
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
