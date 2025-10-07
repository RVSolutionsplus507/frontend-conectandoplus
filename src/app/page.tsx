'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { PlayerDashboard } from '@/components/player/PlayerDashboard'

export default function Home() {
  const { currentPlayer, isAuthenticated } = useAuth()

  if (!isAuthenticated || !currentPlayer) {
    return <LoginForm />
  }

  // Renderizar dashboard según el rol del usuario
  if (currentPlayer.role === 'ADMIN') {
    return <AdminDashboard player={currentPlayer} />
  }

  return <PlayerDashboard player={currentPlayer} />
}
