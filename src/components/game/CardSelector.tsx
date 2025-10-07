'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'
import { CardImage } from './CardImage'

interface CardCategory {
  type: 'RC' | 'AC' | 'E' | 'CE'
  name: string
  color: string
  icon: LucideIcon
}

interface CardSelectorProps {
  categories: CardCategory[]
  onSelectCard: (cardType: 'RC' | 'AC' | 'E' | 'CE') => void
  disabled?: boolean
}

export function CardSelector({ categories, onSelectCard, disabled = false }: CardSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Elige una categoría de carta</CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecciona el tipo de carta que quieres sacar
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {categories.map((category) => {
            return (
              <Button
                key={category.type}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !disabled && onSelectCard(category.type)}
                disabled={disabled}
              >
                <CardImage
                  category={category.type}
                  className="w-16 h-12"
                />
                <div className="text-center">
                  <p className="font-semibold text-sm">{category.name}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {category.type}
                  </Badge>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
