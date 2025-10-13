'use client'

import { Shield, StopCircle, Eye } from 'lucide-react'
import { useState } from 'react'

interface ModeratorPanelProps {
  playerRole: 'PLAYER' | 'MODERATOR' | 'PLAYER_MODERATOR'
  onEndGame: () => void
  players: Array<{
    id: string
    name: string
    score: number
    isCurrentTurn: boolean
  }>
}

export function ModeratorPanel({ playerRole, onEndGame, players }: ModeratorPanelProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const isModerator = playerRole === 'MODERATOR' || playerRole === 'PLAYER_MODERATOR'

  if (!isModerator) return null

  const handleEndGame = () => {
    setShowConfirm(false)
    onEndGame()
  }

  return (
    <>
      {/* Panel flotante */}
      <div className="fixed bottom-4 left-4 z-30 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-2xl p-4 min-w-[280px] border-2 border-purple-400">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-purple-400">
          <Shield className="w-5 h-5 text-yellow-300" />
          <span className="font-bold text-white">Panel de Moderación</span>
        </div>

        {/* Vista de jugadores */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-purple-200" />
            <span className="text-xs font-semibold text-purple-200 uppercase">
              Estado del Juego
            </span>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    player.isCurrentTurn
                      ? 'bg-yellow-400/20 border border-yellow-400'
                      : 'bg-purple-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {player.isCurrentTurn && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                    <span className="text-sm font-medium text-white">
                      {player.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-yellow-300">
                    {player.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botón finalizar partida */}
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <StopCircle className="w-5 h-5" />
          Finalizar Partida
        </button>

        <p className="text-xs text-purple-200 text-center mt-2">
          Solo visible para moderadores
        </p>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StopCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Finalizar Partida?
              </h3>
              <p className="text-gray-600">
                Esta acción terminará el juego inmediatamente. El ganador será el jugador con más puntos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEndGame}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
              >
                Sí, Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
