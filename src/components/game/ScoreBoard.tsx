'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Target, TrendingUp } from 'lucide-react'

interface Player {
  id: string
  name: string
  score: number
  isConnected: boolean
}

interface ScoreBoardProps {
  players: Player[]
  targetScore: number
}

export function ScoreBoard({ players, targetScore }: ScoreBoardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const leader = sortedPlayers[0]
  const maxScore = Math.max(...players.map(p => p.score), targetScore)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Puntuaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Meta del Juego */}
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <Target className="h-4 w-4" />
              Meta del Juego
            </span>
            <Badge variant="outline">{targetScore} puntos</Badge>
          </div>
          {leader && (
            <Progress 
              value={(leader.score / targetScore) * 100} 
              className="h-2"
            />
          )}
        </div>

        {/* Lista de Puntuaciones */}
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => {
            const isLeader = index === 0 && player.score > 0
            const progressPercentage = maxScore > 0 ? (player.score / maxScore) * 100 : 0
            
            return (
              <div
                key={player.id}
                className={`p-3 rounded-lg border ${
                  isLeader ? 'bg-yellow-50 border-yellow-200' : 'bg-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      isLeader ? 'text-yellow-700' : 'text-muted-foreground'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="font-medium">{player.name}</span>
                    {isLeader && <Crown className="h-4 w-4 text-yellow-600" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={isLeader ? "default" : "secondary"}
                      className={isLeader ? "bg-yellow-600" : ""}
                    >
                      {player.score} pts
                    </Badge>
                  </div>
                </div>
                
                {/* Barra de Progreso Individual */}
                <div className="space-y-1">
                  <Progress 
                    value={progressPercentage} 
                    className="h-1.5"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progreso hacia la meta</span>
                    <span>{Math.round((player.score / targetScore) * 100)}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {sortedPlayers.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Las puntuaciones aparecerán aquí</p>
          </div>
        )}

        {/* Estadísticas del Juego */}
        {sortedPlayers.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-primary">{leader?.score || 0}</p>
                <p className="text-xs text-muted-foreground">Puntuación Líder</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">
                  {Math.round(players.reduce((sum, player) => sum + player.score, 0) / players.length) || 0}
                </p>
                <p className="text-xs text-muted-foreground">Promedio</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Crown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M5 2a1 1 0 000 2h1.586l4.707 4.707C8.414 8.914 7.414 9 6.414 9H4a1 1 0 100 2h2.414l1.293 1.293a1 1 0 001.414 0L10.414 11H13a1 1 0 100-2h-2.586L15.121 4.293a1 1 0 00-1.414-1.414L10 6.586 6.293 2.879A1 1 0 005 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}
