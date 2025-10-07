'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Dice1, Target, Clock } from 'lucide-react'
import Link from 'next/link'

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Reglas del Juego</h1>
          <p className="text-lg text-muted-foreground">
            Aprende a jugar Conectando+ - Resolución de Conflictos y Autoconocimiento
          </p>
        </header>

        <div className="space-y-6">
          {/* Código de Juego */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Código de Juego
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold text-center mb-3">
                  Conectando+ es un juego diseñado para crear relaciones más saludables
                </p>
              </div>
              <div className="space-y-3">
                <p>• <strong>Todas las respuestas son válidas:</strong> cada respuesta es personal</p>
                <p>• <strong>Respeto:</strong> no está permitido burlarse ni hacer comentarios irrespetuosos</p>
                <p>• <strong>Confidencialidad:</strong> las experiencias o situaciones compartidas durante el juego deben permanecer dentro del grupo</p>
                <div className="bg-muted p-3 rounded-lg mt-4">
                  <p className="font-semibold text-center">
                    ¡Recuerda, lo más importante es escuchar, compartir y construir juntos un ambiente de confianza!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desarrollo del Juego */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dice1 className="h-5 w-5 text-primary" />
                Desarrollo del Juego
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-3 text-primary">Mecánica de Turnos</h4>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <ol className="space-y-2 list-decimal list-inside">
                      <li>En cada turno se debe tomar una tarjeta y leerla en voz alta</li>
                      <li>Responder según las instrucciones para ganar puntos</li>
                      <li>Si la mayoría del grupo considera que el jugador responde bien, se queda con la tarjeta</li>
                      <li>En caso contrario, otro jugador puede intentarlo</li>
                      <li>Si un jugador no responde en 1 minuto, otro puede contestar</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-lg mb-3 text-primary">Reglas Adicionales</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-primary pl-4">
                    <h5 className="font-medium">Cartas de selección múltiple:</h5>
                    <p className="text-sm text-muted-foreground">Todos pueden responder menos el que la lee; el primero en acertar gana la tarjeta</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h5 className="font-medium">Cartas con respuesta de ejemplo:</h5>
                    <p className="text-sm text-muted-foreground">Deben ser leídas en voz alta y pueden usarse como ejemplo, pero solo se gana si dice una diferente</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h5 className="font-medium">Pasar turno:</h5>
                    <p className="text-sm text-muted-foreground">Se vale no responder y otro jugador puede intentarlo</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Participantes: de 2 a 8 jugadores</p>
                <p className="text-sm">Los jugadores responden las preguntas de las tarjetas para ganar puntos</p>
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Preguntas */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Preguntas por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-card pl-4">
                    <h4 className="font-semibold text-yellow-800">Resolución de Conflictos (RC)</h4>
                    <p className="text-sm text-muted-foreground">
                      Situaciones de conflicto con opciones múltiples, estrategias de resolución
                    </p>
                  </div>
                  <div className="border-l-4 border-pink-card pl-4">
                    <h4 className="font-semibold text-pink-800">Autoconocimiento (AC)</h4>
                    <p className="text-sm text-muted-foreground">
                      Preguntas de reflexión personal y completar frases de autoconocimiento
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-card pl-4">
                    <h4 className="font-semibold text-blue-800">Empatía (E)</h4>
                    <p className="text-sm text-muted-foreground">
                      Desarrollo de empatía y comprensión del otro, perspectivas diferentes
                    </p>
                  </div>
                  <div className="border-l-4 border-green-card pl-4">
                    <h4 className="font-semibold text-green-800">Comunicación Efectiva (CE)</h4>
                    <p className="text-sm text-muted-foreground">
                      Habilidades de comunicación, alternativas creativas con Quizás
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condiciones de Victoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Condiciones de Victoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">El juego termina cuando:</h4>
                <ul className="space-y-1">
                  <li>• Un jugador alcanza <strong>20 puntos</strong>, O</li>
                  <li>• Se acaban las tarjetas</li>
                </ul>
                <p className="mt-3 font-semibold text-primary">
                  🏆 <strong>Gana quien tenga más puntos</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botón de Regreso */}
          <div className="text-center pt-6">
            <Button asChild size="lg">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Inicio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
