'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trophy, Medal, Users } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Player {
  id: string
  name: string
  score: number
}

interface GameEndModalProps {
  isOpen: boolean
  winner: Player
  finalScores: Player[]
  currentPlayerId: string
  onClose: () => void
}

export function GameEndModal({ isOpen, winner, finalScores, currentPlayerId, onClose }: GameEndModalProps) {
  const router = useRouter()
  const [, setShowConfetti] = useState(false)
  const isWinner = currentPlayerId === winner.id

  useEffect(() => {
    if (isOpen && isWinner) {
      setShowConfetti(true)
      
      // Confetti animation
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        confetti(Object.assign({}, defaults, { 
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }))
        confetti(Object.assign({}, defaults, { 
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }))
      }, 250)

      return () => clearInterval(interval)
    }
  }, [isOpen, isWinner])

  const handleGoToDashboard = () => {
    // Redirigir al home
    router.push('/')
  }

  const handleContinue = () => {
    onClose()
    handleGoToDashboard()
  }

  const sortedScores = [...finalScores].sort((a, b) => b.score - a.score)

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden z-50">
        <DialogTitle className="sr-only">
          {isWinner ? 'Ganaste la partida' : 'Fin del juego'}
        </DialogTitle>
        {isWinner ? (
          // Modal de Victoria
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 text-center border border-green-200">
            <div className="mb-4">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-2 animate-bounce" />
              <h2 className="text-3xl font-bold text-green-800 mb-2">¡FELICITACIONES!</h2>
              <p className="text-xl text-green-700">¡Ganaste la partida!</p>
            </div>
            
            <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-semibold text-lg">Puntuación Final</p>
              <p className="text-2xl font-bold text-green-900">{winner.score} puntos</p>
            </div>

            <div className="space-y-2 mb-6">
              <h3 className="text-green-800 font-semibold">Tabla Final</h3>
              {sortedScores.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between bg-white border border-green-200 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                    {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                    {index === 2 && <Medal className="h-4 w-4 text-orange-400" />}
                    <span className="text-gray-800 font-medium">{player.name}</span>
                  </div>
                  <span className="text-gray-900 font-bold">{player.score}</span>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              🏆 Ir al Dashboard
            </Button>
          </div>
        ) : (
          // Modal de Derrota
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center border border-blue-200">
            <div className="mb-4">
              <Medal className="h-16 w-16 text-blue-500 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-blue-800 mb-2">¡Buen Intento!</h2>
              <p className="text-lg text-blue-700">¡Mejor suerte para la próxima!</p>
            </div>
            
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-semibold">Ganador</p>
              <p className="text-xl font-bold text-blue-900">{winner.name}</p>
              <p className="text-blue-700">{winner.score} puntos</p>
            </div>

            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-semibold">Tu Puntuación</p>
              <p className="text-xl font-bold text-blue-900">
                {finalScores.find(p => p.id === currentPlayerId)?.score || 0} puntos
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <h3 className="text-blue-800 font-semibold">Tabla Final</h3>
              {sortedScores.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between bg-white border border-blue-200 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                    {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                    <span className={`font-medium ${player.id === currentPlayerId ? 'text-blue-600' : 'text-gray-800'}`}>
                      {player.name}
                    </span>
                  </div>
                  <span className="text-gray-900 font-bold">{player.score}</span>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3"
            >
              <Users className="h-4 w-4 mr-2" />
              🏠 Ir al Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
