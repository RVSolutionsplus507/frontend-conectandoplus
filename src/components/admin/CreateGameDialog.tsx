'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Users, CheckCircle, X, Target, CheckSquare, Square, Shield } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import { User } from '@/types/admin'

interface CreateGameDialogProps {
  trigger?: React.ReactNode
}

export function CreateGameDialog({ trigger }: CreateGameDialogProps) {
  const [open, setOpen] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [targetScore, setTargetScore] = useState(20)
  const [maxPlayers, setMaxPlayers] = useState(2)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['RC', 'AC', 'E', 'CE'])
  const [playerRole, setPlayerRole] = useState<'PLAYER' | 'MODERATOR' | 'PLAYER_MODERATOR'>('PLAYER')
  const [step, setStep] = useState<'config' | 'selection'>('config')
  
  const { users, createGame, isCreatingGame } = useAdmin()
  
  const availableUsers = users.filter(user => user.role === 'USER')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const adminCountsAsPlayer = playerRole === 'PLAYER_MODERATOR'
    const requiredPlayers = adminCountsAsPlayer ? maxPlayers - 1 : maxPlayers
    
    if (!roomCode.trim() || selectedUsers.length !== requiredPlayers || selectedCategories.length === 0) {
      return
    }

    createGame({
      roomCode: roomCode.trim(),
      targetScore,
      selectedUsers,
      allowedCategories: selectedCategories,
      playerRole
    })

    // Reset form
    setRoomCode('')
    setSelectedUsers([])
    setMaxPlayers(2)
    setTargetScore(20)
    setSelectedCategories(['RC', 'AC', 'E', 'CE'])
    setPlayerRole('PLAYER')
    setStep('config')
    setOpen(false)
  }

  const toggleUserSelection = (userId: string) => {
    const adminCountsAsPlayer = playerRole === 'PLAYER_MODERATOR'
    const requiredPlayers = adminCountsAsPlayer ? maxPlayers - 1 : maxPlayers
    
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else if (prev.length < requiredPlayers) {
        return [...prev, userId]
      }
      return prev
    })
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const selectAllCategories = () => {
    setSelectedCategories(['RC', 'AC', 'E', 'CE'])
  }

  const deselectAllCategories = () => {
    setSelectedCategories([])
  }

  const handleNextStep = () => {
    if (step === 'config' && maxPlayers >= 2 && maxPlayers <= 8 && selectedCategories.length > 0) {
      generateRoomCode()
      setStep('selection')
    }
  }

  // Calcular cuántos jugadores adicionales se necesitan
  const adminCountsAsPlayer = playerRole === 'PLAYER_MODERATOR'
  const requiredPlayers = adminCountsAsPlayer ? maxPlayers - 1 : maxPlayers
  const hasEnoughPlayers = availableUsers.length >= requiredPlayers

  const handleBackStep = () => {
    setStep('config')
    setSelectedUsers([])
  }

  useEffect(() => {
    const adminCountsAsPlayer = playerRole === 'PLAYER_MODERATOR'
    const requiredPlayers = adminCountsAsPlayer ? maxPlayers - 1 : maxPlayers
    
    if (selectedUsers.length > requiredPlayers) {
      setSelectedUsers(prev => prev.slice(0, requiredPlayers))
    }
  }, [maxPlayers, playerRole, selectedUsers.length])

  const getSelectedUser = (userId: string) => {
    return availableUsers.find(user => user.id === userId)
  }

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(code)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Partida
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Crear Nueva Partida - Conectando+
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'config' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {step === 'config' ? '1' : <CheckCircle className="w-4 h-4" />}
            </div>
            <div className="h-px bg-gray-300 flex-1"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'selection' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Configuración</span>
            <span>Seleccionar Jugadores</span>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 px-1">
          {step === 'config' ? (
            <div className="space-y-4 py-2">
              {/* Configuración básica */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-500" />
                  <Label className="text-lg font-semibold">Configuración de Partida</Label>
                </div>
                
                {/* Número de jugadores */}
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers">Número de jugadores</Label>
                  <Select value={maxPlayers.toString()} onValueChange={(value) => setMaxPlayers(parseInt(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el número de jugadores" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} jugadores
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Información de jugadores disponibles */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">
                        Jugadores totales: {maxPlayers}
                        {adminCountsAsPlayer && <span className="text-xs ml-2">(incluye al moderador)</span>}
                      </p>
                      <p className="text-sm text-blue-700">
                        Jugadores a seleccionar: {requiredPlayers} | Disponibles: {availableUsers.length}
                      </p>
                    </div>
                    <div className="text-right">
                      {hasEnoughPlayers ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">✅ Disponible</Badge>
                      ) : (
                        <Badge variant="destructive">❌ Insuficientes</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verificación de jugadores disponibles */}
                {availableUsers.length === 0 ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-700 font-medium">No hay jugadores registrados</p>
                    <p className="text-sm text-red-600 mt-1">Necesitas crear usuarios primero</p>
                  </div>
                ) : !hasEnoughPlayers ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-medium">
                      Solo hay {availableUsers.length} jugadores disponibles
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      {adminCountsAsPlayer 
                        ? `Necesitas ${requiredPlayers} jugadores (tú jugarás como moderador)`
                        : `Necesitas ${requiredPlayers} jugadores (tú solo moderarás)`
                      }
                    </p>
                  </div>
                ) : null}

                {/* Puntuación Objetivo */}
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <Label className="text-sm font-semibold">Puntuación Objetivo</Label>
                    </div>
                    <span className="text-xl font-bold text-blue-600">{targetScore} pts</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Categorías */}
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-purple-500" />
                      <Label className="text-sm font-semibold">Categorías del Juego</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAllCategories}
                        className="text-xs h-7"
                      >
                        Todas
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={deselectAllCategories}
                        className="text-xs h-7"
                      >
                        Ninguna
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'RC', name: 'R. Conflictos', color: 'bg-yellow-400', icon: '💛' },
                      { id: 'AC', name: 'Autoconocimiento', color: 'bg-pink-400', icon: '💗' },
                      { id: 'E', name: 'Empatía', color: 'bg-blue-400', icon: '💙' },
                      { id: 'CE', name: 'Com. Efectiva', color: 'bg-green-400', icon: '💚' }
                    ].map((category) => {
                      const isSelected = selectedCategories.includes(category.id)
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                          className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? `${category.color} border-gray-900`
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-gray-900 flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span className="text-sm">{category.icon}</span>
                          <span className={`text-xs font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                            {category.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {selectedCategories.length === 0 && (
                    <p className="text-red-600 text-sm font-medium">
                      ⚠️ Debes seleccionar al menos una categoría
                    </p>
                  )}
                </div>

                {/* Rol del Admin */}
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <Label className="text-sm font-semibold">Tu Rol en el Juego</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPlayerRole('PLAYER_MODERATOR')}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                        playerRole === 'PLAYER_MODERATOR'
                          ? 'bg-purple-100 border-purple-500'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <Shield className="w-4 h-4" />
                      </div>
                      <p className="font-medium text-xs text-center">Jugador + Moderador</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlayerRole('MODERATOR')}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                        playerRole === 'MODERATOR'
                          ? 'bg-purple-100 border-purple-500'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      <p className="font-medium text-xs text-center">Solo Moderador</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 p-1">
              {/* Header de selección */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Seleccionar {requiredPlayers} Jugadores
                    {adminCountsAsPlayer && <span className="text-sm text-purple-600 ml-2">(+Tú como moderador = {maxPlayers} total)</span>}
                  </h3>
                  <p className="text-sm text-gray-600">Código de sala: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{roomCode}</span></p>
                </div>
                <Badge variant="outline" className="text-sm">
                  {selectedUsers.length}/{requiredPlayers} seleccionados
                </Badge>
              </div>

              {/* Lista de jugadores seleccionados */}
              {selectedUsers.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-green-700">Jugadores Seleccionados:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedUsers.map((userId) => {
                      const user = getSelectedUser(userId)
                      if (!user) return null
                      return (
                        <Card key={userId} className="bg-green-50 border-green-200">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-green-500 text-white text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{user.name}</p>
                                  <p className="text-xs text-gray-600">{user.stats.gamesPlayed} partidas</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleUserSelection(userId)}
                                className="h-6 w-6 p-0 hover:bg-red-100"
                              >
                                <X className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Lista de jugadores disponibles */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Jugadores Disponibles:</Label>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                  {availableUsers
                    .filter(user => !selectedUsers.includes(user.id))
                    .map((user: User) => (
                      <Card 
                        key={user.id} 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedUsers.length >= requiredPlayers 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:border-blue-300'
                        }`}
                        onClick={() => selectedUsers.length < requiredPlayers && toggleUserSelection(user.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-blue-500 text-white">
                                  {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{user.stats.gamesPlayed} partidas</p>
                              <p className="text-xs text-gray-500">{user.stats.gamesWon} victorias</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between pt-4 border-t flex-shrink-0 bg-white">
          <div>
            {step === 'selection' && (
              <Button type="button" variant="outline" onClick={handleBackStep}>
                ← Atrás
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            
            {step === 'config' ? (
              <Button 
                type="button" 
                onClick={handleNextStep}
                disabled={!hasEnoughPlayers || selectedCategories.length === 0}
              >
                Siguiente →
              </Button>
            ) : (
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isCreatingGame || selectedUsers.length !== requiredPlayers || selectedCategories.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreatingGame ? 'Creando...' : `Crear Partida (${selectedUsers.length}/${requiredPlayers})`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
