'use client'

import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface VotingButtonsProps {
  onVote: (agree: boolean) => void
  canVote: boolean
  hasVoted: boolean
  playerName: string
}

export function VotingButtons({ onVote, canVote, hasVoted, playerName }: VotingButtonsProps) {
  if (!canVote) return null

  if (hasVoted) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white rounded-xl shadow-lg p-4 border-2 border-green-500">
        <p className="text-green-600 font-semibold flex items-center gap-2">
          <ThumbsUp className="w-5 h-5" />
          Voto registrado
        </p>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
      <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-200">
        <p className="text-center text-gray-700 font-semibold mb-4">
          ¿Estás de acuerdo con la respuesta de <span className="text-blue-600">{playerName}</span>?
        </p>
        
        <div className="flex gap-4">
          {/* Botón De Acuerdo */}
          <button
            onClick={() => onVote(true)}
            className="flex-1 flex flex-col items-center gap-2 px-8 py-6 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <ThumbsUp className="w-8 h-8" />
            <span className="text-lg">De Acuerdo</span>
          </button>

          {/* Botón En Desacuerdo */}
          <button
            onClick={() => onVote(false)}
            className="flex-1 flex flex-col items-center gap-2 px-8 py-6 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <ThumbsDown className="w-8 h-8" />
            <span className="text-lg">En Desacuerdo</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-3">
          Tu voto es importante para el juego
        </p>
      </div>
    </div>
  )
}
