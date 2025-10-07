'use client'

import { Check, SkipForward } from 'lucide-react'
import { useState } from 'react'

interface PlayerActionButtonsProps {
  onAnswered: () => void
  onSkipTurn: () => void
  isMyTurn: boolean
  hasCard: boolean
}

export function PlayerActionButtons({
  onAnswered,
  onSkipTurn,
  isMyTurn,
  hasCard
}: PlayerActionButtonsProps) {
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)

  if (!isMyTurn || !hasCard) return null

  const handleSkip = () => {
    setShowSkipConfirm(false)
    onSkipTurn()
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        {/* Botón Pasar Turno */}
        <button
          onClick={() => setShowSkipConfirm(true)}
          className="flex items-center gap-2 px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <SkipForward className="w-5 h-5" />
          Pasar Turno
        </button>

        {/* Botón Ya Respondí */}
        <button
          onClick={onAnswered}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 animate-pulse"
        >
          <Check className="w-6 h-6" />
          Ya Respondí
        </button>
      </div>

      {/* Modal de confirmación para pasar turno */}
      {showSkipConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SkipForward className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Pasar tu turno?
              </h3>
              <p className="text-gray-600">
                No ganarás puntos en esta ronda y el turno pasará al siguiente jugador.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-colors"
              >
                Sí, Pasar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
