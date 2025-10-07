'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardImage } from './CardImage'
import type { Card as GameCard } from '@/lib/schemas'

interface CardGalleryProps {
  cards: GameCard[]
  onCardSelect?: (card: GameCard) => void
  selectedCardId?: string
  showDetails?: boolean
}

export function CardGallery({ cards, onCardSelect, selectedCardId, showDetails = false }: CardGalleryProps) {
  const [filter, setFilter] = useState<string>('all')
  
  const categories = [
    { key: 'all', name: 'Todas', color: 'bg-gray-100' },
    { key: 'RC', name: 'Resolución de Conflictos', color: 'bg-yellow-100' },
    { key: 'AC', name: 'Autoconocimiento', color: 'bg-pink-100' },
    { key: 'E', name: 'Empatía', color: 'bg-blue-100' },
    { key: 'CE', name: 'Comunicación Efectiva', color: 'bg-green-100' }
  ]

  const filteredCards = filter === 'all' 
    ? cards 
    : cards.filter(card => card.category === filter)

  const sortedCards = filteredCards.sort((a, b) => (a.cardNumber || 0) - (b.cardNumber || 0))

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category.key}
            variant={filter === category.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category.key)}
            className={filter === category.key ? '' : category.color}
          >
            {category.name}
            <Badge variant="secondary" className="ml-2">
              {category.key === 'all' 
                ? cards.length 
                : cards.filter(card => card.category === category.key).length
              }
            </Badge>
          </Button>
        ))}
      </div>

      {/* Grid de cartas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedCards.map((card) => (
          <Card 
            key={card.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCardId === card.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onCardSelect?.(card)}
          >
            <CardContent className="p-3 space-y-2">
              <CardImage
                imageUrl={card.imageUrl}
                cardNumber={card.cardNumber}
                category={card.category}
                className="w-full h-24"
              />
              
              {showDetails && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {card.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {card.points}pts
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {card.question}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{card.difficulty}</span>
                    {card.cardNumber && <span>#{card.cardNumber}</span>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedCards.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No se encontraron cartas para esta categoría</p>
        </div>
      )}
    </div>
  )
}
