import { useState, useCallback } from 'react'
import { GameCard } from '@/data/cards'

interface ScoreEntry {
  playerId: string
  playerName: string
  cardId: string
  answer: string
  points: number
  timeUsed: number
  timestamp: Date
}

interface PlayerStats {
  playerId: string
  playerName: string
  totalScore: number
  cardsAnswered: number
  averageTime: number
  bestCategory: string
  correctAnswers: number
}

interface UseScoringReturn {
  // Estado
  scoreHistory: ScoreEntry[]
  playerStats: PlayerStats[]
  
  // Acciones
  addScore: (playerId: string, playerName: string, card: GameCard, answer: string, points: number, timeUsed: number) => void
  calculatePoints: (card: GameCard, answer: string, timeUsed: number) => number
  getPlayerScore: (playerId: string) => number
  getPlayerStats: (playerId: string) => PlayerStats | null
  resetScoring: () => void
  
  // Utilidades
  getLeaderboard: () => PlayerStats[]
  getTotalGameTime: () => number
  getAverageScore: () => number
}

export function useScoring(): UseScoringReturn {
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([])

  const addScore = useCallback((
    playerId: string, 
    playerName: string, 
    card: GameCard, 
    answer: string, 
    points: number, 
    timeUsed: number
  ) => {
    const newEntry: ScoreEntry = {
      playerId,
      playerName,
      cardId: card.id,
      answer,
      points,
      timeUsed,
      timestamp: new Date()
    }
    
    setScoreHistory(prev => [...prev, newEntry])
  }, [])

  const calculatePoints = useCallback((card: GameCard, answer: string, timeUsed: number): number => {
    if (!answer || answer.trim().length === 0) return 0
    
    let basePoints = card.points
    
    // Bonificación por tiempo (si responde en menos de 30 segundos)
    if (timeUsed < 30) {
      basePoints += 1
    }
    
    // Penalización por respuestas muy cortas (menos de 10 caracteres para respuestas abiertas)
    if (!card.options && answer.trim().length < 10) {
      basePoints = Math.max(1, basePoints - 1)
    }
    
    // Bonificación por respuestas detalladas (más de 50 caracteres para respuestas abiertas)
    if (!card.options && answer.trim().length > 50) {
      basePoints += 1
    }
    
    return Math.max(0, basePoints)
  }, [])

  const getPlayerScore = useCallback((playerId: string): number => {
    return scoreHistory
      .filter(entry => entry.playerId === playerId)
      .reduce((total, entry) => total + entry.points, 0)
  }, [scoreHistory])

  const getPlayerStats = useCallback((playerId: string): PlayerStats | null => {
    const playerEntries = scoreHistory.filter(entry => entry.playerId === playerId)
    
    if (playerEntries.length === 0) return null
    
    const totalScore = playerEntries.reduce((sum, entry) => sum + entry.points, 0)
    const totalTime = playerEntries.reduce((sum, entry) => sum + entry.timeUsed, 0)
    const correctAnswers = playerEntries.filter(entry => entry.points > 0).length
    
    // Calcular mejor categoría
    const categoryStats: Record<string, number> = {}
    playerEntries.forEach(entry => {
      const cardType = entry.cardId.substring(0, 2) // RC, AC, E, CE
      categoryStats[cardType] = (categoryStats[cardType] || 0) + entry.points
    })
    
    const bestCategory = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'RC'
    
    return {
      playerId,
      playerName: playerEntries[0].playerName,
      totalScore,
      cardsAnswered: playerEntries.length,
      averageTime: totalTime / playerEntries.length,
      bestCategory,
      correctAnswers
    }
  }, [scoreHistory])

  const resetScoring = useCallback(() => {
    setScoreHistory([])
  }, [])

  const getLeaderboard = useCallback((): PlayerStats[] => {
    const playerIds = [...new Set(scoreHistory.map(entry => entry.playerId))]
    
    return playerIds
      .map(playerId => getPlayerStats(playerId))
      .filter((stats): stats is PlayerStats => stats !== null)
      .sort((a, b) => b.totalScore - a.totalScore)
  }, [scoreHistory, getPlayerStats])

  const getTotalGameTime = useCallback((): number => {
    return scoreHistory.reduce((total, entry) => total + entry.timeUsed, 0)
  }, [scoreHistory])

  const getAverageScore = useCallback((): number => {
    if (scoreHistory.length === 0) return 0
    
    const totalPoints = scoreHistory.reduce((sum, entry) => sum + entry.points, 0)
    return totalPoints / scoreHistory.length
  }, [scoreHistory])

  // Calcular estadísticas de jugadores
  const playerStats = getLeaderboard()

  return {
    // Estado
    scoreHistory,
    playerStats,
    
    // Acciones
    addScore,
    calculatePoints,
    getPlayerScore,
    getPlayerStats,
    resetScoring,
    
    // Utilidades
    getLeaderboard,
    getTotalGameTime,
    getAverageScore
  }
}
