'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { GameRoom } from '@/components/game/GameRoom'

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const { currentPlayer: user } = useAuth()
  const roomCode = params.roomCode as string
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redireccionar si no hay usuario autenticado
  useEffect(() => {
    if (isMounted && !user) {
      router.push('/auth/login')
    }
  }, [user, router, isMounted])

  // Mostrar loading hasta que el componente esté montado
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 w-8 h-8"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 w-8 h-8"></div>
      </div>
    )
  }

  return <GameRoom roomCode={roomCode} />
}
