import { useState, useCallback } from 'react'
import { GameCard, CardType, GAME_CONFIG } from '@/data/cards'
import { useCards } from './useCards'

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

interface UseGameLogicReturn {
  // Estado del juego
  players: Player[]
  currentPhase: GamePhase
  currentCard: GameCard | null
  currentPlayerIndex: number
  round: number
  isFirstGame: boolean
  
  // Acciones del juego
  startGame: (playerList: Player[]) => void
  nextTurn: () => void
  selectCard: (type: CardType) => void
  submitAnswer: (playerId: string) => void
  scoreAnswer: (playerId: string, points: number) => void
  endGame: () => Player | null
  
  // Utilidades
  getCurrentPlayer: () => Player | null
  getWinner: () => Player | null
  isGameFinished: () => boolean
  canPlayerAnswer: (playerId: string) => boolean
  nextAfterExplanation: () => void
}

export function useGameLogic(): UseGameLogicReturn {
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPhase, setCurrentPhase] = useState<GamePhase>({ type: 'WAITING' })
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [isFirstGame, setIsFirstGame] = useState(true)
  const [hasShownExplanations, setHasShownExplanations] = useState(false)
  
  const { 
    currentCard, 
    drawCard, 
    drawExplanationCard, 
    resetCards 
  } = useCards()

  const startGame = useCallback((playerList: Player[]) => {
    if (playerList.length < GAME_CONFIG.MIN_PLAYERS) {
      throw new Error(`Se necesitan al menos ${GAME_CONFIG.MIN_PLAYERS} jugadores`)
    }
    
    setPlayers(playerList.map(p => ({ ...p, score: 0 })))
    setCurrentPlayerIndex(0)
    setRound(1)
    resetCards()
    
    // Si es la primera vez, mostrar explicaciones
    if (isFirstGame && !hasShownExplanations) {
      setCurrentPhase({ 
        type: 'EXPLANATION',
        currentPlayerId: playerList[0].id
      })
    } else {
      setCurrentPhase({ 
        type: 'CARD_SELECTION',
        currentPlayerId: playerList[0].id
      })
    }
  }, [isFirstGame, hasShownExplanations, resetCards])

  const nextTurn = useCallback(() => {
    setCurrentPlayerIndex(prev => {
      const nextIndex = (prev + 1) % players.length
      
      // Si completamos una ronda completa
      if (nextIndex === 0) {
        setRound(prev => prev + 1)
      }
      
      const nextPlayer = players[nextIndex]
      setCurrentPhase({
        type: 'CARD_SELECTION',
        currentPlayerId: nextPlayer.id
      })
      
      return nextIndex
    })
  }, [players])

  const selectCard = useCallback((type: CardType) => {
    if (currentPhase.type !== 'CARD_SELECTION') return
    
    // Si es la primera vez y estamos en explicaciones
    if (isFirstGame && !hasShownExplanations) {
      const explanationCard = drawExplanationCard(type)
      if (explanationCard) {
        setCurrentPhase({
          type: 'EXPLANATION',
          currentPlayerId: currentPhase.currentPlayerId
        })
        return
      }
    }
    
    // Robar carta normal
    drawCard(type)
    setCurrentPhase({
      type: 'ANSWERING',
      currentPlayerId: currentPhase.currentPlayerId,
      timeRemaining: 60 // 60 segundos para responder
    })
  }, [currentPhase, isFirstGame, hasShownExplanations, drawCard, drawExplanationCard])

  const submitAnswer = useCallback((playerId: string) => {
    if (currentPhase.type !== 'ANSWERING') return
    
    setCurrentPhase({
      type: 'SCORING',
      currentPlayerId: playerId
    })
  }, [currentPhase])

  const scoreAnswer = useCallback((playerId: string, points: number) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, score: player.score + points }
        : player
    ))
    
    // Verificar si alguien ganó
    const updatedPlayer = players.find(p => p.id === playerId)
    if (updatedPlayer && updatedPlayer.score + points >= GAME_CONFIG.TARGET_SCORE) {
      setCurrentPhase({ type: 'FINISHED' })
      return
    }
    
    // Continuar al siguiente turno
    nextTurn()
  }, [players, nextTurn])

  const getCurrentPlayer = useCallback((): Player | null => {
    return players[currentPlayerIndex] || null
  }, [players, currentPlayerIndex])

  const getWinner = useCallback((): Player | null => {
    const winner = players.find(p => p.score >= GAME_CONFIG.TARGET_SCORE)
    if (winner) return winner
    
    // Si el juego terminó sin alcanzar la meta, el de mayor puntuación
    if (currentPhase.type === 'FINISHED') {
      return players.reduce((prev, current) => 
        prev.score > current.score ? prev : current
      )
    }
    
    return null
  }, [players, currentPhase])

  const endGame = useCallback((): Player | null => {
    const winner = getWinner()
    setCurrentPhase({ type: 'FINISHED' })
    setIsFirstGame(false)
    return winner
  }, [getWinner])

  const isGameFinished = useCallback((): boolean => {
    return currentPhase.type === 'FINISHED' || 
           players.some(p => p.score >= GAME_CONFIG.TARGET_SCORE)
  }, [currentPhase, players])

  const canPlayerAnswer = useCallback((playerId: string): boolean => {
    return currentPhase.type === 'ANSWERING' && 
           currentPhase.currentPlayerId === playerId
  }, [currentPhase])

  // Completar explicaciones y pasar al juego normal
  const completeExplanations = useCallback(() => {
    setHasShownExplanations(true)
    setCurrentPhase({
      type: 'CARD_SELECTION',
      currentPlayerId: players[0]?.id
    })
  }, [players])

  // Función para avanzar después de mostrar explicación
  const nextAfterExplanation = useCallback(() => {
    if (hasShownExplanations) {
      nextTurn()
    } else {
      completeExplanations()
    }
  }, [hasShownExplanations, nextTurn, completeExplanations])

  return {
    // Estado
    players,
    currentPhase,
    currentCard,
    currentPlayerIndex,
    round,
    isFirstGame,
    
    // Acciones
    startGame,
    nextTurn,
    selectCard,
    submitAnswer,
    scoreAnswer,
    endGame,
    
    // Utilidades
    getCurrentPlayer,
    getWinner,
    isGameFinished,
    canPlayerAnswer,
    nextAfterExplanation
  }
}
