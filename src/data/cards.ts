// Base de datos de cartas para Conectando+
// Basado en las 4 categorías: RC, AC, E, CE

export type CardType = 'RC' | 'AC' | 'E' | 'CE'

export interface GameCard {
  id: string
  type: CardType
  category: string
  question: string
  options?: string[]
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  imageNumber?: number // Para las imágenes 1-65 que Roberto va a remasterizar
}

// Cartas de Resolución de Conflictos (RC) - Amarillo
export const resolutionCards: GameCard[] = [
  {
    id: 'RC001',
    type: 'RC',
    category: 'Resolución de Conflictos',
    question: '¿Cuál es la mejor manera de resolver un conflicto con un amigo?',
    options: [
      'Hablar directamente sobre el problema',
      'Evitar el tema hasta que se olvide',
      'Pedirle a otro amigo que hable por ti',
      'Escribir una carta explicando tus sentimientos'
    ],
    points: 2,
    difficulty: 'easy',
    imageNumber: 1
  },
  {
    id: 'RC002',
    type: 'RC',
    category: 'Resolución de Conflictos',
    question: 'Cuando alguien te critica, ¿cuál es tu primera reacción?',
    options: [
      'Escuchar y reflexionar sobre el comentario',
      'Defender mi posición inmediatamente',
      'Sentirme herido y alejarme',
      'Contraatacar con una crítica'
    ],
    points: 3,
    difficulty: 'medium',
    imageNumber: 2
  },
  {
    id: 'RC003',
    type: 'RC',
    category: 'Resolución de Conflictos',
    question: '¿Qué harías si dos amigos tuyos están peleando y te piden que tomes partido?',
    options: [
      'Escuchar a ambos sin tomar partido',
      'Apoyar al amigo que considero que tiene razón',
      'Alejarme de la situación',
      'Tratar de mediar entre ambos'
    ],
    points: 4,
    difficulty: 'hard',
    imageNumber: 3
  },
  {
    id: 'RC004',
    type: 'RC',
    category: 'Resolución de Conflictos',
    question: 'Describe una situación donde hayas tenido que disculparte. ¿Cómo lo hiciste?',
    points: 3,
    difficulty: 'medium',
    imageNumber: 4
  },
  {
    id: 'RC005',
    type: 'RC',
    category: 'Resolución de Conflictos',
    question: '¿Cómo manejas la frustración cuando las cosas no salen como esperabas?',
    points: 2,
    difficulty: 'easy',
    imageNumber: 5
  }
]

// Cartas de Autoconocimiento (AC) - Rosado
export const selfAwarenessCards: GameCard[] = [
  {
    id: 'AC001',
    type: 'AC',
    category: 'Autoconocimiento',
    question: 'Completa la frase: "Me siento más feliz cuando..."',
    points: 2,
    difficulty: 'easy',
    imageNumber: 6
  },
  {
    id: 'AC002',
    type: 'AC',
    category: 'Autoconocimiento',
    question: '¿Cuál consideras que es tu mayor fortaleza?',
    options: [
      'Mi capacidad de escuchar',
      'Mi creatividad',
      'Mi perseverancia',
      'Mi sentido del humor'
    ],
    points: 2,
    difficulty: 'easy',
    imageNumber: 7
  },
  {
    id: 'AC003',
    type: 'AC',
    category: 'Autoconocimiento',
    question: 'Describe un momento en el que te sentiste realmente orgulloso de ti mismo.',
    points: 3,
    difficulty: 'medium',
    imageNumber: 8
  },
  {
    id: 'AC004',
    type: 'AC',
    category: 'Autoconocimiento',
    question: 'Completa la frase: "Algo que me gustaría cambiar de mí es..."',
    points: 4,
    difficulty: 'hard',
    imageNumber: 9
  },
  {
    id: 'AC005',
    type: 'AC',
    category: 'Autoconocimiento',
    question: '¿Qué actividad te hace perder la noción del tiempo?',
    points: 2,
    difficulty: 'easy',
    imageNumber: 10
  },
  {
    id: 'AC006',
    type: 'AC',
    category: 'Autoconocimiento',
    question: '¿Cuáles son tus valores más importantes?',
    options: [
      'Honestidad y transparencia',
      'Lealtad y amistad',
      'Justicia e igualdad',
      'Libertad e independencia'
    ],
    points: 3,
    difficulty: 'medium',
    imageNumber: 11
  }
]

// Cartas de Empatía (E) - Celeste
export const empathyCards: GameCard[] = [
  {
    id: 'E001',
    type: 'E',
    category: 'Empatía',
    question: '¿Cómo te das cuenta cuando alguien está triste sin que te lo diga?',
    options: [
      'Por su lenguaje corporal',
      'Por el tono de su voz',
      'Por su expresión facial',
      'Por su comportamiento diferente'
    ],
    points: 2,
    difficulty: 'easy',
    imageNumber: 12
  },
  {
    id: 'E002',
    type: 'E',
    category: 'Empatía',
    question: 'Describe una vez que ayudaste a alguien que estaba pasando por un momento difícil.',
    points: 3,
    difficulty: 'medium',
    imageNumber: 13
  },
  {
    id: 'E003',
    type: 'E',
    category: 'Empatía',
    question: '¿Qué harías si vieras a un compañero siendo excluido del grupo?',
    options: [
      'Invitarlo a unirse a mi grupo',
      'Hablar con los otros sobre incluirlo',
      'Acercarme a hablar con él individualmente',
      'Reportar la situación a un adulto'
    ],
    points: 4,
    difficulty: 'hard',
    imageNumber: 14
  },
  {
    id: 'E004',
    type: 'E',
    category: 'Empatía',
    question: 'Completa la frase: "Cuando veo a alguien llorar, yo..."',
    points: 2,
    difficulty: 'easy',
    imageNumber: 15
  },
  {
    id: 'E005',
    type: 'E',
    category: 'Empatía',
    question: '¿Cómo te sientes cuando alguien no entiende tu punto de vista?',
    options: [
      'Frustrado pero trato de explicar mejor',
      'Comprendo que todos pensamos diferente',
      'Me molesto y prefiero no hablar del tema',
      'Busco ejemplos para hacerme entender'
    ],
    points: 3,
    difficulty: 'medium',
    imageNumber: 16
  }
]

// Cartas de Comunicación Efectiva (CE) - Verde
export const communicationCards: GameCard[] = [
  {
    id: 'CE001',
    type: 'CE',
    category: 'Comunicación Efectiva',
    question: '¿Cuál es la mejor manera de expresar desacuerdo sin ofender?',
    options: [
      'Usar frases como "Yo pienso que..." en lugar de "Tú estás mal"',
      'Esperar a estar calmado antes de hablar',
      'Escuchar primero y luego expresar mi opinión',
      'Todas las anteriores'
    ],
    points: 3,
    difficulty: 'medium',
    imageNumber: 17
  },
  {
    id: 'CE002',
    type: 'CE',
    category: 'Comunicación Efectiva',
    question: 'Describe una conversación difícil que hayas tenido y cómo la manejaste.',
    points: 4,
    difficulty: 'hard',
    imageNumber: 18
  },
  {
    id: 'CE003',
    type: 'CE',
    category: 'Comunicación Efectiva',
    question: '¿Qué haces cuando no entiendes lo que alguien te está explicando?',
    options: [
      'Pregunto específicamente qué parte no entiendo',
      'Pido que me lo explique con un ejemplo',
      'Finjo que entiendo para no molestar',
      'Le pido que me lo escriba'
    ],
    points: 2,
    difficulty: 'easy',
    imageNumber: 19
  },
  {
    id: 'CE004',
    type: 'CE',
    category: 'Comunicación Efectiva',
    question: 'Completa la frase: "Para mí, escuchar realmente significa..."',
    points: 3,
    difficulty: 'medium',
    imageNumber: 20
  },
  {
    id: 'CE005',
    type: 'CE',
    category: 'Comunicación Efectiva',
    question: '¿Cómo le dirías a un amigo que algo que hizo te molestó?',
    options: [
      'Directamente pero con respeto',
      'Con un ejemplo de cómo me sentí',
      'Esperaría a que se me pase el enojo',
      'Le escribiría un mensaje'
    ],
    points: 3,
    difficulty: 'medium',
    imageNumber: 21
  }
]

// Cartas especiales "¿Qué es?" para explicar cada categoría (primera vez)
export const explanationCards: GameCard[] = [
  {
    id: 'EXP_RC',
    type: 'RC',
    category: 'Resolución de Conflictos',
    question: '¿Qué es Resolución de Conflictos? Son situaciones donde debemos encontrar soluciones a problemas entre personas, aprendiendo a manejar diferencias de manera constructiva.',
    points: 0,
    difficulty: 'easy',
    imageNumber: 57
  },
  {
    id: 'EXP_AC',
    type: 'AC',
    category: 'Autoconocimiento',
    question: '¿Qué es Autoconocimiento? Es la capacidad de entender nuestras emociones, fortalezas, debilidades y motivaciones para crecer como personas.',
    points: 0,
    difficulty: 'easy',
    imageNumber: 58
  },
  {
    id: 'EXP_E',
    type: 'E',
    category: 'Empatía',
    question: '¿Qué es Empatía? Es la habilidad de entender y compartir los sentimientos de otras personas, poniéndonos en su lugar.',
    points: 0,
    difficulty: 'easy',
    imageNumber: 59
  },
  {
    id: 'EXP_CE',
    type: 'CE',
    category: 'Comunicación Efectiva',
    question: '¿Qué es Comunicación Efectiva? Es la capacidad de expresar nuestras ideas y sentimientos de manera clara y respetuosa, y de escuchar activamente a otros.',
    points: 0,
    difficulty: 'easy',
    imageNumber: 60
  }
]

// Todas las cartas combinadas
export const allCards: GameCard[] = [
  ...explanationCards,
  ...resolutionCards,
  ...selfAwarenessCards,
  ...empathyCards,
  ...communicationCards
]

// Funciones de utilidad
export const getCardsByType = (type: CardType): GameCard[] => {
  return allCards.filter(card => card.type === type)
}

export const getRandomCard = (type?: CardType): GameCard => {
  const cards = type ? getCardsByType(type) : allCards.filter(card => !card.id.startsWith('EXP_'))
  const randomIndex = Math.floor(Math.random() * cards.length)
  return cards[randomIndex]
}

export const getExplanationCard = (type: CardType): GameCard | undefined => {
  return explanationCards.find(card => card.type === type)
}

export const getCardById = (id: string): GameCard | undefined => {
  return allCards.find(card => card.id === id)
}

// Configuración del juego
export const GAME_CONFIG = {
  TARGET_SCORE: 20,
  MAX_PLAYERS: 8,
  MIN_PLAYERS: 2,
  CARD_TYPES: ['RC', 'AC', 'E', 'CE'] as CardType[],
  CATEGORY_COLORS: {
    RC: 'oklch(0.8 0.15 85)', // Amarillo
    AC: 'oklch(0.85 0.08 340)', // Rosado
    E: 'oklch(0.55 0.15 220)', // Celeste
    CE: 'oklch(0.65 0.12 160)' // Verde
  }
}
