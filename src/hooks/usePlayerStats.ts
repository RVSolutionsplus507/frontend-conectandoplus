'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

interface PlayerStats {
  gamesPlayed: number
  gamesWon: number
  totalScore: number
  averageScore: number
}

export function usePlayerStats() {
  const { currentPlayer } = useAuth()
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlayerStats = async (playerId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/players/${playerId}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas')
      }

      const data = await response.json()
      console.log('📊 Stats response:', data)
      setStats(data.data || data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching player stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentPlayer?.id && currentPlayer.role !== 'ADMIN') {
      console.log('🔍 Fetching stats for player:', currentPlayer.id, currentPlayer.name)
      fetchPlayerStats(currentPlayer.id)
    }
  }, [currentPlayer])

  return {
    stats,
    loading,
    error,
    refetch: () => {
      if (currentPlayer?.id) {
        fetchPlayerStats(currentPlayer.id)
      }
    }
  }
}
