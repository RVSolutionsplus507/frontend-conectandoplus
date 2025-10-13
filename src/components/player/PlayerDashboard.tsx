'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/badge'
import { Trophy, Users, TrendingUp, User, LogOut, BookOpen, Star } from 'lucide-react'
import { Player } from '@/types/player'
import Link from 'next/link'
import Image from 'next/image'

interface PlayerDashboardProps {
  player: Player
}

export function PlayerDashboard({ player }: PlayerDashboardProps) {
  const { logout } = useAuth()
  const [imageError, setImageError] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-8 relative overflow-hidden">
      {/* Hero Background Pattern - Inspired by image 65.png */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-hero-top transform rotate-12 scale-150"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-hero-bottom transform -rotate-12 scale-150"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-hero-center rounded-full opacity-20"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-xl border border-white/30">
        <div className="absolute inset-0 bg-[url('/logo/fondo3.png')] bg-cover bg-center opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                {!imageError && player.avatar ? (
                  <Image
                    src={player.avatar}
                    alt={`Avatar de ${player.name}`}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full border-4 shadow-lg border-[oklch(0.55_0.15_220)] object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 shadow-lg border-[oklch(0.55_0.15_220)] bg-gradient-to-br from-[var(--brand-blue-400)] to-[var(--brand-green-400)] flex items-center justify-center">
                    <User className="w-12 h-12 text-white" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2">
                  <Badge className="px-3 py-1 text-sm text-white bg-[oklch(0.65_0.12_160)]">
                    Activo
                  </Badge>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 text-game-primary">
                  ¡Hola, {player.name}!
                </h1>
                <p className="text-xl text-game-muted">
                  Bienvenido de vuelta a Conectando+
                </p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 text-white bg-[oklch(0.55_0.15_10)] rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:opacity-90"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas del Jugador */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-game-primary">
          Tus Estadísticas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Partidas Jugadas */}
          <div className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 bg-[oklch(0.99_0.005_220)] border border-[oklch(0.9_0.02_220)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-game-in-progress">
                <Users className="w-8 h-8 icon-game-primary" />
              </div>
              <span className="text-3xl font-bold text-[oklch(0.55_0.15_220)]">
                {player.stats?.gamesPlayed || 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-game-primary">
              Partidas Jugadas
            </h3>
            <p className="text-sm text-game-muted">
              Total de partidas completadas
            </p>
          </div>

          {/* Victorias */}
          <div className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 bg-[oklch(0.99_0.005_160)] border border-[oklch(0.9_0.02_160)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-game-waiting">
                <Trophy className="w-8 h-8 icon-game-success" />
              </div>
              <span className="text-3xl font-bold text-[oklch(0.65_0.12_160)]">
                {player.stats?.gamesWon || 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-game-primary">
              Victorias
            </h3>
            <p className="text-sm text-game-muted">
              Partidas ganadas
            </p>
          </div>

          {/* Puntuación Total */}
          <div className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 bg-[oklch(0.99_0.005_340)] border border-[oklch(0.9_0.02_340)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-[oklch(0.85_0.08_340_/_0.1)]">
                <Star className="w-8 h-8 text-[oklch(0.85_0.08_340)]" />
              </div>
              <span className="text-3xl font-bold text-[oklch(0.85_0.08_340)]">
                {player.stats?.totalScore || 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-game-primary">
              Puntuación Total
            </h3>
            <p className="text-sm text-game-muted">
              Puntos acumulados
            </p>
          </div>

          {/* Promedio */}
          <div className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 bg-[oklch(0.99_0.005_85)] border border-[oklch(0.9_0.02_85)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-winner-badge">
                <TrendingUp className="w-8 h-8 text-winner" />
              </div>
              <span className="text-3xl font-bold text-winner">
                {player.stats?.gamesPlayed ? Math.round((player.stats.totalScore || 0) / player.stats.gamesPlayed) : 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-game-primary">
              Promedio
            </h3>
            <p className="text-sm text-game-muted">
              Puntos por partida
            </p>
          </div>
        </div>

        {/* Acciones del Juego */}
        <h2 className="text-3xl font-bold mb-8 text-center text-game-primary">
          Acciones del Juego
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto relative">
          {/* Unirse a Partida */}
          <Link href="/lobby" className="block">
            <div className="rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-[oklch(0.99_0.005_160)] border border-[oklch(0.9_0.02_160)]">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 bg-game-waiting">
                  <Trophy className="w-6 h-6 icon-game-success" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-game-primary">
                  Unirse a Partida
                </h3>
                <p className="text-sm mb-3 text-game-muted">
                  Únete a una partida existente
                </p>
              </div>
            </div>
          </Link>

          {/* Ver Perfil */}
          <Link href="/profile" className="block">
            <div className="rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-[oklch(0.99_0.005_340)] border border-[oklch(0.9_0.02_340)]">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 bg-[oklch(0.85_0.08_340_/_0.1)]">
                  <User className="w-6 h-6 text-[oklch(0.85_0.08_340)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-game-primary">
                  Ver Perfil
                </h3>
                <p className="text-sm text-game-secondary">
                  Revisa tu información
                </p>
              </div>
            </div>
          </Link>

          {/* Reglas del Juego */}
          <Link href="/rules" className="block">
            <div className="rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-[oklch(0.99_0.005_85)] border border-[oklch(0.9_0.02_85)]">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 bg-winner-badge">
                  <BookOpen className="w-6 h-6 text-winner" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-game-primary">
                  Reglas del Juego
                </h3>
                <p className="text-sm text-game-secondary">
                  Aprende cómo jugar
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}