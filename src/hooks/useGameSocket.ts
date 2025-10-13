'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'

// Tipos para el juego
interface Player {
  id: string
  name: string
  email: string
  score: number
  isConnected: boolean
  isCurrentTurn: boolean
  role?: 'PLAYER' | 'MODERATOR' | 'PLAYER_MODERATOR'
}

interface Card {
  id: string
  type: 'RC' | 'AC' | 'E' | 'CE'
  question: string
  options?: string[]
  points: number
  difficulty: string
}

interface GameState {
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED'
  phase: 'WAITING' | 'CARD_SELECTION' | 'ANSWERING' | 'SCORING' | 'FINISHED' | 'READING' | 'VOTING'
  currentPlayerId: string | null
  currentCard?: Card
  targetScore: number
  turnNumber: number
  round: number
  timeRemaining?: number
  isInDebate?: boolean
  currentAnswer?: {
    playerId: string
    playerName: string
    votes: Map<string, 'agree' | 'disagree'>
  }
  settings?: {
    maxPlayers: number
    targetScore?: number
    timeLimit?: number
    allowedCategories?: ('RC' | 'AC' | 'E' | 'CE')[]
  }
}

interface GameRoom {
  roomCode: string
  players: Player[]
  gameState: GameState
  currentPhase: 'WAITING' | 'EXPLANATION' | 'IN_PROGRESS' | 'FINISHED'
  currentTurn: number
  winner?: Player
  finalScores?: Player[]
  dailyRoomName?: string | null
  dailyRoomUrl?: string | null
}

export function useGameSocket() {
  const { socket, isConnected, emit, on, off } = useSocket()
  const [gameRoom, setGameRoom] = useState<GameRoom | null>(null)
  const [, setError] = useState<string | null>(null)

  // Funciones del juego
  const joinRoom = useCallback((playerId: string, playerName: string, roomCode: string) => {
    logger.log(`🔌 joinRoom called: socket=${!!socket}, isConnected=${isConnected}`)
    if (!socket) {
      logger.error('❌ No socket available')
      setError('No hay conexión con el servidor')
      return
    }
    logger.log(`📤 Emitting join-room: roomCode=${roomCode}, playerId=${playerId}, playerName=${playerName}`)
    emit('join-room', { roomCode, playerId, playerName })
  }, [socket, isConnected, emit])

  const startGame = useCallback((roomCode: string, playerId: string) => {
    logger.log(`🎮 Frontend enviando start-game: roomCode=${roomCode}, playerId=${playerId}`)
    emit('start-game', { roomCode, playerId })
  }, [emit])

  const drawCard = useCallback((roomCode: string, playerId: string, cardType: 'RC' | 'AC' | 'E' | 'CE') => {
    logger.log(`🃏 Frontend enviando draw-card: roomCode=${roomCode}, playerId=${playerId}, cardType=${cardType}`)
    emit('draw-card', { roomCode, playerId, cardType })
  }, [emit])

  const submitAnswer = useCallback((roomCode: string, playerId: string, answer: string, timeUsed: number) => {
    emit('submit-answer', { roomCode, playerId, answer, timeUsed })
  }, [emit])

  const nextTurn = useCallback((roomCode: string, playerId: string) => {
    emit('next-turn', { roomCode, playerId })
  }, [emit])

  const approveAnswer = useCallback((playerId: string, approved: boolean) => {
    logger.log('🗳️ Enviando voto:', { playerId, approved })
    if (!socket?.connected) {
      logger.error('❌ Socket no conectado, no se puede enviar voto')
      return
    }
    emit('approve-answer', { playerId, approved })
  }, [emit, socket])

  const cardRead = useCallback((playerId: string, cardId: string) => {
    emit('card-read', { playerId, cardId })
  }, [emit])

  const playerAnswered = useCallback((playerId: string, cardId: string) => {
    emit('player-answered', { playerId, cardId })
  }, [emit])

  const skipTurn = useCallback((roomCode: string, playerId: string) => {
    emit('skip-turn', { roomCode, playerId })
  }, [emit])

  const resolveDebate = useCallback((roomCode: string, moderatorId: string, grantPoints: boolean) => {
    emit('resolve-debate', { roomCode, moderatorId, grantPoints })
  }, [emit])

  const endGameModerator = useCallback((roomCode: string, moderatorId: string) => {
    emit('end-game-moderator', { roomCode, moderatorId })
  }, [emit])

  // Funciones de utilidad
  const isMyTurn = useCallback((playerId: string) => {
    const currentPlayerId = gameRoom?.gameState.currentPlayerId
    const result = currentPlayerId === playerId
    logger.log(`🎯 isMyTurn check: playerId=${playerId}, currentPlayerId=${currentPlayerId}, result=${result}`)
    return result
  }, [gameRoom])

  const getPlayerById = useCallback((playerId: string) => {
    return gameRoom?.players.find(p => p.id === playerId)
  }, [gameRoom])

  const isGameInProgress = useCallback(() => {
    return gameRoom?.gameState.status === 'IN_PROGRESS'
  }, [gameRoom])

  const isGameFinished = useCallback(() => {
    return gameRoom?.gameState.status === 'FINISHED'
  }, [gameRoom])

  // Event listeners
  useEffect(() => {
    if (!socket || !isConnected) return

    const handlePlayerJoined = (...args: unknown[]) => {
      const data = args[0] as {
        player: Player;
        players: Player[];
        gameState: GameState;
        roomCode: string;
        dailyRoomUrl?: string | null;
        dailyRoomName?: string | null;
      }
      logger.log('🎮 Jugador se unió:', data.player.name)
      logger.log('📹 Daily.co URL recibida:', data.dailyRoomUrl)
      setGameRoom({
        roomCode: data.roomCode,
        players: data.players,
        gameState: data.gameState,
        currentPhase: 'WAITING',
        currentTurn: 0,
        dailyRoomUrl: data.dailyRoomUrl || null,
        dailyRoomName: data.dailyRoomName || null
      })
      setError(null)
    }

    const handleGameStarted = (...args: unknown[]) => {
      const data = args[0] as { gameState: GameState; message: string }
      logger.log('🎮 Juego iniciado. Jugador actual:', data.gameState.currentPlayerId)
      logger.log('🎮 Data completa recibida:', JSON.stringify(data, null, 2))
      
      setGameRoom(prev => prev ? {
        ...prev,
        gameState: {
          ...prev.gameState,
          ...data.gameState,
          status: 'IN_PROGRESS'
        },
        currentPhase: 'IN_PROGRESS',
        currentTurn: prev.currentTurn + 1
      } : null)
      logger.log('🎮 Estado actualizado. CurrentPlayerId:', data.gameState.currentPlayerId)
    }

    const handleExplanationStarted = () => {
      logger.log('📚 Fase de explicaciones iniciada')
      setGameRoom(prev => prev ? {
        ...prev,
        currentPhase: 'EXPLANATION'
      } : null)
    }

    const handleCardDrawn = (...args: unknown[]) => {
      const data = args[0] as { card: Card; playerId: string; playerName: string }
      logger.log('🏏 Carta sacada:', data.card.type, 'por', data.playerName)
      
      setGameRoom(prev => prev ? {
        ...prev,
        gameState: {
          ...prev.gameState,
          currentCard: data.card
        }
      } : null)
    }

    const handleAnswerSubmitted = (...args: unknown[]) => {
      const data = args[0] as { playerId: string; answer: string; isCorrect: boolean; points: number }
      logger.log('📝 Respuesta enviada:', data.answer)
    }

    const handleAnswerApproved = (...args: unknown[]) => {
      const data = args[0] as { voterId: string; voterName: string; approved: boolean }
      logger.log('👍 Voto recibido:', data.voterName, data.approved ? 'aprobó' : 'rechazó')
    }

    const handleVotingCompleted = (...args: unknown[]) => {
      const data = args[0] as { 
        playerId: string; 
        playerName: string; 
        approved: boolean; 
        pointsEarned: number;
        approvedVotes: number;
        totalVotes: number;
        newScore: number;
        message: string;
      }
      logger.log('🏆 Votación completada:', data.playerName, data.approved ? `ganó ${data.pointsEarned} puntos` : 'no ganó puntos')
      
      // Mostrar notificación del resultado
      if (data.approved) {
        toast.success(`🎉 ${data.playerName} ganó ${data.pointsEarned} puntos!`, {
          description: `Votación: ${data.approvedVotes}/${data.totalVotes} aprobaron`,
          duration: 3000
        })
      } else {
        toast.error(`❌ Respuesta de ${data.playerName} fue rechazada`, {
          description: `Votación: ${data.approvedVotes}/${data.totalVotes} aprobaron`,
          duration: 3000
        })
      }
      
      // Actualizar puntos del jugador en el estado
      setGameRoom(prev => {
        if (!prev) return null
        
        const updatedPlayers = prev.players.map((player: Player) => 
          player.id === data.playerId 
            ? { ...player, score: data.newScore }
            : player
        )
        
        return {
          ...prev,
          players: updatedPlayers
        }
      })
    }

    const handleAnswerResult = (...args: unknown[]) => {
      const data = args[0] as { 
        playerId: string; 
        playerName: string; 
        approved: boolean; 
        pointsEarned: number;
        approvedVotes: number;
        totalVotes: number;
        newScore: number;
      }
      logger.log('🏆 Resultado:', data.playerName, data.approved ? `ganó ${data.pointsEarned} puntos` : 'no ganó puntos')
      
      // Actualizar puntuación del jugador en el estado local
      setGameRoom(prev => {
        if (!prev) return null
        const updatedPlayers = prev.players.map(player => 
          player.id === data.playerId 
            ? { ...player, score: data.newScore }
            : player
        )
        return { ...prev, players: updatedPlayers }
      })
    }

    const handlePhaseChanged = (...args: unknown[]) => {
      const data = args[0] as { 
        phase: 'WAITING' | 'EXPLANATION' | 'IN_PROGRESS' | 'VOTING' | 'FINISHED'; 
        gameId?: string;
        currentPlayerId?: string;
        message?: string;
      }
      logger.log('🔄 Fase cambiada a:', data.phase, data.message || '')
      
      setGameRoom(prev => {
        if (!prev) return null
        
        const updatedGameState = { ...prev.gameState }
        
        // Actualizar la fase directamente desde el backend
        if (data.phase) {
          updatedGameState.phase = data.phase as GameState['phase']
        }
        
        // Si hay currentPlayerId, actualizarlo
        if (data.currentPlayerId) {
          updatedGameState.currentPlayerId = data.currentPlayerId
        }
        
        return { 
          ...prev, 
          currentPhase: data.phase === 'VOTING' ? 'IN_PROGRESS' : data.phase,
          gameState: updatedGameState
        }
      })
    }

    const handleTurnChanged = (...args: unknown[]) => {
      const data = args[0] as { currentPlayerId: string; currentTurn: number; phase?: string }
      logger.log('🔄 Turno cambiado a:', data.currentPlayerId)
      
      setGameRoom(prev => {
        if (!prev) return null
        
        const updatedGameState = { ...prev.gameState }
        updatedGameState.currentPlayerId = data.currentPlayerId
        updatedGameState.currentCard = undefined // Limpiar carta actual
        
        if (data.phase) {
          updatedGameState.phase = data.phase as GameState['phase']
        }
        
        // Mostrar notificación de cambio de turno
        const nextPlayer = prev.players.find((p: Player) => p.id === data.currentPlayerId)
        if (nextPlayer) {
          toast.info(`🔄 Turno de ${nextPlayer.name}`, {
            description: `Turno #${data.currentTurn}`,
            duration: 2000
          })
        }
        
        return { 
          ...prev, 
          gameState: updatedGameState,
          currentTurn: data.currentTurn
        }
      })
    }

    const handleGameFinished = (...args: unknown[]) => {
      const data = args[0] as { winner: Player; finalScores: Player[] }
      logger.log('🏆 Juego terminado. Ganador:', data.winner.name)
      logger.log('🎯 Final scores:', data.finalScores)
      logger.log('🎮 Actualizando gameRoom con fase FINISHED')
      
      setGameRoom(prev => {
        if (!prev) return null
        
        const updated = {
          ...prev,
          currentPhase: 'FINISHED' as const,
          winner: data.winner,
          finalScores: data.finalScores,
          gameState: {
            ...prev.gameState,
            phase: 'FINISHED' as const
          }
        }
        
        logger.log('🎮 GameRoom actualizado:', updated)
        return updated
      })
    }

    const handleRedirectToDashboard = (...args: unknown[]) => {
      const data = args[0] as { message: string; delay: number }
      logger.log('🔄 Evento redirect-to-dashboard recibido (IGNORADO):', data.message)
      
      // NO redirigir automáticamente - el modal se encarga de esto
      toast.info('Juego terminado. Usa el botón del modal para salir.', {
        duration: 3000
      })
    }

    const handlePlayerLeft = (...args: unknown[]) => {
      const data = args[0] as { playerId: string; playerName: string }
      logger.log('👋 Jugador salió:', data.playerName)
    }

    const handlePlayerReconnected = (...args: unknown[]) => {
      const data = args[0] as { playerId: string; playerName: string }
      logger.log('🔄 Jugador reconectado:', data.playerName)
    }
    const handleGameError = (...args: unknown[]) => {
      const data = args[0] as { message: string }
      logger.error('Error del servidor:', data.message)
      setError(data.message)
      toast.error(data.message, { duration: 4000 })
      if (data.message.includes('ya terminó') || data.message.includes('no existe')) {
        setTimeout(() => {
          window.location.href = '/lobby'
        }, 2000)
      }
    }

    const handleAnswerTimerStarted = (...args: unknown[]) => {
      const data = args[0] as { playerId: string; playerName: string; timeLimit: number }
      logger.log(`⏱️ Timer iniciado para ${data.playerName}: ${data.timeLimit}s`)
      toast.info(`⏱️ ${data.playerName} tiene ${data.timeLimit} segundos para responder`)
    }

    const handleAnswerTimeout = (...args: unknown[]) => {
      const data = args[0] as { playerId: string; playerName: string; message: string }
      logger.log(`⏰ Tiempo agotado para ${data.playerName}`)
      toast.warning(`⏰ ${data.message} - ${data.playerName}`)
    }

    const handleTurnSkipped = (...args: unknown[]) => {
      const data = args[0] as { playerId: string; playerName: string; nextPlayerId: string; nextPlayerName: string }
      logger.log(`⏭️ ${data.playerName} pasó su turno`)
      toast.info(`⏭️ ${data.playerName} pasó su turno. Turno de ${data.nextPlayerName}`)
    }

    const handleDebateStarted = (...args: unknown[]) => {
      const data = args[0] as {
        playerId: string
        playerName: string
        agreeVotes: number
        disagreeVotes: number
        totalVotes: number
        votes: Array<{ playerId: string; playerName?: string; vote: 'agree' | 'disagree' }>
        message: string
      }
      logger.log(`🗣️ Debate iniciado para respuesta de ${data.playerName}`, data)
      toast.warning(`🗣️ Debate: ${data.message}`, { duration: 5000 })
      
      // Convertir array de votos a Map
      const votesMap = new Map<string, 'agree' | 'disagree'>()
      data.votes.forEach(vote => {
        votesMap.set(vote.playerId, vote.vote)
      })
      
      setGameRoom(prev => prev ? {
        ...prev,
        gameState: {
          ...prev.gameState,
          phase: 'VOTING',
          isInDebate: true,
          currentAnswer: {
            playerId: data.playerId,
            playerName: data.playerName,
            votes: votesMap
          }
        }
      } : null)
    }

    const handleDebateResolved = (...args: unknown[]) => {
      const data = args[0] as {
        moderatorId: string
        moderatorName: string
        playerId: string
        playerName: string
        pointsGranted: boolean
        pointsEarned: number
        newScore: number
        message: string
      }
      logger.log(`👨‍⚖️ Debate resuelto por ${data.moderatorName}: ${data.message}`)
      
      if (data.pointsGranted) {
        toast.success(`✅ ${data.message} - ${data.playerName} ganó ${data.pointsEarned} puntos`)
      } else {
        toast.error(`❌ ${data.message} - ${data.playerName} no ganó puntos`)
      }
      
      setGameRoom(prev => {
        if (!prev) return null
        return {
          ...prev,
          players: prev.players.map(p => 
            p.id === data.playerId ? { ...p, score: data.newScore } : p
          ),
          gameState: {
            ...prev.gameState,
            isInDebate: false
          }
        }
      })
    }

    const handleRoomUpdated = (data: unknown) => {
      logger.log('🔄 Sala actualizada:', data)
      const updateData = data as { currentPhase?: string; gameState?: { phase?: string } }
      
      setGameRoom(prev => {
        if (!prev) return null
        
        const updated = { ...prev, ...(data as object) }
        
        // Si la fase cambió a FINISHED, asegurar que se refleje correctamente
        if (updateData.currentPhase === 'FINISHED' || updateData.gameState?.phase === 'FINISHED') {
          logger.log('🏁 Juego terminado detectado en room-updated')
          updated.currentPhase = 'FINISHED'
          if (updated.gameState) {
            updated.gameState.phase = 'FINISHED'
          }
        }
        
        return updated
      })
    }

    // Registrar eventos
    on('player-joined', handlePlayerJoined)
    on('game-started', handleGameStarted)
    on('explanation-started', handleExplanationStarted)
    on('card-drawn', handleCardDrawn)
    on('answer-submitted', handleAnswerSubmitted)
    on('answer-approved', handleAnswerApproved)
    on('answer-result', handleAnswerResult)
    on('voting-completed', handleVotingCompleted)
    on('phase-changed', handlePhaseChanged)
    on('turn-ended', handleTurnChanged)
    on('game-ended', handleGameFinished)
    on('redirect-to-dashboard', handleRedirectToDashboard)
    on('room-updated', handleRoomUpdated)
    on('player-left', handlePlayerLeft)
    on('player-reconnected', handlePlayerReconnected)
    on('game-error', handleGameError)
    on('answer-timer-started', handleAnswerTimerStarted)
    on('answer-timeout', handleAnswerTimeout)
    on('turn-skipped', handleTurnSkipped)
    on('debate-started', handleDebateStarted)
    on('debate-resolved', handleDebateResolved)

    return () => {
      off('player-joined', handlePlayerJoined)
      off('game-started', handleGameStarted)
      off('explanation-started', handleExplanationStarted)
      off('card-drawn', handleCardDrawn)
      off('answer-submitted', handleAnswerSubmitted)
      off('answer-approved', handleAnswerApproved)
      off('answer-result', handleAnswerResult)
      off('voting-completed', handleVotingCompleted)
      off('phase-changed', handlePhaseChanged)
      off('turn-ended', handleTurnChanged)
      off('game-ended', handleGameFinished)
      off('redirect-to-dashboard', handleRedirectToDashboard)
      off('room-updated', handleRoomUpdated)
      off('player-left', handlePlayerLeft)
      off('player-reconnected', handlePlayerReconnected)
      off('game-error', handleGameError)
      off('answer-timer-started', handleAnswerTimerStarted)
      off('answer-timeout', handleAnswerTimeout)
      off('turn-skipped', handleTurnSkipped)
      off('debate-started', handleDebateStarted)
      off('debate-resolved', handleDebateResolved)
    }
  }, [socket, isConnected, on, off])

  return {
    gameRoom,
    joinRoom,
    startGame,
    drawCard,
    submitAnswer,
    nextTurn,
    approveAnswer,
    cardRead,
    playerAnswered,
    skipTurn,
    resolveDebate,
    endGameModerator,
    isMyTurn,
    getPlayerById,
    isGameInProgress,
    isGameFinished,
    on,
    off
  }
}
