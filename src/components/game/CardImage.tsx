'use client'

import Image from 'next/image'
import { useState } from 'react'

interface CardImageProps {
  imageUrl?: string
  cardNumber?: number
  category: string
  className?: string
  alt?: string
}

export function CardImage({ imageUrl, cardNumber, category, className = '', alt }: CardImageProps) {
  const [imageError, setImageError] = useState(false)
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'RC': return 'bg-yellow-100 border-yellow-300'
      case 'AC': return 'bg-pink-100 border-pink-300'
      case 'E': return 'bg-blue-100 border-blue-300'
      case 'CE': return 'bg-green-100 border-green-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'RC': return '⚖️'
      case 'AC': return '🧠'
      case 'E': return '❤️'
      case 'CE': return '💬'
      default: return '🃏'
    }
  }

  if (!imageUrl || imageError) {
    return (
      <div className={`flex items-center justify-center ${getCategoryColor(category)} border-2 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <div className="text-4xl mb-2">{getCategoryIcon(category)}</div>
          <div className="text-sm font-medium text-gray-600">
            {category}
            {cardNumber && <div className="text-xs">#{cardNumber}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-lg border-2 ${getCategoryColor(category)} ${className}`}>
      <Image
        src={imageUrl}
        alt={alt || `Carta ${category} ${cardNumber || ''}`}
        fill
        className="object-contain"
        onError={() => setImageError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {cardNumber && (
        <div className="absolute top-2 right-2 bg-white/90 text-xs font-bold px-2 py-1 rounded">
          #{cardNumber}
        </div>
      )}
    </div>
  )
}
