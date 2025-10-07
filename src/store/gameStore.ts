import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { GameState, GamePhase, Card, CardCategory } from '@/types/game'

interface GameStore extends GameState {
  // Actions
  setGamePhase: (phase: GamePhase) => void
  setCurrentCard: (card: Card | null) => void
  addPlayer: (playerId: string) => void
  removePlayer: (playerId: string) => void
  updateScore: (playerId: string, points: number) => void
  nextTurn: () => void
  drawCard: (category: CardCategory) => Card | null
  resetGame: () => void
  initializeGame: (gameData: Partial<GameState>) => void
  answerQuestion: (answer: string, isCorrect: boolean) => void
  skipCard: () => void
  startGame: () => void
  endGame: () => void
  shuffleCards: () => void
  playerScores: Record<string, number>
}

const initialState: GameState = {
  id: '',
  phase: 'lobby',
  currentPlayerIndex: 0,
  players: [],
  scores: {},
  currentCard: null,
  usedCards: [],
  cardPiles: {
    RC: [],
    AC: [],
    E: [],
    CE: []
  },
  settings: {
    maxPlayers: 8,
    targetScore: 50,
    timeLimit: 30
  },
  createdAt: new Date(),
  updatedAt: new Date()
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setGamePhase: (phase: GamePhase) => set(() => ({ phase, updatedAt: new Date() }), false, 'setGamePhase'),

      setCurrentCard: (card: Card | null) => set(() => ({ currentCard: card, updatedAt: new Date() }), false, 'setCurrentCard'),

      addPlayer: (playerId) =>
        set((state) => {
          if (state.players.includes(playerId)) return state
          return {
            players: [...state.players, playerId],
            scores: { ...state.scores, [playerId]: 0 },
            updatedAt: new Date()
          }
        }, false, 'addPlayer'),

      removePlayer: (playerId) =>
        set((state) => {
          const newScores = { ...state.scores }
          delete newScores[playerId]
          return {
            players: state.players.filter(id => id !== playerId),
            scores: newScores,
            updatedAt: new Date()
          }
        }, false, 'removePlayer'),

      updateScore: (playerId, points) =>
        set((state) => ({
          scores: {
            ...state.scores,
            [playerId]: (state.scores[playerId] || 0) + points
          },
          updatedAt: new Date()
        }), false, 'updateScore'),

      nextTurn: () =>
        set((state) => ({
          currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
          currentCard: null,
          updatedAt: new Date()
        }), false, 'nextTurn'),

      drawCard: (category) => {
        const state = get()
        const availableCards = state.cardPiles[category].filter(
          card => !state.usedCards.includes(card.id)
        )
        
        if (availableCards.length === 0) return null
        
        const randomIndex = Math.floor(Math.random() * availableCards.length)
        const drawnCard = availableCards[randomIndex]
        
        set((state) => ({
          currentCard: drawnCard,
          usedCards: [...state.usedCards, drawnCard.id],
          updatedAt: new Date()
        }), false, 'drawCard')
        
        return drawnCard
      },

      resetGame: () =>
        set(() => ({
          ...initialState,
          createdAt: new Date(),
          updatedAt: new Date()
        }), false, 'resetGame'),

      initializeGame: (gameData) =>
        set((state) => ({
          ...state,
          ...gameData,
          updatedAt: new Date()
        }), false, 'initializeGame'),

      answerQuestion: (answer, isCorrect) => {
        const state = get()
        if (isCorrect && state.currentCard) {
          const currentPlayerId = state.players[state.currentPlayerIndex]
          set((state) => ({
            scores: {
              ...state.scores,
              [currentPlayerId]: (state.scores[currentPlayerId] || 0) + (state.currentCard?.points || 0)
            },
            updatedAt: new Date()
          }), false, 'answerQuestion')
        }
      },

      skipCard: () => set(() => ({ currentCard: null, updatedAt: new Date() }), false, 'skipCard'),

      startGame: () => set(() => ({ phase: 'playing', updatedAt: new Date() }), false, 'startGame'),

      endGame: () => set(() => ({ phase: 'finished', updatedAt: new Date() }), false, 'endGame'),

      shuffleCards: () => {
        const state = get()
        const shuffledPiles = { ...state.cardPiles }
        Object.keys(shuffledPiles).forEach(category => {
          const pile = shuffledPiles[category as CardCategory]
          for (let i = pile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pile[i], pile[j]] = [pile[j], pile[i]]
          }
        })
        set(() => ({ cardPiles: shuffledPiles, updatedAt: new Date() }), false, 'shuffleCards')
      },

      get playerScores() {
        return get().scores
      }
    }),
    { name: 'game-store' }
  )
)
