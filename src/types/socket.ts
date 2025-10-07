export interface SocketEvents {
  // Game events
  'game:create': (data: { name: string; maxPlayers: number; isPrivate: boolean }) => void
  'game:join': (data: { gameId: string; playerId: string }) => void
  'game:leave': (data: { gameId: string; playerId: string }) => void
  'game:start': (data: { gameId: string }) => void
  'game:end': (data: { gameId: string }) => void
  
  // Player events
  'player:ready': (data: { gameId: string; playerId: string; isReady: boolean }) => void
  'player:joined': (data: { gameId: string; player: { id: string; name: string; avatar?: string } }) => void
  'player:left': (data: { gameId: string; playerId: string }) => void
  
  // Card events
  'card:draw': (data: { gameId: string; playerId: string; category: string }) => void
  'card:drawn': (data: { gameId: string; card: { id: string; category: string; question: string; options?: string[]; points: number } }) => void
  'card:answer': (data: { gameId: string; playerId: string; answer: number; timeSpent: number }) => void
  'card:answered': (data: { gameId: string; playerId: string; isCorrect: boolean; points: number }) => void
  
  // Turn events
  'turn:next': (data: { gameId: string; nextPlayerId: string }) => void
  'turn:timeout': (data: { gameId: string; playerId: string }) => void
  
  // Score events
  'score:update': (data: { gameId: string; scores: Record<string, number> }) => void
  
  // Room events
  'room:list': () => void
  'room:updated': (data: { rooms: Array<{ id: string; name: string; players: string[]; maxPlayers: number; status: string }> }) => void
  
  // Error events
  'error': (data: { message: string; code?: string }) => void
  'disconnect': () => void
  'connect': () => void
}

export type ServerToClientEvents = SocketEvents
export type ClientToServerEvents = SocketEvents
