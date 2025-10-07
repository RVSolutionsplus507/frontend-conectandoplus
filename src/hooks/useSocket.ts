'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // Evitar múltiples inicializaciones
    if (isInitialized.current) return
    isInitialized.current = true
    
    console.log('🔌 Inicializando socket...')
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('🔌 Conectado al servidor')
      setIsConnected(true)
      setError(null)
    })

    // Debug: Escuchar todos los eventos phase-changed
    socket.on('phase-changed', (data) => {
      console.log('🔄 [useSocket] phase-changed recibido:', data)
    })

    socket.on('disconnect', (reason) => {
      console.log('🔌 Desconectado del servidor:', reason)
      setIsConnected(false)
    })

    socket.on('error', (errorData: { message: string }) => {
      console.error('❌ Error de Socket:', errorData.message)
      setError(errorData.message)
    })

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error.message)
      setError('Error de conexión con el servidor')
    })

    return () => {
      console.log('🔌 Limpiando socket...')
      socket.disconnect()
      socketRef.current = null
      isInitialized.current = false
    }
  }, [])

  const emit = (event: string, data?: unknown) => {
    if (socketRef.current?.connected) {
      console.log(`📤 Enviando evento: ${event}`, data)
      socketRef.current.emit(event, data)
    } else {
      console.warn('⚠️ Socket no conectado, no se puede enviar:', event)
    }
  }

  const on = (event: string, handler: (...args: unknown[]) => void) => {
    socketRef.current?.on(event, handler)
  }

  const off = (event: string, handler?: (...args: unknown[]) => void) => {
    socketRef.current?.off(event, handler)
  }

  return {
    socket: socketRef.current,
    isConnected,
    error,
    emit,
    on,
    off
  }
}
