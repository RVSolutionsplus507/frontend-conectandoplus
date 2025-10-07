'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Clock, 
  Play, 
  Users, 
  Trophy, 
  ArrowRight,
  CheckCircle,
  Timer
} from 'lucide-react'
import { GameCard, CardType, GAME_CONFIG } from '@/data/cards'
import { CardSelector } from './CardSelector'
import { Heart, Brain, Users2, MessageCircle } from 'lucide-react'
import { GameCard as GameCardComponent } from './GameCard'
import { AnswerInput } from './AnswerInput'

interface Player {
  id: string
  name: string
  score: number
  isConnected: boolean
}

interface GamePhase {
  type: 'WAITING' | 'EXPLANATION' | 'CARD_SELECTION' | 'ANSWERING' | 'SCORING' | 'FINISHED'
  timeRemaining?: number
  currentPlayerId?: string
}

interface GamePhaseManagerProps {
  currentPhase: GamePhase
  currentCard: GameCard | null
  currentPlayer: Player | null
  players: Player[]
  round: number
  isMyTurn: boolean
  isFirstGame: boolean
  onSelectCard: (type: CardType) => void
  onSubmitAnswer: (playerId: string) => void
  onNextTurn: () => void
  onScoreAnswer: (points: number) => void
  onNextAfterExplanation?: () => void
}

export function GamePhaseManager({
  currentPhase,
  currentCard,
  currentPlayer,
  players,
  round,
  isMyTurn,
  isFirstGame,
  onSelectCard,
  onSubmitAnswer,
  onNextTurn,
  onScoreAnswer,
  onNextAfterExplanation
}: GamePhaseManagerProps) {
  const [timeLeft, setTimeLeft] = useState(currentPhase.timeRemaining || 0)

  // Timer para las fases con tiempo límite
  useEffect(() => {
    if (currentPhase.timeRemaining && currentPhase.timeRemaining > 0) {
      setTimeLeft(currentPhase.timeRemaining)
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            // Auto-pasar al siguiente turno si se acaba el tiempo
            if (currentPhase.type === 'ANSWERING') {
              onNextTurn()
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentPhase.timeRemaining, currentPhase.type, onNextTurn])

  const renderPhaseContent = () => {
    switch (currentPhase.type) {
      case 'WAITING':
        return (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-6 w-6" />
                Esperando Jugadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Esperando a que se unan más jugadores para comenzar la partida
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline">
                  {players.length}/{GAME_CONFIG.MAX_PLAYERS} jugadores
                </Badge>
              </div>
            </CardContent>
          </Card>
        )

      case 'EXPLANATION':
        return (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-blue-500" />
                {isFirstGame ? 'Primera Partida - Explicaciones' : 'Carta Explicativa'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCard && (
                <GameCardComponent 
                  card={currentCard}
                  isMyTurn={false}
                  onShowAnswer={() => {}}
                />
              )}
              
              {isFirstGame && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>¡Bienvenido a Conectando+!</strong>
                  </p>
                  <p className="text-sm text-blue-600">
                    Estamos mostrando las explicaciones de cada categoría. 
                    Después comenzaremos el juego normal.
                  </p>
                </div>
              )}
              
              <Button 
                onClick={onNextAfterExplanation || onNextTurn}
                className="w-full"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Continuar
              </Button>
            </CardContent>
          </Card>
        )

      case 'CARD_SELECTION':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="h-6 w-6" />
                  Selección de Carta
                </div>
                <Badge variant="outline">
                  Ronda {round}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">
                  {isMyTurn ? 'Es tu turno' : `Turno de ${currentPlayer?.name}`}
                </p>
                {isMyTurn && (
                  <p className="text-muted-foreground mb-4">
                    Selecciona una categoría para robar una carta
                  </p>
                )}
              </div>

              {isMyTurn ? (
                <CardSelector 
                  categories={[
                    { type: 'RC', name: 'Resolución de Conflictos', color: 'bg-yellow-500', icon: MessageCircle },
                    { type: 'AC', name: 'Autoconocimiento', color: 'bg-pink-500', icon: Brain },
                    { type: 'E', name: 'Empatía', color: 'bg-blue-500', icon: Heart },
                    { type: 'CE', name: 'Comunicación Efectiva', color: 'bg-green-500', icon: Users2 }
                  ]}
                  onSelectCard={onSelectCard} 
                />
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground">
                    Esperando a que {currentPlayer?.name} seleccione una carta...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 'ANSWERING':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-6 w-6" />
                  Respondiendo Pregunta
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{timeLeft}s</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Barra de progreso del tiempo */}
              <Progress 
                value={(timeLeft / (currentPhase.timeRemaining || 60)) * 100} 
                className="h-2"
              />

              {currentCard && (
                <GameCardComponent 
                  card={currentCard}
                  isMyTurn={false}
                  onShowAnswer={() => {}}
                />
              )}

              {isMyTurn ? (
                <AnswerInput
                  card={currentCard}
                  timeRemaining={timeLeft}
                  onSubmitAnswer={() => onSubmitAnswer(currentPlayer?.id || '')}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    {currentPlayer?.name} está respondiendo...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 'SCORING':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6" />
                Puntuación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCard && (
                <GameCardComponent 
                  card={currentCard}
                  isMyTurn={false}
                  onShowAnswer={() => {}}
                />
              )}

              <div className="text-center">
                <p className="text-lg mb-4">
                  ¿Cómo calificarías la respuesta de {currentPlayer?.name}?
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => onScoreAnswer(0)}
                    variant="outline"
                    className="h-16"
                  >
                    <div className="text-center">
                      <div className="font-bold">0 puntos</div>
                      <div className="text-sm text-muted-foreground">No respondió</div>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => onScoreAnswer(currentCard?.points || 2)}
                    className="h-16"
                  >
                    <div className="text-center">
                      <div className="font-bold">{currentCard?.points || 2} puntos</div>
                      <div className="text-sm">Respuesta válida</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'FINISHED':
        const winner = players.reduce((prev, current) => 
          prev.score > current.score ? prev : current
        )
        
        return (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Trophy className="h-8 w-8 text-yellow-500" />
                ¡Juego Terminado!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">🏆 Ganador</h3>
                <p className="text-2xl font-bold text-primary">{winner.name}</p>
                <p className="text-lg text-muted-foreground">{winner.score} puntos</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Puntuación Final:</h4>
                {players
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div key={player.id} className="flex justify-between items-center">
                      <span>#{index + 1} {player.name}</span>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {player.score} pts
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {renderPhaseContent()}
    </div>
  )
}
