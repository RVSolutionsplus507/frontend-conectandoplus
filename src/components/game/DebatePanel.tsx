'use client'

import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react'
import type { DebateInfo } from '@/types/game'

interface DebatePanelProps {
  debateInfo: DebateInfo
  isModerator: boolean
  onResolve?: (grantPoints: boolean) => void
}

export function DebatePanel({ debateInfo, isModerator, onResolve }: DebatePanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 rounded-full">
            <MessageSquare className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Debate en Curso</h2>
            <p className="text-sm text-gray-600">
              Respuesta de <span className="font-semibold">{debateInfo.playerName}</span>
            </p>
          </div>
        </div>

        {/* Resultados de votación */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ThumbsUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">De acuerdo</p>
                <p className="text-2xl font-bold text-green-600">{debateInfo.agreeVotes}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ThumbsDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En desacuerdo</p>
                <p className="text-2xl font-bold text-red-600">{debateInfo.disagreeVotes}</p>
              </div>
            </div>
          </div>

          {/* Lista de votos */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase">Votos individuales</p>
            <div className="grid grid-cols-2 gap-2">
              {debateInfo.votes.map((vote) => (
                <div
                  key={vote.playerId}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    vote.vote === 'agree' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {vote.vote === 'agree' ? (
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {vote.playerName || 'Jugador'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mensaje para jugadores */}
        {!isModerator && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-blue-800 font-medium">
              🗣️ Los jugadores están debatiendo...
            </p>
            <p className="text-sm text-blue-600 mt-1">
              El moderador decidirá si se otorgan los puntos
            </p>
          </div>
        )}

        {/* Botones de moderador */}
        {isModerator && onResolve && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center font-medium mb-4">
              👨‍⚖️ Como moderador, decide el resultado del debate:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onResolve(true)}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <ThumbsUp className="w-5 h-5" />
                Otorgar Puntos
              </button>
              <button
                onClick={() => onResolve(false)}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <ThumbsDown className="w-5 h-5" />
                No Otorgar Puntos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
