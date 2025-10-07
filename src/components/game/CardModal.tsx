'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { CardImage } from './CardImage'

interface GameCard {
  id: string
  type: 'RC' | 'AC' | 'E' | 'CE'
  question: string
  options?: string[]
  points: number
  difficulty: string
  imageUrl?: string
  cardNumber?: number
}

interface Player {
  id: string
  name: string
  score: number
}

interface CardModalProps {
  card: GameCard
  currentPlayer: Player
  isMyTurn: boolean
  isOpen: boolean
  onClose: () => void
  onCardRead: () => void
}

export function CardModal({
  card,
  currentPlayer,
  isMyTurn,
  isOpen,
  onClose,
  onCardRead
}: CardModalProps) {


  const handleCardRead = () => {
    onCardRead()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative">
        {/* Botón cerrar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 p-0 bg-white/80 hover:bg-white"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Contenido de la Carta - Enfocado en legibilidad */}
        <div className="p-6">
          {/* Header con badges - Solo badges */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                {card.type}
              </Badge>
              <Badge variant="secondary">{card.points} puntos</Badge>
            </div>
          </div>

          {/* Imagen de la carta - Maximizada */}
          {card.imageUrl && (
            <div className="flex justify-center">
              <div className="w-full max-w-4xl h-[500px] rounded-lg shadow-md overflow-hidden">
                <CardImage 
                  imageUrl={card.imageUrl}
                  cardNumber={card.cardNumber}
                  category={card.type}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer con botón y estado */}
        <div className="bg-gray-50 px-6 py-3 border-t">
          {isMyTurn ? (
            <div className="flex justify-center">
              <Button 
                onClick={handleCardRead}
                className="px-6 py-2 text-sm font-semibold"
                size="sm"
              >
                ✅ Leído
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p className="text-sm">⏳ {currentPlayer?.name} está leyendo la carta</p>
              <p className="text-xs mt-1">Espera que termine para continuar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
