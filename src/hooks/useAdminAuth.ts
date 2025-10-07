'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'ADMIN'
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (!token || !userData) {
          setIsAuthenticated(false)
          setUser(null)
          setIsLoading(false)
          return
        }

        const parsedUser = JSON.parse(userData)
        
        if (parsedUser.role !== 'ADMIN') {
          setIsAuthenticated(false)
          setUser(null)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setIsLoading(false)
          return
        }

        setUser(parsedUser)
        setIsAuthenticated(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking auth:', error)
        setIsAuthenticated(false)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/admin/login')
  }

  const redirectToLogin = () => {
    router.push('/admin/login')
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    redirectToLogin
  }
}
