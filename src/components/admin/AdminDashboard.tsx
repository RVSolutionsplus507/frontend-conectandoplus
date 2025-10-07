'use client'

import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateGameDialog } from './CreateGameDialog'
import { CreateUserDialog } from './CreateUserDialog'
import { 
  Shield, 
  Users, 
  GamepadIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Eye,
  Trash2,
  Edit,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { User, Game } from '@/types/admin'
import { useState, useEffect } from 'react'

export function AdminDashboard() {
  const { logout } = useAuth()
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
  }, [])
  const { 
    users, 
    games, 
    stats, 
    usersLoading, 
    gamesLoading, 
    statsLoading,
    deleteUser,
    updateGameStatus
  } = useAdmin()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Admin */}
        <header className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-yellow-500/5 to-primary/5 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white rounded-3xl p-8 border-2 border-primary/10 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary to-yellow-500 rounded-2xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">
                Panel de Administración
              </h1>
            </div>
            <p className="text-lg text-gray-600 mb-4">
              Bienvenido, <span className="font-semibold text-primary">{currentUser?.name || 'Admin'}</span>
            </p>
            <Badge variant="default" className="text-sm px-4 py-2 bg-primary hover:bg-primary/90">
              <Shield className="h-4 w-4 mr-2" />
              Administrador
            </Badge>
          </div>
        </header>

        {/* Tabs de administración */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border-2 border-gray-200 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <GamepadIcon className="h-4 w-4" />
              Partidas
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      Jugadores Totales
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {statsLoading ? '...' : stats?.overview.totalUsers || 0}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Usuarios registrados</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-yellow-400/40 hover:border-yellow-500/60 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <div className="p-2 bg-yellow-400/10 rounded-lg">
                        <GamepadIcon className="h-5 w-5 text-yellow-600" />
                      </div>
                      Partidas Activas
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-yellow-600">
                    {statsLoading ? '...' : stats?.overview.activeGames || 0}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">En curso ahora</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-gray-700" />
                      </div>
                      Partidas Completadas
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900">
                    {statsLoading ? '...' : stats?.overview.finishedGames || 0}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Total histórico</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/90 to-primary border-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      Administradores
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">
                    {usersLoading ? '...' : users.filter(u => u.role === 'ADMIN').length}
                  </div>
                  <p className="text-sm text-white/90 mt-1">Activos</p>
                </CardContent>
              </Card>
            </div>

            {/* Acciones rápidas */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-white border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">Crear Nueva Partida</CardTitle>
                      <CardDescription>Iniciar una nueva sesión de juego</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CreateGameDialog 
                    trigger={
                      <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Partida
                      </Button>
                    }
                  />
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-yellow-400/40 hover:border-yellow-500/60 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-400/10 rounded-lg">
                      <Users className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">Gestionar Usuarios</CardTitle>
                      <CardDescription>Administrar jugadores y admins</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white" size="lg">
                    <Users className="h-4 w-4 mr-2" />
                    Ver Usuarios
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">Reportes</CardTitle>
                      <CardDescription>Estadísticas y análisis</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50" size="lg">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Reportes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Usuarios */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
              <div className="flex gap-2">
                <CreateUserDialog defaultRole="USER" />
                <CreateUserDialog 
                  defaultRole="ADMIN"
                  trigger={
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Admin
                    </Button>
                  }
                />
              </div>
            </div>

            {/* Lista de usuarios */}
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Jugadores Registrados</CardTitle>
                  <CardDescription>Gestiona los jugadores del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usersLoading ? (
                      <p className="text-muted-foreground">Cargando usuarios...</p>
                    ) : users.filter(user => user.role === 'USER').length === 0 ? (
                      <div>
                        <p className="text-muted-foreground">No hay jugadores registrados</p>
                        <p className="text-xs text-gray-500">Total usuarios: {users.length}</p>
                        <p className="text-xs text-gray-500">
                          Roles encontrados: {users.map(u => u.role).join(', ')}
                        </p>
                      </div>
                    ) : (
                      users
                        .filter(user => user.role === 'USER')
                        .map((user: User) => (
                          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className="text-xs text-muted-foreground">
                                  {user.stats.gamesPlayed} partidas jugadas
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Jugador</Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => {
                                  if (confirm('¿Estás seguro de eliminar este usuario?')) {
                                    deleteUser(user.id)
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Administradores</CardTitle>
                  <CardDescription>Gestiona los administradores del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usersLoading ? (
                      <p className="text-muted-foreground">Cargando administradores...</p>
                    ) : (
                      users
                        .filter(user => user.role === 'ADMIN')
                        .map((user: User) => (
                          <div 
                            key={user.id} 
                            className={`flex items-center justify-between p-4 border rounded-lg ${
                              user.email === currentUser?.email ? 'bg-slate-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <Shield className="h-5 w-5 text-slate-600" />
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="default">
                                Admin {user.email === currentUser?.email ? '(Tú)' : ''}
                              </Badge>
                              {user.email !== currentUser?.email && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600"
                                  onClick={() => {
                                    if (confirm('¿Estás seguro de eliminar este administrador?')) {
                                      deleteUser(user.id)
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Partidas */}
          <TabsContent value="games" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Partidas</h2>
              <CreateGameDialog />
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Todas las Partidas</CardTitle>
                  <CardDescription>Monitorea y gestiona las partidas del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gamesLoading ? (
                      <p className="text-muted-foreground">Cargando partidas...</p>
                    ) : games.length === 0 ? (
                      <p className="text-muted-foreground">No hay partidas creadas.</p>
                    ) : (
                      games.map((game: Game) => (
                        <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <GamepadIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Sala: {game.roomCode}</p>
                              <p className="text-sm text-muted-foreground">
                                {game.players?.length || 0} jugadores • Meta: {game.targetScore || 20} puntos
                              </p>
                              {game.status === 'FINISHED' && game.winner && (
                                <p className="text-sm font-semibold text-green-600">
                                  🏆 Ganador: {game.winner.name} ({game.winner.score} puntos)
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Creada: {new Date(game.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={game.status === 'WAITING' ? 'secondary' : 
                                      game.status === 'IN_PROGRESS' ? 'default' : 'outline'}
                              className="flex items-center gap-1"
                            >
                              {game.status === 'WAITING' && <Clock className="h-3 w-3" />}
                              {game.status === 'IN_PROGRESS' && <GamepadIcon className="h-3 w-3" />}
                              {game.status === 'FINISHED' && <CheckCircle className="h-3 w-3" />}
                              {game.status === 'WAITING' ? 'Esperando' : 
                               game.status === 'IN_PROGRESS' ? 'En Curso' : 'Finalizada'}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.location.href = `/game/${game.roomCode}`}
                              title="Unirse a la partida"
                              className="hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {game.status !== 'FINISHED' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => {
                                  if (confirm('¿Finalizar esta partida?')) {
                                    updateGameStatus({ gameId: game.id, status: 'FINISHED' })
                                  }
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Estadísticas */}
          <TabsContent value="stats" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Estadísticas del Sistema
              </h2>
              <Badge variant="outline" className="text-sm px-3 py-1 border-primary text-primary">
                <BarChart3 className="h-4 w-4 mr-1" />
                Analytics
              </Badge>
            </div>
            
            <div className="space-y-6">
              {/* Métricas principales en grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary text-sm font-medium mb-1">Total Usuarios</p>
                        <p className="text-3xl font-bold text-primary">
                          {statsLoading ? '...' : stats?.overview.totalUsers || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-yellow-400/40 hover:border-yellow-500/60 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium mb-1">Total Partidas</p>
                        <p className="text-3xl font-bold text-yellow-600">
                          {statsLoading ? '...' : stats?.overview.totalGames || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-400/10 rounded-full flex items-center justify-center">
                        <GamepadIcon className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary text-sm font-medium mb-1">Partidas Activas</p>
                        <p className="text-3xl font-bold text-primary">
                          {statsLoading ? '...' : stats?.overview.activeGames || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 text-sm font-medium mb-1">Completadas</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {statsLoading ? '...' : stats?.overview.finishedGames || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-gray-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Secciones detalladas */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Jugadores */}
                <Card className="bg-white border-2 border-primary/10 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        Top Jugadores
                      </CardTitle>
                      <Badge variant="outline" className="border-primary text-primary">
                        Ranking
                      </Badge>
                    </div>
                    <CardDescription>Los jugadores con mejor rendimiento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg animate-pulse">
                            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-slate-200 rounded w-3/4 mb-1"></div>
                              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : stats?.topPlayers?.length ? (
                      <div className="space-y-3">
                        {stats.topPlayers.slice(0, 5).map((topPlayer, index) => (
                          <div key={topPlayer.name} className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg hover:from-slate-100 hover:to-blue-100 transition-all duration-200">
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800">{topPlayer.name}</p>
                              <p className="text-sm text-slate-600">
                                {topPlayer.totalScore} puntos • {topPlayer.gamesPlayed} partidas
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-white">
                              {(topPlayer.totalScore / topPlayer.gamesPlayed || 0).toFixed(1)} avg
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No hay datos de jugadores disponibles</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Resumen de Actividad */}
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-slate-600" />
                        Actividad del Sistema
                      </CardTitle>
                      <Badge variant="secondary" className="bg-slate-100">
                        Métricas
                      </Badge>
                    </div>
                    <CardDescription>Estadísticas generales de uso</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-6 bg-slate-200 rounded w-16"></div>
                          </div>
                        ))}
                      </div>
                    ) : stats ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                          <span className="font-medium text-blue-800">Usuarios Registrados</span>
                          <Badge className="bg-blue-600">{stats.overview.totalUsers}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                          <span className="font-medium text-green-800">Partidas Creadas</span>
                          <Badge className="bg-green-600">{stats.overview.totalGames}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                          <span className="font-medium text-purple-800">En Progreso</span>
                          <Badge className="bg-purple-600">{stats.overview.activeGames}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                          <span className="font-medium text-orange-800">Finalizadas</span>
                          <Badge className="bg-orange-600">{stats.overview.finishedGames}</Badge>
                        </div>
                        
                        {/* Tasa de finalización */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Tasa de Finalización</span>
                            <span className="text-sm font-bold text-slate-800">
                              {stats.overview.totalGames > 0 
                                ? Math.round((stats.overview.finishedGames / stats.overview.totalGames) * 100)
                                : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${stats.overview.totalGames > 0 
                                  ? (stats.overview.finishedGames / stats.overview.totalGames) * 100
                                  : 0}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Error al cargar estadísticas</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Configuración */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>Ajustes del sistema y del juego</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="destructive" 
                  onClick={logout}
                  className="w-full md:w-auto"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
