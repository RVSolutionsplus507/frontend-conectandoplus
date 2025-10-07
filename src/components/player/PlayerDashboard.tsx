'use client'

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-8 relative overflow-hidden">
      {/* Hero Background Pattern - Inspired by image 65.png */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-pink-300 to-blue-500 transform rotate-12 scale-150"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-tl from-green-400 via-blue-300 to-purple-500 transform -rotate-12 scale-150"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-xl border border-white/30">
        <div className="absolute inset-0 bg-[url('/logo/fondo3.png')] bg-cover bg-center opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Image
                  src={player.avatar || '/default-avatar.png'}
                  alt={player.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full border-4 shadow-lg"
                  style={{ borderColor: 'oklch(0.55 0.15 220)' }}
                />
                <div className="absolute -bottom-2 -right-2">
                  <Badge className="px-3 py-1 text-sm text-white" style={{ backgroundColor: 'oklch(0.65 0.12 160)' }}>
                    En línea
                  </Badge>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: 'oklch(0.3 0.1 220)' }}>
                  ¡Hola, {player.name}!
                </h1>
                <p className="text-xl" style={{ color: 'oklch(0.5 0.05 220)' }}>
                  Bienvenido de vuelta a Conectando+
                </p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:opacity-90"
              style={{ backgroundColor: 'oklch(0.55 0.15 10)' }}
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas del Jugador */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'oklch(0.3 0.1 220)' }}>
          Tus Estadísticas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Partidas Jugadas */}
          <div className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'oklch(0.99 0.005 220)', border: '1px solid oklch(0.9 0.02 220)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'oklch(0.55 0.15 220 / 0.1)' }}>
                <Users className="w-8 h-8" style={{ color: 'oklch(0.55 0.15 220)' }} />
              </div>
              <span className="text-3xl font-bold" style={{ color: 'oklch(0.55 0.15 220)' }}>
                {player.stats?.gamesPlayed || 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'oklch(0.3 0.1 220)' }}>
              Partidas Jugadas
            </h3>
            <p className="text-sm" style={{ color: 'oklch(0.5 0.05 220)' }}>
              Total de partidas completadas
            </p>
          </div>

          {/* Victorias */}
          <div className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'oklch(0.99 0.005 160)', border: '1px solid oklch(0.9 0.02 160)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'oklch(0.65 0.12 160 / 0.1)' }}>
                <Trophy className="w-8 h-8" style={{ color: 'oklch(0.65 0.12 160)' }} />
              </div>
              <span className="text-3xl font-bold" style={{ color: 'oklch(0.65 0.12 160)' }}>
                {player.stats?.gamesWon || 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'oklch(0.3 0.1 220)' }}>
              Victorias
            </h3>
            <p className="text-sm" style={{ color: 'oklch(0.5 0.05 220)' }}>
              Partidas ganadas
            </p>
          </div>

          {/* Puntuación Total */}
          <div className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'oklch(0.99 0.005 340)', border: '1px solid oklch(0.9 0.02 340)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'oklch(0.85 0.08 340 / 0.1)' }}>
                <Star className="w-8 h-8" style={{ color: 'oklch(0.85 0.08 340)' }} />
              </div>
              <span className="text-3xl font-bold" style={{ color: 'oklch(0.85 0.08 340)' }}>
                {player.stats?.totalScore || 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'oklch(0.3 0.1 220)' }}>
              Puntuación Total
            </h3>
            <p className="text-sm" style={{ color: 'oklch(0.5 0.05 220)' }}>
              Puntos acumulados
            </p>
          </div>

          {/* Promedio */}
          <div className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'oklch(0.99 0.005 85)', border: '1px solid oklch(0.9 0.02 85)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'oklch(0.8 0.15 85 / 0.1)' }}>
                <TrendingUp className="w-8 h-8" style={{ color: 'oklch(0.8 0.15 85)' }} />
              </div>
              <span className="text-3xl font-bold" style={{ color: 'oklch(0.8 0.15 85)' }}>
                {player.stats?.gamesPlayed ? Math.round((player.stats.totalScore || 0) / player.stats.gamesPlayed) : 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'oklch(0.3 0.1 220)' }}>
              Promedio
            </h3>
            <p className="text-sm" style={{ color: 'oklch(0.5 0.05 220)' }}>
              Puntos por partida
            </p>
          </div>
        </div>

        {/* Acciones del Juego */}
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'oklch(0.3 0.1 220)' }}>
          Acciones del Juego
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto relative">
          {/* Unirse a Partida */}
          <Link href="/lobby" className="block">
            <div className="rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group" style={{ backgroundColor: 'oklch(0.99 0.005 160)', border: '1px solid oklch(0.9 0.02 160)' }}>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300" style={{ backgroundColor: 'oklch(0.65 0.12 160 / 0.1)' }}>
                  <Trophy className="w-6 h-6" style={{ color: 'oklch(0.65 0.12 160)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'oklch(0.3 0.1 220)' }}>
                  Unirse a Partida
                </h3>
                <p className="text-sm mb-3" style={{ color: 'oklch(0.5 0.05 220)' }}>
                  Únete a una partida existente
                </p>
              </div>
            </div>
          </Link>

          {/* Ver Perfil */}
          <Link href="/profile" className="block">
            <div className="rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group" style={{ backgroundColor: 'oklch(0.99 0.005 340)', border: '1px solid oklch(0.9 0.02 340)' }}>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300" style={{ backgroundColor: 'oklch(0.85 0.08 340 / 0.1)' }}>
                  <User className="w-6 h-6" style={{ color: 'oklch(0.85 0.08 340)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'oklch(0.3 0.1 220)' }}>
                  Ver Perfil
                </h3>
                <p className="text-sm" style={{ color: 'oklch(0.4 0.05 220)' }}>
                  Revisa tu información
                </p>
              </div>
            </div>
          </Link>

          {/* Reglas del Juego */}
          <Link href="/rules" className="block">
            <div className="rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group" style={{ backgroundColor: 'oklch(0.99 0.005 85)', border: '1px solid oklch(0.9 0.02 85)' }}>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300" style={{ backgroundColor: 'oklch(0.8 0.15 85 / 0.1)' }}>
                  <BookOpen className="w-6 h-6" style={{ color: 'oklch(0.8 0.15 85)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'oklch(0.3 0.1 220)' }}>
                  Reglas del Juego
                </h3>
                <p className="text-sm" style={{ color: 'oklch(0.4 0.05 220)' }}>
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