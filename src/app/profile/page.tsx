'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePlayerStats } from '@/hooks/usePlayerStats'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, Edit, Save, User, Mail, Calendar, Trophy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { currentPlayer } = useAuth()
  const { stats, loading: statsLoading } = usePlayerStats()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    setIsClient(true)
    if (currentPlayer) {
      setFormData({
        name: currentPlayer.name || '',
        email: currentPlayer.email || ''
      })
    }
  }, [currentPlayer])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-pink-300 to-blue-500 transform rotate-12 scale-150"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-tl from-green-400 via-blue-300 to-purple-500 transform -rotate-12 scale-150"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-lg text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-pink-300 to-blue-500 transform rotate-12 scale-150"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-tl from-green-400 via-blue-300 to-purple-500 transform -rotate-12 scale-150"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-lg text-gray-600">No se pudo cargar el perfil</p>
          </div>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    // TODO: Implementar actualización de perfil
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-8 relative overflow-hidden">
      {/* Hero Background Pattern - Inspired by image 65.png */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-pink-300 to-blue-500 transform rotate-12 scale-150"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-tl from-green-400 via-blue-300 to-purple-500 transform -rotate-12 scale-150"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"></div>
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => {
              console.log('🔄 Navegando al dashboard...')
              router.push('/')
            }}
            variant="ghost" 
            className="flex items-center gap-2 cursor-pointer hover:scale-110 transition-transform z-50 relative"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Button>
        </div>

        {/* Hero Section - Inspired by image 65.png */}
        <div className="relative mb-12 text-center">
          <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {currentPlayer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white/90 hover:bg-white shadow-lg rounded-full h-10 w-10 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {currentPlayer.name}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant={currentPlayer.role === 'ADMIN' ? 'default' : 'secondary'} className="text-sm px-4 py-1">
                {currentPlayer.role === 'ADMIN' ? 'Administrador' : 'Jugador'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Perfil del usuario */}
        <Card className="mb-8 relative z-10">
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Nombre</p>
                    <p className="text-sm text-muted-foreground">{currentPlayer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{currentPlayer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Miembro desde</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(currentPlayer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Trophy className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Última Actividad</p>
                    <p className="text-sm text-muted-foreground">
                      {stats && stats.gamesPlayed > 0 ? 'Jugando activamente' : 'Sin partidas aún'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bento Grid - Estadísticas del jugador */}
        {currentPlayer.role !== 'ADMIN' && (
          <div className="relative z-10 mb-8">
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Estadísticas del Jugador
            </h2>
            {statsLoading ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[minmax(120px,auto)]">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="md:col-span-2 animate-pulse">
                    <CardContent className="p-6 h-full flex flex-col justify-center">
                      <div className="h-12 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[minmax(120px,auto)]">
                {/* Partidas Jugadas - Span 2 columns */}
                <Card className="md:col-span-2 bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200/50 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 h-full flex flex-col justify-center">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎮</div>
                    <div className="text-3xl font-bold text-blue-700 mb-1">{stats?.gamesPlayed || 0}</div>
                    <div className="text-sm text-blue-600 font-medium">Partidas Jugadas</div>
                  </CardContent>
                </Card>

                {/* Partidas Ganadas */}
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200/50 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 h-full flex flex-col justify-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
                    <div className="text-2xl font-bold text-green-700 mb-1">{stats?.gamesWon || 0}</div>
                    <div className="text-xs text-green-600 font-medium">Victorias</div>
                  </CardContent>
                </Card>

                {/* Puntuación Total */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200/50 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 h-full flex flex-col justify-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⭐</div>
                    <div className="text-2xl font-bold text-purple-700 mb-1">{stats?.totalScore || 0}</div>
                    <div className="text-xs text-purple-600 font-medium">Puntos</div>
                  </CardContent>
                </Card>

                {/* Promedio - Span 2 columns */}
                <Card className="md:col-span-2 bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-200/50 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 h-full flex flex-col justify-center">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                    <div className="text-3xl font-bold text-orange-700 mb-1">{stats?.averageScore || 0}</div>
                    <div className="text-sm text-orange-600 font-medium">Promedio por Partida</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
