'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface AnswerTimerProps {
  initialTime: number // en segundos
  onTimeout?: () => void
  isActive: boolean
}

export function AnswerTimer({ initialTime, onTimeout, isActive }: AnswerTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(initialTime)
      return
    }

    setTimeLeft(initialTime)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeout?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, initialTime, onTimeout])

  if (!isActive) return null

  const percentage = (timeLeft / initialTime) * 100
  const isWarning = timeLeft <= 10
  const isCritical = timeLeft <= 5

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-2xl p-4 border-2 border-gray-200 min-w-[200px]">
      <div className="flex items-center gap-3 mb-2">
        <Clock className={`w-5 h-5 ${isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-orange-500' : 'text-blue-500'}`} />
        <span className="font-semibold text-gray-700">Tiempo restante</span>
      </div>
      
      <div className="text-center mb-3">
        <span className={`text-4xl font-bold ${isCritical ? 'text-red-600 animate-pulse' : isWarning ? 'text-orange-600' : 'text-blue-600'}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isCritical ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isCritical && (
        <p className="text-xs text-red-600 text-center mt-2 font-semibold animate-pulse">
          ¡Apúrate!
        </p>
      )}
    </div>
  )
}
