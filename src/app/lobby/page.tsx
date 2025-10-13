'use client'

import { useAuth } from '@/hooks/useAuth'
import { useGamesQuery, useJoinGameMutation } from '@/hooks/useGameQueries'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Play, Gamepad2, Trophy, Clock, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { logger } from '@/lib/logger'
import { GameResponse } from '@/lib/api'

export default function LobbyPage() {
  const { currentPlayer } = useAuth()
  const { data: games, isLoading } = useGamesQuery()
  const joinGameMutation = useJoinGameMutation()

  // Helper para verificar si un juego está terminado
  const isGameFinished = (game: GameResponse) => {
    return game.status === 'FINISHED' || game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED'
  }

  const handleJoinGame = async (gameId: string, roomCode: string) => {
    try {
      await joinGameMutation.mutateAsync(gameId)
      // Navegar a la sala de juego
      window.location.href = `/game/${roomCode}`
    } catch (error) {
      logger.error('Error joining game:', error)
    }
  }

  // Verificar que games sea un array antes de filtrar
  const gamesArray = Array.isArray(games) ? games : []
  
  // Filtrar solo partidas asignadas al usuario actual
  const assignedGames = gamesArray.filter(game => {
    const isAssigned = game.players.some(p => {
      return p.name === currentPlayer?.name // Comparar por nombre en lugar de ID
    })
    return isAssigned
  }) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-3 sm:p-4 md:p-8 relative overflow-hidden">
      {/* Hero Background Pattern - Inspired by image 65.png - Responsive */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-hero-top transform rotate-12 scale-150"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-hero-bottom transform -rotate-12 scale-150"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-hero-center rounded-full opacity-20"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-xl border border-white/30">
          <div className="absolute inset-0 bg-[url('/logo/fondo3.png')] bg-cover bg-center opacity-40"></div>
          <div className="relative px-6 py-12">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="flex items-center gap-2 text-game-primary transition-colors hover:opacity-80">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Volver al Dashboard</span>
              </Link>
            </div>
            <div className="text-center">
              <div className="mb-6">
                <Gamepad2 className="h-16 w-16 mx-auto mb-4 icon-game-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4 text-game-primary">
                Mis Partidas - Conectando+
              </h1>
              <p className="text-lg max-w-2xl mx-auto text-game-secondary">
                Aquí están las partidas que el administrador ha creado para ti
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Partidas Asignadas */}
        <div className="relative max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-game-primary">
              <Play className="h-6 w-6 icon-game-success" />
              Partidas Asignadas
            </h2>
            <p className="text-game-secondary">Partidas creadas especialmente para ti por el administrador</p>
          </div>

          {isLoading ? (
            <div className="text-center py-16" role="status" aria-live="polite">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 spinner-game mx-auto mb-4" aria-hidden="true"></div>
              <p className="text-lg text-game-primary">Cargando tus partidas...</p>
              <span className="sr-only">Cargando lista de partidas disponibles, por favor espera</span>
            </div>
          ) : assignedGames.length > 0 ? (
            <div className="grid gap-6">
              {assignedGames.map((game) => (
                <Card key={game.id} className={`backdrop-blur-sm border-white/30 transition-all duration-300 shadow-lg ${
                  isGameFinished(game)
                    ? 'bg-gray-100/60 hover:bg-gray-100/70'
                    : 'bg-white/80 hover:bg-white/90'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {(() => {
                          const finished = isGameFinished(game)
                          const winner = game.players.find(p => p.score >= (game.targetScore || 20))
                          const iWon = winner?.name === currentPlayer?.name

                          return (
                            <div className={`p-3 rounded-lg ${
                              finished
                                ? (iWon ? 'bg-winner-badge' : 'bg-loser-badge')
                                : game.status === 'WAITING'
                                ? 'bg-game-waiting'
                                : 'bg-game-in-progress'
                            }`}>
                              {finished ?
                                <Trophy className={`h-6 w-6 ${iWon ? 'text-winner' : 'text-loser'}`} aria-hidden="true" /> :
                                game.status === 'WAITING' ?
                                <Play className="h-6 w-6 icon-game-success" aria-hidden="true" /> :
                                <Users className="h-6 w-6 icon-game-primary" aria-hidden="true" />
                              }
                            </div>
                          )
                        })()}
                        <div>
                          <CardTitle className="text-xl text-game-primary">
                            Sala {game.roomCode}
                          </CardTitle>
                          <p className="text-sm text-game-secondary">
                            {isGameFinished(game) ?
                              (() => {
                                const winner = game.players.find(p => p.score >= (game.targetScore || 20))
                                const myPlayer = game.players.find(p => p.name === currentPlayer?.name)
                                const iWon = winner?.name === currentPlayer?.name

                                return iWon
                                  ? `🎉 ¡Ganaste! - Tu puntuación: ${myPlayer?.score || 0} puntos`
                                  : winner
                                  ? `Ganador: ${winner.name} (${winner.score} puntos) - Tu puntuación: ${myPlayer?.score || 0} puntos`
                                  : `Partida terminada - Tu puntuación: ${myPlayer?.score || 0} puntos`
                              })() :
                              `Host: ${game.players.find(p => p.isHost)?.name || 'Administrador'}`
                            }
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={game.status === 'WAITING' ? 'default' : 'secondary'}
                        className={`border ${
                          game.status === 'WAITING'
                            ? 'bg-game-waiting text-game-success border-game-waiting'
                            : game.status === 'IN_PROGRESS'
                            ? 'bg-game-in-progress text-game-primary border-game-in-progress'
                            : isGameFinished(game)
                            ? 'bg-game-finished text-game-muted border-game-finished'
                            : 'bg-game-finished text-game-muted border-game-finished'
                        }`}
                      >
                        {game.status === 'WAITING' ? 'Esperando' :
                         game.status === 'IN_PROGRESS' ? 'En Progreso' :
                         isGameFinished(game) ? 'Terminada' : 'Terminada'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-game-secondary">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{game.players.length}/8 jugadores</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Puntuación objetivo: {game.targetScore || 20} puntos</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleJoinGame(game.id, game.roomCode)}
                        disabled={isGameFinished(game) || joinGameMutation.isPending}
                        className={`font-semibold focus:ring-2 focus:ring-offset-2 ${
                          isGameFinished(game)
                            ? 'btn-game-disabled'
                            : game.status === 'IN_PROGRESS'
                            ? 'btn-game-continue focus:ring-green-500'
                            : 'btn-game-primary focus:ring-blue-500'
                        }`}
                        aria-label={
                          isGameFinished(game)
                            ? `Partida ${game.roomCode} finalizada`
                            : game.status === 'IN_PROGRESS'
                            ? `Continuar partida ${game.roomCode} en progreso`
                            : `Unirse a partida ${game.roomCode}`
                        }
                      >
                        {isGameFinished(game) ? 'Partida Jugada' :
                         game.status === 'IN_PROGRESS' ? 'Continuar' : 'Unirse'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card-lobby rounded-3xl border border-white/30">
              <div className="mb-6">
                <Gamepad2 className="h-16 w-16 mx-auto mb-4 icon-game-muted" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-game-primary">No tienes partidas asignadas</h3>
              <p className="mb-6 text-game-secondary">
                El administrador aún no ha creado ninguna partida para ti.
              </p>
              <p className="text-sm text-game-muted">
                Contacta al administrador para que te asigne a una partida.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
