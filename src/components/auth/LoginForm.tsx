'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/schemas'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const { login, register, isLoading, error } = useAuth()
  const [loginData, setLoginData] = useState<LoginInput>({ email: '', password: '' })
  const [registerData, setRegisterData] = useState<RegisterInput>({ name: '', email: '', password: '' })
  const [loginErrors, setLoginErrors] = useState<Partial<LoginInput>>({})
  const [registerErrors, setRegisterErrors] = useState<Partial<RegisterInput>>({})
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginErrors({})
    
    const validation = loginSchema.safeParse(loginData)
    if (!validation.success) {
      const errors: Partial<LoginInput> = {}
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof LoginInput] = issue.message
        }
      })
      setLoginErrors(errors)
      return
    }

    try {
      await login(loginData.email, loginData.password)
      toast.success('¡Inicio de sesión exitoso!')
    } catch (error) {
      toast.error('Error al iniciar sesión')
      console.error('Login failed:', error)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterErrors({})
    
    const validation = registerSchema.safeParse(registerData)
    if (!validation.success) {
      const errors: Partial<RegisterInput> = {}
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          const field = issue.path[0] as keyof RegisterInput
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (errors as any)[field] = issue.message
        }
      })
      setRegisterErrors(errors)
      return
    }

    try {
      await register(registerData)
      toast.success('¡Registro exitoso!')
    } catch (error) {
      toast.error('Error al registrarse')
      console.error('Registration failed:', error)
    }
  }


  return (
    <div 
      className="flex items-end justify-center min-h-screen bg-cover bg-center bg-no-repeat pb-36"
      style={{
        backgroundImage: "url('/logo/fondo2.png')"
      }}
    >
      <Card className="w-full max-w-md backdrop-blur-sm bg-background/95 shadow-2xl border-2">
        <CardHeader className="text-center">
          <CardDescription>
            Juego educativo de resolución de conflictos y autoconocimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  {loginErrors.email && (
                    <div className="text-sm text-destructive">{loginErrors.email}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {loginErrors.password && (
                    <div className="text-sm text-destructive">{loginErrors.password}</div>
                  )}
                </div>
                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nombre</Label>
                  <Input
                    id="register-name"
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  {registerErrors.name && (
                    <div className="text-sm text-destructive">{registerErrors.name}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  {registerErrors.email && (
                    <div className="text-sm text-destructive">{registerErrors.email}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {registerErrors.password && (
                    <div className="text-sm text-destructive">{registerErrors.password}</div>
                  )}
                </div>
                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Registrarse'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
