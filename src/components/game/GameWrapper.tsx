'use client'

import { useEffect, useState } from 'react'
import { GameRoom } from './GameRoom'

interface Player {
  id: string
  name: string
  email: string
  score: number
  isConnected: boolean
  isCurrentTurn: boolean
}

interface Card {
  id: string
  type: 'RC' | 'AC' | 'E' | 'CE'
  question: string
  options?: string[]
  points: number
  difficulty: string
  imageUrl?: string
  cardNumber?: number
}

interface GameState {
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED'
  phase: 'WAITING' | 'CARD_SELECTION' | 'ANSWERING' | 'SCORING' | 'FINISHED'
  currentPlayerId: string | null
  currentCard?: Card
  targetScore: number
  turnNumber: number
  round: number
  timeRemaining?: number
}

interface GameRoom {
  players: Player[]
  gameState: GameState
  currentPhase: 'WAITING' | 'EXPLANATION' | 'IN_PROGRESS' | 'FINISHED'
  currentTurn: number
}

interface User {
  id: string
  name: string
  email: string
}

interface GameWrapperProps {
  roomCode: string
  gameRoom: GameRoom | null
  currentUser: User
  currentPlayer: Player | null
  isMyTurn: boolean
  isGameInProgress: boolean
  isGameFinished: boolean
  onStartGame: () => void
  onDrawCard: (cardType: 'RC' | 'AC' | 'E' | 'CE') => void
  onSubmitAnswer: (answer: string, timeUsed: number) => void
  onApproveAnswer: (approved: boolean) => void
  onNextTurn: () => void
}

export function GameWrapper(props: GameWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 w-8 h-8"></div>
      </div>
    )
  }

  if (!props.gameRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 w-8 h-8"></div>
      </div>
    )
  }

  return <GameRoom {...props} gameRoom={props.gameRoom} />
}
