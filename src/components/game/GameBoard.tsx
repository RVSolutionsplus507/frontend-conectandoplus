'use client'

import { useGameStore } from '@/store/gameStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Trophy, Clock } from 'lucide-react'

export function GameBoard() {
  const { phase, players, settings, cardPiles } = useGameStore()

  const totalCards = Object.values(cardPiles).reduce((total, pile) => total + pile.length, 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tablero de Juego
          </span>
          <Badge variant={phase === 'playing' ? 'default' : 'secondary'}>
            {phase === 'lobby' ? 'Esperando' : 
             phase === 'explanation' ? 'Explicación' :
             phase === 'playing' ? 'Jugando' : 'Terminado'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información del Juego */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-1 text-primary" />
            <p className="text-sm font-medium">{players.length} Jugadores</p>
            <p className="text-xs text-muted-foreground">Máx: {settings.maxPlayers}</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Trophy className="h-6 w-6 mx-auto mb-1 text-primary" />
            <p className="text-sm font-medium">Meta: {settings.targetScore}</p>
            <p className="text-xs text-muted-foreground">Puntos</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Clock className="h-6 w-6 mx-auto mb-1 text-primary" />
            <p className="text-sm font-medium">{settings.timeLimit}s</p>
            <p className="text-xs text-muted-foreground">Por pregunta</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="h-6 w-6 mx-auto mb-1 bg-primary rounded text-white flex items-center justify-center text-sm font-bold">
              {totalCards}
            </div>
            <p className="text-sm font-medium">Cartas</p>
            <p className="text-xs text-muted-foreground">Restantes</p>
          </div>
        </div>

        {/* Pilas de Cartas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-20 h-28 mx-auto mb-2 bg-yellow-card rounded-lg border-2 border-yellow-600 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-800">RC</div>
                <div className="text-xs text-yellow-700">{cardPiles.RC.length}</div>
              </div>
            </div>
            <p className="text-xs font-medium text-yellow-800">Resolución de Conflictos</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-28 mx-auto mb-2 bg-pink-card rounded-lg border-2 border-pink-600 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-800">AC</div>
                <div className="text-xs text-pink-700">{cardPiles.AC.length}</div>
              </div>
            </div>
            <p className="text-xs font-medium text-pink-800">Autoconocimiento</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-28 mx-auto mb-2 bg-blue-card rounded-lg border-2 border-blue-600 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">E</div>
                <div className="text-xs text-blue-700">{cardPiles.E.length}</div>
              </div>
            </div>
            <p className="text-xs font-medium text-blue-800">Empatía</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-28 mx-auto mb-2 bg-green-card rounded-lg border-2 border-green-600 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">CE</div>
                <div className="text-xs text-green-700">{cardPiles.CE.length}</div>
              </div>
            </div>
            <p className="text-xs font-medium text-green-800">Comunicación Efectiva</p>
          </div>
        </div>

        {/* Instrucciones de Fase */}
        {phase === 'explanation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Fase de Explicación - Que es?</h4>
            <p className="text-sm text-blue-700">
              Cada jugador debe tomar una carta de cada pila para familiarizarse con las categorías. 
              No se otorgan puntos en esta fase.
            </p>
          </div>
        )}

        {phase === 'playing' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Fase de Juego</h4>
            <p className="text-sm text-green-700">
              Los jugadores eligen de qué pila sacar carta. Responde correctamente para ganar puntos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
