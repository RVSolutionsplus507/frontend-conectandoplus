'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useGameSocket } from '@/hooks/useGameSocket'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock, Users, Trophy, Home } from 'lucide-react'
import { CardAnswerFlow } from './CardAnswerFlow'
import { GameEndModal } from './GameEndModal'
import { CategoryModal } from './CategoryModal'
import { AnswerTimer } from './AnswerTimer'
import { PlayerActionButtons } from './PlayerActionButtons'
import { ModeratorPanel } from './ModeratorPanel'
import { DebatePanel } from './DebatePanel'
import { VideoCall } from './VideoCall'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'

interface GameRoomProps {
  roomCode: string
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



export function GameRoom({ roomCode }: GameRoomProps) {
  const { currentPlayer: user } = useAuth()
  const router = useRouter()
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<{
    code: string
    name: string
    description: string
    color: string
    image: string
  } | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [showTimeoutModal, setShowTimeoutModal] = useState(false)
  const [timeoutPlayerName, setTimeoutPlayerName] = useState('')
  const [isTimerActive, setIsTimerActive] = useState(false)

  // Información de categorías
  const categoryInfo = {
    RC: {
      code: 'RC',
      name: 'Resolución de Conflictos',
      description: 'Situaciones de conflicto con opciones múltiples y estrategias de resolución',
      color: 'bg-category-rc',
      image: '/categories/RC.png'
    },
    AC: {
      code: 'AC',
      name: 'Autoconocimiento',
      description: 'Preguntas de reflexión personal y completar frases de autoconocimiento',
      color: 'bg-category-ac',
      image: '/categories/AC.png'
    },
    E: {
      code: 'E',
      name: 'Empatía',
      description: 'Desarrollo de empatía y comprensión del otro, perspectivas diferentes',
      color: 'bg-category-e',
      image: '/categories/E.png'
    },
    CE: {
      code: 'CE',
      name: 'Comunicación Efectiva',
      description: 'Habilidades de comunicación y alternativas creativas',
      color: 'bg-category-ce',
      image: '/categories/CE.png'
    }
  }

  const openCategoryModal = (categoryType: 'RC' | 'AC' | 'E' | 'CE') => {
    setSelectedCategory(categoryInfo[categoryType])
    setIsCategoryModalOpen(true)
  }

  const {
    gameRoom,
    joinRoom,
    startGame,
    drawCard,
    nextTurn,
    approveAnswer,
    isMyTurn,
    isGameInProgress,
    on,
    off,
    playerAnswered,
    skipTurn,
    resolveDebate,
    endGameModerator
  } = useGameSocket()

  // Escuchar evento de timeout desde el socket
  useEffect(() => {
    const handleAnswerTimeout = (...args: unknown[]) => {
      const data = args[0] as { playerId: string; playerName: string; message: string }
      logger.log('⏰ Timeout recibido del servidor:', data)
      setTimeoutPlayerName(data.playerName)
      setShowTimeoutModal(true)
      setIsTimerActive(false)
      
      // Cerrar modal automáticamente después de 3 segundos
      setTimeout(() => {
        setShowTimeoutModal(false)
      }, 3000)
    }

    // Escuchar cuando se marca la carta como leída (para iniciar timer)
    const handleCardRead = () => {
      logger.log('📖 Carta marcada como leída - iniciando timer')
      setIsTimerActive(true)
    }

    on('answer-timeout', handleAnswerTimeout)
    on('card-read', handleCardRead)

    return () => {
      off('answer-timeout', handleAnswerTimeout)
      off('card-read', handleCardRead)
    }
  }, [on, off])

  // Unirse a la sala al cargar (solo una vez)
  useEffect(() => {
    if (user?.id && roomCode && !hasJoined) {
      logger.log('🎮 Attempting to join room:', roomCode)
      // Pequeño delay para asegurar que el socket esté conectado
      const timer = setTimeout(() => {
        logger.log('🎮 Joining room after delay:', roomCode)
        joinRoom(user.id, user.name || 'Jugador', roomCode)
        setHasJoined(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [user?.id, user?.name, roomCode, hasJoined, joinRoom])

  // Efecto para sacar carta automáticamente cuando es mi turno
  const drawRandomCard = useCallback(() => {
    if (user?.id && gameRoom) {
      logger.log('🎲 Drawing random card...')
      // Usar solo las categorías permitidas en esta partida
      const allowedCategories = gameRoom.gameState.settings?.allowedCategories || ['RC', 'AC', 'E', 'CE']
      const randomType = allowedCategories[Math.floor(Math.random() * allowedCategories.length)] as 'RC' | 'AC' | 'E' | 'CE'
      logger.log(`🎲 Categorías permitidas: ${allowedCategories.join(', ')}`)
      logger.log(`🎲 Categoría seleccionada: ${randomType}`)
      drawCard(roomCode, user.id, randomType)
    }
  }, [roomCode, user?.id, drawCard, gameRoom])

  useEffect(() => {
    if (isMyTurn(user?.id || '') && !currentCard && isGameInProgress() && gameRoom?.currentPhase !== 'FINISHED') {
      logger.log('🎯 Auto-drawing card: isMyTurn=true, currentCard=null, gameInProgress=true')
      // Agregar un pequeño delay para evitar llamadas duplicadas
      const timer = setTimeout(() => {
        drawRandomCard()
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isMyTurn, currentCard, isGameInProgress, user?.id, drawRandomCard, gameRoom?.currentPhase])

  // Escuchar cuando se saca una carta
  useEffect(() => {
    if (gameRoom?.gameState.currentCard) {
      logger.log('🃏 Card received:', gameRoom.gameState.currentCard)
      setCurrentCard(gameRoom.gameState.currentCard)
      // NO activar timer aquí - se activará cuando se dé click en "Leído"
    } else {
      setCurrentCard(null)
      setIsTimerActive(false) // Desactivar timer cuando no hay carta
    }
  }, [gameRoom?.gameState.currentCard])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso requerido</h2>
          <p className="text-gray-600 mb-4">Debes iniciar sesión para acceder al juego</p>
          <Button onClick={() => router.push('/auth/signin')}>Iniciar Sesión</Button>
        </div>
      </div>
    )
  }

  if (!gameRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-gray-600">Conectando a la sala...</p>
          <span className="sr-only">Cargando sala de juego, por favor espera</span>
        </div>
      </div>
    )
  }

  const currentUser = user
  const playersArray = gameRoom?.players ? Array.from(gameRoom.players.values()) : []
  const currentPlayer = playersArray.find(p => p.id === gameRoom?.gameState?.currentPlayerId)
  const isMyTurnValue = isMyTurn(currentUser?.id || '')

  const handleStartGame = () => {
    if (user?.id) {
      startGame(roomCode, user.id)
    }
  }

  const onApproveAnswer = (approved: boolean) => {
    if (user?.id) {
      approveAnswer(user.id, approved)
    }
  }

  const onNextTurn = () => {
    if (user?.id) {
      logger.log('🔄 Clearing current card before next turn')
      setCurrentCard(null) // Limpiar carta antes de cambiar turno
      nextTurn(roomCode, user.id)
    }
  }

  const isHost = playersArray[0]?.id === user?.id
  const canStartGame = isHost && gameRoom?.currentPhase === 'WAITING' && playersArray.length >= 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brand-blue-50)] to-[var(--brand-pink-100)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8" role="banner">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conectando+</h1>
            <p className="text-gray-600" aria-live="polite">Sala: {roomCode}</p>
          </div>
          <nav className="flex items-center gap-4" aria-label="Controles de partida">
            {canStartGame && (
              <Button
                onClick={handleStartGame}
                size="lg"
                className="btn-game-continue focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label={`Iniciar juego con ${playersArray.length} jugadores presentes`}
              >
                <Trophy className="h-4 w-4 mr-2" aria-hidden="true" />
                Iniciar Juego
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              aria-label="Salir de la sala y volver al inicio"
              className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Home className="h-4 w-4 mr-2" aria-hidden="true" />
              Salir
            </Button>
          </nav>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Área Principal del Juego */}
          <main className="lg:col-span-2 space-y-6" role="main" aria-label="Área de juego principal">
            {isGameInProgress() ? (
              <div className="space-y-6">
                {/* Información del Turno */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between" role="status" aria-live="polite" aria-atomic="true">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12" aria-hidden="true">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {currentPlayer?.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-lg">
                            {isMyTurnValue ? 'Tu turno' : `Turno de ${currentPlayer?.name}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            Ronda {gameRoom.gameState.round}
                          </p>
                        </div>
                      </div>
                      {isMyTurnValue && (
                        <Badge className="bg-green-600" aria-label="Es tu turno de jugar">
                          <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                          Tu turno
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Área de Carta */}
                {!currentCard && (
                  <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50" role="status" aria-live="polite">
                    {isMyTurnValue ? (
                      <div className="space-y-4">
                        <div className="text-6xl text-gray-400" aria-hidden="true">🎲</div>
                        <p className="text-lg font-medium">Sacando carta automáticamente...</p>
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" aria-label="Cargando carta"></div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl text-gray-400" aria-hidden="true">⏳</div>
                        <p className="text-gray-600">Esperando a {currentPlayer?.name}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Carta Actual con Flujo Completo */}
                {currentCard && currentPlayer && (
                  <CardAnswerFlow
                    card={currentCard}
                    currentPlayer={currentPlayer}
                    otherPlayers={playersArray.filter(p => p.id !== currentPlayer?.id)}
                    isMyTurn={isMyTurnValue}
                    gamePhase={gameRoom.gameState.phase}
                    onApproveAnswer={onApproveAnswer}
                    onNextTurn={onNextTurn}
                  />
                )}

                {/* Debug Info - Solo en desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-gray-100 p-2 rounded text-xs">
                    <p>Debug: currentCard={currentCard ? 'SÍ' : 'NO'}, isMyTurn={isMyTurnValue ? 'SÍ' : 'NO'}, gamePhase={gameRoom.gameState.phase}</p>
                    <p>Jugador actual: {currentPlayer?.name} (ID: {currentPlayer?.id})</p>
                    <p>Usuario: {currentUser.name} (ID: {currentUser.id})</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold mb-2">¡Sala lista!</h2>
                <p className="text-gray-600 mb-4">Esperando a que el anfitrión inicie el juego</p>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {playersArray.map((player) => (
                    <Badge key={player.id} variant="outline">
                      {player.name}
                    </Badge>
                  ))}
                </div>
                
                {/* Botones de Categorías */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-center mb-4">Conoce las Categorías de Cartas</h3>
                  <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" role="group" aria-label="Categorías de cartas del juego">
                    <Button
                      onClick={() => openCategoryModal('RC')}
                      className="bg-category-rc text-[var(--category-rc-foreground)] hover:opacity-90 px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105"
                      aria-label="Ver información de categoría Resolución de Conflictos"
                    >
                      <span aria-hidden="true">📋 </span>Resolución de Conflictos
                    </Button>
                    <Button
                      onClick={() => openCategoryModal('AC')}
                      className="bg-category-ac text-[var(--category-ac-foreground)] hover:opacity-90 px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105"
                      aria-label="Ver información de categoría Autoconocimiento"
                    >
                      <span aria-hidden="true">🧠 </span>Autoconocimiento
                    </Button>
                    <Button
                      onClick={() => openCategoryModal('E')}
                      className="bg-category-e text-[var(--category-e-foreground)] hover:opacity-90 px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105"
                      aria-label="Ver información de categoría Empatía"
                    >
                      <span aria-hidden="true">💝 </span>Empatía
                    </Button>
                    <Button
                      onClick={() => openCategoryModal('CE')}
                      className="bg-category-ce text-[var(--category-ce-foreground)] hover:opacity-90 px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105"
                      aria-label="Ver información de categoría Comunicación Efectiva"
                    >
                      <span aria-hidden="true">💬 </span>Comunicación Efectiva
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-4">
                    Lee las instrucciones de cada categoría antes de iniciar el juego
                  </p>
                </div>
              </div>
            )}
          </main>

          {/* Lista de Jugadores y Video Call */}
          <aside aria-label="Lista de jugadores y puntuaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" aria-hidden="true" />
                  Jugadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2" aria-label="Jugadores y sus puntuaciones">
                  {playersArray.map((player) => (
                    <li
                      key={player.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        player.id === currentPlayer?.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      aria-current={player.id === currentPlayer?.id ? 'true' : 'false'}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8" aria-hidden="true">
                          <AvatarFallback className={player.id === currentPlayer?.id ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'}>
                            {player.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          {player.id === currentPlayer?.id && (
                            <p className="text-sm text-blue-600">Turno actual</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right" aria-label={`${player.score} puntos`}>
                        <p className="font-bold text-lg">{player.score}</p>
                        <p className="text-sm text-gray-500" aria-hidden="true">puntos</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Video Call */}
            {gameRoom?.dailyRoomUrl ? (
              <VideoCall
                roomUrl={gameRoom.dailyRoomUrl}
                userName={user?.name || 'Jugador'}
                onLeave={() => {
                  logger.log('📹 Usuario salió de la videollamada')
                }}
              />
            ) : (
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    📹 Videollamada
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <p>Esta sala no tiene videollamada configurada.</p>
                  <p className="text-xs mt-2">Crea una nueva sala desde el panel de administrador para activar el video.</p>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>

      {/* Modal de Fin de Juego */}
      {gameRoom?.currentPhase === 'FINISHED' && gameRoom?.winner && gameRoom?.finalScores && (
        <GameEndModal
          isOpen={true}
          winner={gameRoom.winner}
          finalScores={gameRoom.finalScores}
          currentPlayerId={user?.id || ''}
          onClose={() => {
            // El modal manejará la redirección
          }}
        />
      )}

      {/* Modal de Categorías */}
      {selectedCategory && (
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          category={selectedCategory}
        />
      )}

      {/* Timer de Respuesta */}
      <AnswerTimer
        initialTime={60}
        isActive={isTimerActive && isMyTurnValue}
        onTimeout={() => {
          logger.log('⏰ Timer expirado en frontend')
          setIsTimerActive(false)
        }}
      />

      {/* Botones de Acción del Jugador - Ocultar durante debates */}
      {!gameRoom?.gameState.isInDebate && (
        <PlayerActionButtons
          isMyTurn={isMyTurnValue}
          hasCard={!!currentCard}
          onAnswered={() => {
            if (user?.id && currentCard?.id) {
              logger.log('✅ Jugador marcó que ya respondió')
              playerAnswered(user.id, currentCard.id)
              setIsTimerActive(false)
            }
          }}
          onSkipTurn={() => {
            if (user?.id) {
              logger.log('⏭️ Jugador pasó su turno')
              skipTurn(roomCode, user.id)
              setIsTimerActive(false)
              setCurrentCard(null)
            }
          }}
        />
      )}

      {/* Panel de Debate */}
      {gameRoom?.gameState.isInDebate && gameRoom?.gameState.currentAnswer && (() => {
        const votes = Array.from(gameRoom.gameState.currentAnswer.votes || new Map())
        const agreeVotes = votes.filter(([, vote]) => vote === 'agree').length
        const disagreeVotes = votes.filter(([, vote]) => vote === 'disagree').length
        
        // Verificar si el usuario actual es moderador
        const currentPlayer = playersArray.find(p => p.id === user?.id)
        const isModerator = currentPlayer?.role === 'MODERATOR' || currentPlayer?.role === 'PLAYER_MODERATOR'
        
        logger.log('🔍 DEBUG Debate Panel:', {
          userId: user?.id,
          currentPlayer,
          playerRole: currentPlayer?.role,
          isModerator,
          playersArray
        })
        
        return (
          <DebatePanel
            debateInfo={{
              playerId: gameRoom.gameState.currentAnswer.playerId,
              playerName: gameRoom.gameState.currentAnswer.playerName,
              agreeVotes,
              disagreeVotes,
              totalVotes: votes.length,
              votes: votes.map(([playerId, vote]) => ({
                playerId,
                playerName: playersArray.find(p => p.id === playerId)?.name || 'Jugador',
                vote
              }))
            }}
            isModerator={isModerator}
            onResolve={(approved) => {
              if (user?.id) {
                logger.log(`⚖️ Moderador resolvió debate: ${approved ? 'Aprobado' : 'Rechazado'}`)
                resolveDebate(roomCode, user.id, approved)
              }
            }}
          />
        )
      })()}

      {/* Panel de Moderador */}
      {(() => {
        const currentPlayerRole = playersArray.find(p => p.id === user?.id)?.role
        if (!currentPlayerRole || currentPlayerRole === 'PLAYER') return null
        
        return (
          <ModeratorPanel
            playerRole={currentPlayerRole}
            players={playersArray.map(p => ({
              id: p.id,
              name: p.name,
              score: p.score,
              isCurrentTurn: p.id === gameRoom?.gameState.currentPlayerId
            }))}
            onEndGame={() => {
              if (user?.id) {
                logger.log('🏁 Moderador finalizó el juego')
                endGameModerator(roomCode, user.id)
              }
            }}
          />
        )
      })()}

      {/* VotingButtons removido - ya está integrado en CardAnswerFlow */}

      {/* Modal de Timeout */}
      {showTimeoutModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-live="assertive"
          aria-labelledby="timeout-title"
          aria-describedby="timeout-description"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-orange-600" aria-hidden="true" />
              </div>
              <h3 id="timeout-title" className="text-2xl font-bold text-gray-900 mb-2">
                <span aria-hidden="true">⏰ </span>Tiempo Agotado
              </h3>
              <p id="timeout-description" className="text-gray-600 text-lg">
                {timeoutPlayerName} no respondió a tiempo
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Pasando al siguiente jugador...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
