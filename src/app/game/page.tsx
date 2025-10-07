'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useGameStore } from '@/store/gameStore'
import { useGameSocket } from '@/hooks/useGameSocket'
import { 
  GameBoard, 
  CardDisplay, 
  PlayerList, 
  ScoreBoard, 
  GameControls, 
  CategorySelector 
} from '@/components/game'
import { GameEndModal } from '@/components/game/GameEndModal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function GamePage() {
  const { currentPlayer } = useAuth()
  const { phase, currentCard, players, currentPlayerIndex } = useGameStore()
  const { gameRoom } = useGameSocket()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const isCurrentPlayerTurn = Boolean(
    currentPlayer && 
    players && 
    currentPlayerIndex !== undefined && 
    players[currentPlayerIndex] === currentPlayer.id
  )
  
  // Datos para el modal de fin de juego
  const isGameFinished = gameRoom?.currentPhase === 'FINISHED'
  const winner = gameRoom?.winner
  const finalScores = gameRoom?.finalScores || []
  
  // Debug para ver el estado del juego
  console.log('🎮 Game Page Debug:', {
    isGameFinished,
    winner,
    finalScores,
    currentPhase: gameRoom?.currentPhase,
    gameState: gameRoom?.gameState
  })

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Debes iniciar sesión para jugar</p>
            <Button asChild className="mt-4">
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Conectando+</h1>
            <p className="text-muted-foreground">
              {phase === 'lobby' ? 'Esperando jugadores...' :
               phase === 'explanation' ? 'Fase de Explicación' :
               phase === 'playing' ? 'Jugando' : 'Juego Terminado'}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Salir
            </Link>
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Panel Izquierdo - Información del Juego */}
          <div className="lg:col-span-1 space-y-4">
            <PlayerList 
              players={gameRoom?.players || []}
              currentPlayer={gameRoom?.players.find(p => p.id === currentPlayer?.id) || null}
              currentUserId={currentPlayer?.id || ''}
            />
            <ScoreBoard 
              players={gameRoom?.players || []}
              targetScore={gameRoom?.gameState?.targetScore || 20}
            />
            {phase === 'playing' && !currentCard && isCurrentPlayerTurn && (
              <CategorySelector 
                onSelectCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            )}
          </div>

          {/* Panel Central - Tablero y Carta */}
          <div className="lg:col-span-2 space-y-4">
            <GameBoard />
            {currentCard && (
              <CardDisplay 
                card={currentCard}
                isCurrentPlayerTurn={isCurrentPlayerTurn}
              />
            )}
          </div>

          {/* Panel Derecho - Controles */}
          <div className="lg:col-span-1">
            <GameControls 
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
        </div>

        {/* Modal de Fin de Juego */}
        {isGameFinished && winner && finalScores.length > 0 && (
          <GameEndModal
            isOpen={true}
            winner={winner}
            finalScores={finalScores}
            currentPlayerId={currentPlayer?.id || ''}
            onClose={() => {
              // El modal manejará la redirección
            }}
          />
        )}
      </div>
    </div>
  )
}
