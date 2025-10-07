'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Crown, User } from 'lucide-react'

interface Player {
  id: string
  name: string
  score: number
  isConnected: boolean
}

interface PlayerListProps {
  players: Player[]
  currentPlayer: Player | null | undefined
  currentUserId: string
}

export function PlayerList({ players, currentPlayer, currentUserId }: PlayerListProps) {

  const getPlayerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Jugadores ({players.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {players.map((player) => {
          const isCurrentPlayerTurn = currentPlayer?.id === player.id
          const isMe = currentUserId === player.id
          
          return (
            <div
              key={player.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                isCurrentPlayerTurn 
                  ? 'bg-primary/10 border-primary' 
                  : 'bg-muted border-muted'
              }`}
            >
              <Avatar className={`h-10 w-10 ${isCurrentPlayerTurn ? 'ring-2 ring-primary' : ''}`}>
                <AvatarFallback className={isMe ? 'bg-primary text-primary-foreground' : ''}>
                  {getPlayerInitials(player.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{player.name}</span>
                  {isMe && (
                    <Badge variant="outline" className="text-xs">
                      Tú
                    </Badge>
                  )}
                  {isCurrentPlayerTurn && (
                    <Crown className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {player.score} puntos
                </p>
              </div>
              
              {isCurrentPlayerTurn && (
                <Badge className="bg-primary">
                  Turno
                </Badge>
              )}
            </div>
          )
        })}
        
        {players.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>No hay jugadores en el juego</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
