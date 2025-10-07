'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Vote, CheckCircle, ThumbsUp, ThumbsDown, Trophy, XCircle } from 'lucide-react'
import { CardModal } from './CardModal'
import { useSocket } from '@/hooks/useSocket'

interface GameCard {
  id: string
  type: 'RC' | 'AC' | 'E' | 'CE' // Esta es la categoría en el backend
  question: string
  options?: string[]
  points: number
  difficulty: string
  imageUrl?: string
  cardNumber?: number
}

interface Player {
  id: string
  name: string
  score: number
}

interface CardAnswerFlowProps {
  card: GameCard
  currentPlayer: Player
  otherPlayers: Player[]
  isMyTurn: boolean
  gamePhase?: string
  onApproveAnswer: (approved: boolean) => void
  onNextTurn: () => void
}

type FlowState = 'reading' | 'answering' | 'waiting_approval' | 'completed'

export function CardAnswerFlow({
  card,
  currentPlayer,
  otherPlayers,
  isMyTurn,
  gamePhase,
  onApproveAnswer,
  onNextTurn
}: CardAnswerFlowProps) {
  const [flowState, setFlowState] = useState<FlowState>('reading')
  const [approvals, setApprovals] = useState<Record<string, boolean>>({})
  const [hasVoted, setHasVoted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(true)

  // Sincronizar flowState con gamePhase del backend
  useEffect(() => {
    console.log('🔄 GamePhase changed to:', gamePhase, 'Current flowState:', flowState)
    if (gamePhase === 'VOTING') {
      console.log('🗳️ Setting voting phase from gamePhase prop')
      setFlowState('waiting_approval')
      setIsModalOpen(false) // Cerrar modal cuando empiece la votación
    } else if (gamePhase === 'READING') {
      console.log('📖 Setting reading phase from gamePhase prop')
      setFlowState('reading')
      setIsModalOpen(true) // Mantener modal abierto para todos durante lectura
    } else if (gamePhase === 'PLAYING') {
      console.log('🎮 Playing phase detected, current flowState:', flowState)
      // Si estamos en estado completed, dar tiempo para mostrar el resultado
      if (flowState === 'completed') {
        console.log('⏰ Delaying reset to show voting result...')
        setTimeout(() => {
          console.log('🔄 Now resetting state for new turn')
          setFlowState('reading')
          setIsModalOpen(true)
          setResult(null)
          setApprovals({})
          setHasVoted(false)
        }, 2000) // 2 segundos para mostrar el resultado
      } else {
        console.log('🎮 Setting playing phase - resetting state for new turn')
        setFlowState('reading')
        setIsModalOpen(true)
        setResult(null)
        setApprovals({})
        setHasVoted(false)
      }
    }
  }, [gamePhase, flowState])
  const [result, setResult] = useState<{
    approved: boolean;
    pointsEarned: number;
    approvedVotes: number;
    totalVotes: number;
  } | null>(null)

  const { socket } = useSocket()

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'RC': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'AC': return 'bg-pink-100 border-pink-300 text-pink-800'
      case 'E': return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'CE': return 'bg-green-100 border-green-300 text-green-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getCategoryName = (type: string) => {
    switch (type) {
      case 'RC': return 'Resolución de Conflictos'
      case 'AC': return 'Autoconocimiento'
      case 'E': return 'Empatía'
      case 'CE': return 'Comunicación Efectiva'
      default: return type
    }
  }

  const handleStartAnswering = () => {
    console.log('🎯 Jugador terminó de leer, emitiendo card-read:', {
      playerId: currentPlayer.id,
      cardId: card.id
    })
    
    // Emitir evento de que el jugador terminó de leer
    socket?.emit('card-read', {
      playerId: currentPlayer.id,
      cardId: card.id
    })
    
    // NO cambiar el estado local aquí, esperar a que el backend confirme
    // setFlowState('waiting_approval')
    // setIsModalOpen(false)
  }


  const handleApproval = (approved: boolean) => {
    if (hasVoted) return
    
    setHasVoted(true)
    onApproveAnswer(approved)
  }

  // Escuchar eventos del socket
  useEffect(() => {
    if (!socket) return

    const handlePhaseChanged = (data: { phase: string }) => {
      console.log('🔄 Phase changed received in frontend:', data.phase)
      if (data.phase === 'VOTING') {
        console.log('🗳️ Cambiando a fase de votación - cerrando modal y mostrando opciones')
        setFlowState('waiting_approval')
        setIsModalOpen(false) // Cerrar modal para todos cuando inicia votación
        setHasVoted(false) // Reset voting state for new voting round
      }
    }

    const handleVoteRegistered = (data: { playerId: string; approved: boolean; totalVotes: number; approvedVotes: number }) => {
      console.log('🗳️ Vote registered:', data)
      setApprovals(prev => ({ ...prev, [data.playerId]: data.approved }))
    }

    const handleVotingCompleted = (data: {
      approved: boolean;
      totalVotes: number;
      approvedVotes: number;
      pointsEarned: number;
      message: string;
    }) => {
      console.log('✅ Voting completed:', data)
      const resultData = {
        approved: data.approved,
        pointsEarned: data.pointsEarned,
        approvedVotes: data.approvedVotes,
        totalVotes: data.totalVotes
      }
      console.log('📊 Setting result data:', resultData)
      setResult(resultData)
      console.log('🎯 Setting flowState to completed')
      setFlowState('completed')
      
      // No auto-avanzar aquí, el backend ya maneja el auto-advance
      // setTimeout(() => {
      //   onNextTurn()
      // }, 3000)
    }

    socket.on('phase-changed', handlePhaseChanged)
    socket.on('vote-registered', handleVoteRegistered)
    socket.on('voting-completed', handleVotingCompleted)

    return () => {
      socket.off('phase-changed', handlePhaseChanged)
      socket.off('vote-registered', handleVoteRegistered)
      socket.off('voting-completed', handleVotingCompleted)
    }
  }, [socket, onNextTurn])


  return (
    <>
      {/* Modal de la Carta */}
      <CardModal
        card={card}
        currentPlayer={currentPlayer}
        isMyTurn={isMyTurn}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCardRead={handleStartAnswering}
      />

      {/* Vista compacta cuando el modal está cerrado */}
      {!isModalOpen && (
        <Card className={`w-full ${getCategoryColor(card.type)} border-2`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white/80">
                  {card.type}
                </Badge>
                <span className="text-lg">{getCategoryName(card.type)}</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{card.points} puntos</Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Vista compacta de la carta */}
            <div className="bg-white/90 p-4 rounded-xl shadow-lg border-2 border-white/50">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-800 mb-2">{card.question}</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2"
                >
                  Ver carta completa
                </Button>
              </div>
            </div>

            {/* Estado: Esperando votación */}
            {flowState === 'waiting_approval' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Vote className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-purple-800">
                    {isMyTurn ? 'Esperando votación de otros jugadores' : 'Vota la respuesta'}
                  </span>
                </div>
                
                {isMyTurn ? (
                  <div className="text-center text-purple-700">
                    <div className="animate-pulse mb-2">⏳</div>
                    <p>Los otros jugadores están votando tu respuesta...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-purple-700 mb-4">
                      ¿Estás de acuerdo con la respuesta de {currentPlayer.name}?
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        onClick={() => handleApproval(true)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={hasVoted}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        De acuerdo
                      </Button>
                      <Button 
                        onClick={() => handleApproval(false)}
                        variant="destructive"
                        disabled={hasVoted}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        En desacuerdo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mostrar votos en progreso */}
            {flowState === 'waiting_approval' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">Evaluación de respuesta</span>
                </div>
                
                {/* Mostrar votos */}
                <div className="mt-3">
                  <p className="text-xs text-orange-600 mb-1">
                    Votos: {Object.keys(approvals).length} de {otherPlayers.length}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {otherPlayers.map(player => (
                      <div key={player.id} className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded">
                        <span className="text-xs">{player.name}</span>
                        {player.id in approvals ? (
                          approvals[player.id] ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-600" />
                          )
                        ) : (
                          <Clock className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Estado: Completado */}
            {(() => {
              console.log('🎯 Rendering completed state check:', { flowState, result, hasResult: !!result })
              return flowState === 'completed' && result && (
                <div className={`${result.approved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 text-center`}>
                  {result.approved ? (
                    <>
                      <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold text-green-800">¡Respuesta Aprobada!</p>
                      <p className="text-sm text-green-700 mb-2">
                        +{result.pointsEarned} puntos ganados
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="font-semibold text-red-800">Respuesta Rechazada</p>
                      <p className="text-sm text-red-700 mb-2">
                        No se otorgaron puntos
                      </p>
                    </>
                  )}
                  <div className="text-xs text-gray-600">
                    Votación: {result.approvedVotes} de {result.totalVotes} aprobaron
                  </div>
                  <p className="text-sm mt-2 text-gray-700">Pasando al siguiente turno...</p>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </>
  )
}
