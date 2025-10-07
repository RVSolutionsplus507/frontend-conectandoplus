'use client'

import { useAuth } from '@/hooks/useAuth'
import { useGamesQuery, useJoinGameMutation } from '@/hooks/useGameQueries'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Play, Gamepad2, Trophy, Clock, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LobbyPage() {
  const { currentPlayer } = useAuth()
  const { data: games, isLoading } = useGamesQuery()
  const joinGameMutation = useJoinGameMutation()

  const handleJoinGame = async (gameId: string, roomCode: string) => {
    try {
      await joinGameMutation.mutateAsync(gameId)
      // Navegar a la sala de juego
      window.location.href = `/game/${roomCode}`
    } catch (error) {
      console.error('Error joining game:', error)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-8 relative overflow-hidden">
      {/* Hero Background Pattern - Inspired by image 65.png */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-pink-300 to-blue-500 transform rotate-12 scale-150"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-tl from-green-400 via-blue-300 to-purple-500 transform -rotate-12 scale-150"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-xl border border-white/30">
          <div className="absolute inset-0 bg-[url('/logo/fondo3.png')] bg-cover bg-center opacity-40"></div>
          <div className="relative px-6 py-12">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: 'oklch(0.3 0.1 220)' }}>
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Volver al Dashboard</span>
              </Link>
            </div>
            <div className="text-center">
              <div className="mb-6">
                <Gamepad2 className="h-16 w-16 mx-auto mb-4" style={{ color: 'oklch(0.55 0.15 220)' }} />
              </div>
              <h1 className="text-4xl font-bold mb-4" style={{ color: 'oklch(0.3 0.1 220)' }}>
                Mis Partidas - Conectando+
              </h1>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'oklch(0.4 0.05 220)' }}>
                Aquí están las partidas que el administrador ha creado para ti
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Partidas Asignadas */}
        <div className="relative max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3" style={{ color: 'oklch(0.3 0.1 220)' }}>
              <Play className="h-6 w-6" style={{ color: 'oklch(0.65 0.12 160)' }} />
              Partidas Asignadas
            </h2>
            <p style={{ color: 'oklch(0.4 0.05 220)' }}>Partidas creadas especialmente para ti por el administrador</p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'oklch(0.55 0.15 220)' }}></div>
              <p className="text-lg" style={{ color: 'oklch(0.3 0.1 220)' }}>Cargando tus partidas...</p>
            </div>
          ) : assignedGames.length > 0 ? (
            <div className="grid gap-6">
              {assignedGames.map((game) => (
                <Card key={game.id} className={`backdrop-blur-sm border-white/30 transition-all duration-300 shadow-lg ${
                  (game.status === 'FINISHED' || game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED') 
                    ? 'bg-gray-100/60 hover:bg-gray-100/70' 
                    : 'bg-white/80 hover:bg-white/90'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {(() => {
                          const isFinished = game.status === 'FINISHED' || game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED'
                          const winner = game.players.find(p => p.score >= (game.targetScore || 20))
                          const iWon = winner?.name === currentPlayer?.name
                          
                          return (
                            <div className="p-3 rounded-lg" style={{ 
                              backgroundColor: isFinished 
                                ? (iWon ? 'oklch(0.8 0.15 85 / 0.1)' : 'oklch(0.5 0.02 220 / 0.1)')
                                : game.status === 'WAITING' 
                                ? 'oklch(0.65 0.12 160 / 0.1)' 
                                : 'oklch(0.55 0.15 220 / 0.1)' 
                            }}>
                              {isFinished ? 
                                <Trophy className="h-6 w-6" style={{ 
                                  color: iWon ? 'oklch(0.8 0.15 85)' : 'oklch(0.5 0.02 220)' 
                                }} /> :
                                game.status === 'WAITING' ? 
                                <Play className="h-6 w-6" style={{ color: 'oklch(0.65 0.12 160)' }} /> : 
                                <Users className="h-6 w-6" style={{ color: 'oklch(0.55 0.15 220)' }} />
                              }
                            </div>
                          )
                        })()}
                        <div>
                          <CardTitle className="text-xl" style={{ color: 'oklch(0.3 0.1 220)' }}>
                            Sala {game.roomCode}
                          </CardTitle>
                          <p className="text-sm" style={{ color: 'oklch(0.4 0.05 220)' }}>
                            {(game.status === 'FINISHED' || game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED') ? 
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
                        className="border"
                        style={{
                          backgroundColor: game.status === 'WAITING' 
                            ? 'oklch(0.65 0.12 160 / 0.1)' 
                            : game.status === 'IN_PROGRESS'
                            ? 'oklch(0.55 0.15 220 / 0.1)'
                            : game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED'
                            ? 'oklch(0.5 0.05 220 / 0.05)'
                            : 'oklch(0.5 0.05 220 / 0.1)',
                          color: game.status === 'WAITING' 
                            ? 'oklch(0.65 0.12 160)' 
                            : game.status === 'IN_PROGRESS'
                            ? 'oklch(0.55 0.15 220)'
                            : game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED'
                            ? 'oklch(0.4 0.02 220)'
                            : 'oklch(0.5 0.05 220)',
                          borderColor: game.status === 'WAITING' 
                            ? 'oklch(0.65 0.12 160 / 0.3)' 
                            : game.status === 'IN_PROGRESS'
                            ? 'oklch(0.55 0.15 220 / 0.3)'
                            : game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED'
                            ? 'oklch(0.4 0.02 220 / 0.2)'
                            : 'oklch(0.5 0.05 220 / 0.3)'
                        }}
                      >
                        {game.status === 'WAITING' ? 'Esperando' : 
                         game.status === 'IN_PROGRESS' ? 'En Progreso' : 
                         game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED' ? 'Terminada' : 'Terminada'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6" style={{ color: 'oklch(0.4 0.05 220)' }}>
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
                        disabled={
                          game.status === 'FINISHED' ||
                          game.isFinished ||
                          game.phase === 'COMPLETED' ||
                          game.phase === 'FINISHED' ||
                          joinGameMutation.isPending
                        }
                        className="text-white border-0 transition-all duration-300 font-semibold hover:shadow-lg"
                        style={{
                          backgroundColor: (game.status === 'FINISHED' || game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED')
                            ? 'oklch(0.45 0.02 220)'
                            : game.status === 'IN_PROGRESS'
                            ? 'oklch(0.65 0.12 160)'
                            : 'oklch(0.55 0.15 220)',
                          cursor: (game.status === 'FINISHED' || game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED') ? 'not-allowed' : 'pointer',
                          opacity: (game.status === 'FINISHED' || game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED') ? 0.6 : 1
                        }}
                      >
                        {(game.status === 'FINISHED' || game.isFinished || game.phase === 'COMPLETED' || game.phase === 'FINISHED') ? 'Partida Jugada' :
                         game.status === 'IN_PROGRESS' ? 'Continuar' : 'Unirse'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30">
              <div className="mb-6">
                <Gamepad2 className="h-16 w-16 mx-auto mb-4" style={{ color: 'oklch(0.5 0.05 220)' }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.3 0.1 220)' }}>No tienes partidas asignadas</h3>
              <p className="mb-6" style={{ color: 'oklch(0.4 0.05 220)' }}>
                El administrador aún no ha creado ninguna partida para ti.
              </p>
              <p className="text-sm" style={{ color: 'oklch(0.5 0.05 220)' }}>
                Contacta al administrador para que te asigne a una partida.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
