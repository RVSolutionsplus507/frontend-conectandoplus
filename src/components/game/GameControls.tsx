'use client'

import { useGameStore } from '@/store/gameStore'
import { useAuth } from '@/hooks/useAuth'
import { CardCategory } from '@/types/game'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Settings, 
  Users,
  Clock,
  Shuffle
} from 'lucide-react'

interface GameControlsProps {
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export function GameControls({ selectedCategory, onCategorySelect }: GameControlsProps) {
  const { currentPlayer } = useAuth()
  const { 
    phase, 
    currentPlayerIndex, 
    players, 
    drawCard, 
    nextTurn, 
    startGame,
    endGame,
    shuffleCards
  } = useGameStore()
  
  
  const isCurrentPlayerTurn = currentPlayer && players[currentPlayerIndex] === currentPlayer.id
  const canDrawCard = phase === 'playing' && isCurrentPlayerTurn && selectedCategory && !useGameStore.getState().currentCard

  const handleDrawCard = () => {
    if (canDrawCard && selectedCategory) {
      drawCard(selectedCategory as CardCategory)
      onCategorySelect(null)
    }
  }

  const handleNextTurn = () => {
    nextTurn()
  }

  const handleStartGame = () => {
    if (phase === 'lobby') {
      startGame()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Controles del Juego
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado del Juego */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <Badge variant={phase === 'playing' ? 'default' : 'secondary'}>
              {phase === 'lobby' ? 'Lobby' : 
               phase === 'explanation' ? 'Explicación' :
               phase === 'playing' ? 'Jugando' : 'Terminado'}
            </Badge>
          </div>
          
          {phase === 'playing' && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Turno:</span>
              <Badge variant={isCurrentPlayerTurn ? 'default' : 'outline'}>
                {isCurrentPlayerTurn ? 'Tu turno' : 'Esperando'}
              </Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* Controles Principales */}
        <div className="space-y-3">
          {phase === 'lobby' && (
            <Button 
              onClick={handleStartGame}
              className="w-full"
              disabled={players.length < 2}
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Juego
            </Button>
          )}

          {phase === 'playing' && isCurrentPlayerTurn && (
            <>
              <Button 
                onClick={handleDrawCard}
                disabled={!canDrawCard}
                className="w-full"
                variant={canDrawCard ? "default" : "secondary"}
              >
                <Shuffle className="h-4 w-4 mr-2" />
                {selectedCategory ? `Sacar carta ${selectedCategory}` : 'Selecciona categoría'}
              </Button>

              {useGameStore.getState().currentCard && (
                <Button 
                  onClick={handleNextTurn}
                  className="w-full"
                  variant="outline"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Siguiente Turno
                </Button>
              )}
            </>
          )}

          {phase === 'playing' && !isCurrentPlayerTurn && (
            <div className="bg-muted p-3 rounded-lg text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Esperando al jugador actual...
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Acciones Administrativas */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Acciones del Juego</h4>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => shuffleCards()}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Mezclar Cartas
          </Button>

          {phase === 'playing' && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full"
              onClick={() => endGame()}
            >
              <Pause className="h-4 w-4 mr-2" />
              Terminar Juego
            </Button>
          )}
        </div>

        <Separator />

        {/* Información del Juego */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Información</h4>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted p-2 rounded text-center">
              <Users className="h-4 w-4 mx-auto mb-1" />
              <span>{players.length} jugadores</span>
            </div>
            <div className="bg-muted p-2 rounded text-center">
              <Clock className="h-4 w-4 mx-auto mb-1" />
              <span>Turno {currentPlayerIndex + 1}</span>
            </div>
          </div>
        </div>

        {/* Ayuda Rápida */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="text-xs font-semibold text-blue-800 mb-1">💡 Ayuda Rápida</h5>
          <ul className="text-xs text-blue-700 space-y-1">
            {phase === 'explanation' && (
              <li>• Fase de explicación: Familiarízate con las categorías</li>
            )}
            {phase === 'playing' && (
              <>
                <li>• Elige una categoría de carta</li>
                <li>• Responde la pregunta correctamente</li>
                <li>• Gana puntos según la dificultad</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
