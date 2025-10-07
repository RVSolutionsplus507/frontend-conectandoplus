'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGameStore } from '@/store/gameStore'

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void
  selectedCategory: string | null
}

export function CategorySelector({ onSelectCategory, selectedCategory }: CategorySelectorProps) {
  const { cardPiles } = useGameStore()

  const categories = [
    {
      id: 'RC',
      name: 'Resolución de Conflictos',
      description: 'Situaciones de conflicto y estrategias de resolución',
      color: 'bg-yellow-card border-yellow-600 text-yellow-800 hover:bg-yellow-200',
      count: cardPiles.RC.length
    },
    {
      id: 'AC',
      name: 'Autoconocimiento',
      description: 'Preguntas de reflexión personal y autoconocimiento',
      color: 'bg-pink-card border-pink-600 text-pink-800 hover:bg-pink-200',
      count: cardPiles.AC.length
    },
    {
      id: 'E',
      name: 'Empatía',
      description: 'Desarrollo de empatía y comprensión del otro',
      color: 'bg-blue-card border-blue-600 text-blue-800 hover:bg-blue-200',
      count: cardPiles.E.length
    },
    {
      id: 'CE',
      name: 'Comunicación Efectiva',
      description: 'Habilidades de comunicación y alternativas creativas',
      color: 'bg-green-card border-green-600 text-green-800 hover:bg-green-200',
      count: cardPiles.CE.length
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elige una Categoría</CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecciona de qué pila quieres sacar una carta
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`w-full h-auto p-4 justify-start ${
              selectedCategory === category.id ? '' : category.color
            }`}
            onClick={() => onSelectCategory(category.id)}
            disabled={category.count === 0}
          >
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">{category.id}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <p className="text-xs opacity-80">{category.description}</p>
              </div>
              <div className="text-right">
                <Badge 
                  variant={category.count > 0 ? "secondary" : "destructive"}
                  className="bg-white/80"
                >
                  {category.count} cartas
                </Badge>
              </div>
            </div>
          </Button>
        ))}
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            💡 <strong>Estrategia:</strong> Elige categorías donde te sientes más cómodo 
            o desafíate con categorías más difíciles para obtener más puntos.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
