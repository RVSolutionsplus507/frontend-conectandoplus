import { useState, useCallback } from 'react'
import { 
  GameCard, 
  CardType, 
  getCardsByType, 
  getRandomCard, 
  getExplanationCard,
  getCardById 
} from '@/data/cards'

interface UseCardsReturn {
  currentCard: GameCard | null
  usedCards: string[]
  drawCard: (type?: CardType) => GameCard
  drawExplanationCard: (type: CardType) => GameCard | null
  resetCards: () => void
  isCardUsed: (cardId: string) => boolean
  getRemainingCards: (type?: CardType) => number
}

export function useCards(): UseCardsReturn {
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null)
  const [usedCards, setUsedCards] = useState<string[]>([])

  const drawCard = useCallback((type?: CardType): GameCard => {
    const availableCards = type 
      ? getCardsByType(type).filter(card => !usedCards.includes(card.id) && !card.id.startsWith('EXP_'))
      : getCardsByType('RC').concat(getCardsByType('AC'), getCardsByType('E'), getCardsByType('CE'))
          .filter(card => !usedCards.includes(card.id) && !card.id.startsWith('EXP_'))

    if (availableCards.length === 0) {
      // Si no hay cartas disponibles, reiniciar el mazo
      setUsedCards([])
      const card = getRandomCard(type)
      setCurrentCard(card)
      setUsedCards([card.id])
      return card
    }

    const randomIndex = Math.floor(Math.random() * availableCards.length)
    const selectedCard = availableCards[randomIndex]
    
    setCurrentCard(selectedCard)
    setUsedCards(prev => [...prev, selectedCard.id])
    
    return selectedCard
  }, [usedCards])

  const drawExplanationCard = useCallback((type: CardType): GameCard | null => {
    const explanationCard = getExplanationCard(type)
    if (explanationCard) {
      setCurrentCard(explanationCard)
      return explanationCard
    }
    return null
  }, [])

  const resetCards = useCallback(() => {
    setUsedCards([])
    setCurrentCard(null)
  }, [])

  const isCardUsed = useCallback((cardId: string): boolean => {
    return usedCards.includes(cardId)
  }, [usedCards])

  const getRemainingCards = useCallback((type?: CardType): number => {
    const totalCards = type 
      ? getCardsByType(type).filter(card => !card.id.startsWith('EXP_'))
      : getCardsByType('RC').concat(getCardsByType('AC'), getCardsByType('E'), getCardsByType('CE'))
          .filter(card => !card.id.startsWith('EXP_'))
    
    return totalCards.length - usedCards.filter(id => {
      const card = getCardById(id)
      return card && (type ? card.type === type : true) && !card.id.startsWith('EXP_')
    }).length
  }, [usedCards])

  return {
    currentCard,
    usedCards,
    drawCard,
    drawExplanationCard,
    resetCards,
    isCardUsed,
    getRemainingCards
  }
}
