'use client'

import { useState } from 'react'
import { Target, CheckSquare, Square, Shield, User } from 'lucide-react'
import type { CardCategory } from '@/types/game'

interface GameConfigFormProps {
  onSubmit: (config: GameConfig) => void
  isAdmin: boolean
}

export interface GameConfig {
  targetScore: number
  allowedCategories: CardCategory[]
  playerRole?: 'PLAYER' | 'MODERATOR' | 'PLAYER_MODERATOR'
}

const CATEGORIES = [
  { id: 'RC' as CardCategory, name: 'Resolución de Conflictos', color: 'bg-yellow-400', icon: '💛' },
  { id: 'AC' as CardCategory, name: 'Autoconocimiento', color: 'bg-pink-400', icon: '💗' },
  { id: 'E' as CardCategory, name: 'Empatía', color: 'bg-blue-400', icon: '💙' },
  { id: 'CE' as CardCategory, name: 'Comunicación Efectiva', color: 'bg-green-400', icon: '💚' }
]

export function GameConfigForm({ onSubmit, isAdmin }: GameConfigFormProps) {
  const [targetScore, setTargetScore] = useState(20)
  const [selectedCategories, setSelectedCategories] = useState<CardCategory[]>(['RC', 'AC', 'E', 'CE'])
  const [playerRole, setPlayerRole] = useState<'PLAYER' | 'MODERATOR' | 'PLAYER_MODERATOR'>('PLAYER')

  const toggleCategory = (categoryId: CardCategory) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const selectAll = () => {
    setSelectedCategories(['RC', 'AC', 'E', 'CE'])
  }

  const deselectAll = () => {
    setSelectedCategories([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedCategories.length === 0) {
      alert('Debes seleccionar al menos una categoría')
      return
    }

    onSubmit({
      targetScore,
      allowedCategories: selectedCategories,
      playerRole: isAdmin ? playerRole : 'PLAYER'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Puntuación Objetivo */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Puntuación Objetivo</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Meta de puntos:</span>
            <span className="text-3xl font-bold text-blue-600">{targetScore}</span>
          </div>
          
          <input
            type="range"
            min="5"
            max="20"
            value={targetScore}
            onChange={(e) => setTargetScore(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>5 puntos</span>
            <span>20 puntos</span>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Categorías del Juego</h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors"
            >
              Todas
            </button>
            <button
              type="button"
              onClick={deselectAll}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Ninguna
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id)
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? `${category.color} border-gray-900 shadow-lg scale-105`
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                {isSelected ? (
                  <CheckSquare className="w-6 h-6 text-gray-900" />
                ) : (
                  <Square className="w-6 h-6 text-gray-400" />
                )}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                      {category.name}
                    </span>
                  </div>
                  <span className={`text-xs ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                    ({category.id})
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {selectedCategories.length === 0 && (
          <p className="text-red-600 text-sm mt-3 font-medium">
            ⚠️ Debes seleccionar al menos una categoría
          </p>
        )}
      </div>

      {/* Rol de Jugador (solo para admins) */}
      {isAdmin && (
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg border-2 border-purple-300">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Rol en el Juego</h3>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setPlayerRole('PLAYER_MODERATOR')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                playerRole === 'PLAYER_MODERATOR'
                  ? 'bg-purple-600 border-purple-700 text-white shadow-lg'
                  : 'bg-white border-purple-200 text-gray-700 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Jugador y Moderador</p>
                <p className="text-xs opacity-80">Juega y modera debates</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPlayerRole('MODERATOR')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                playerRole === 'MODERATOR'
                  ? 'bg-purple-600 border-purple-700 text-white shadow-lg'
                  : 'bg-white border-purple-200 text-gray-700 hover:border-purple-300'
              }`}
            >
              <Shield className="w-5 h-5" />
              <div className="flex-1 text-left">
                <p className="font-semibold">Solo Moderador</p>
                <p className="text-xs opacity-80">Observa y modera, no juega</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={selectedCategories.length === 0}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        Crear Sala de Juego
      </button>
    </form>
  )
}
