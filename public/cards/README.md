# Estructura de Imágenes de Cartas - Conectando+

## Organización de Archivos

Las imágenes de cartas deben organizarse en la siguiente estructura:

```
public/cards/
├── RC/          # Resolución de Conflictos (Amarillo)
├── AC/          # Autoconocimiento (Rosado)
├── E/           # Empatía (Celeste)
├── CE/          # Comunicación Efectiva (Verde)
└── explanations/ # Cartas de explicación
```

## Convención de Nombres

### Cartas de Juego
- **RC**: `RC-001.png`, `RC-002.png`, etc.
- **AC**: `AC-001.png`, `AC-002.png`, etc.
- **E**: `E-001.png`, `E-002.png`, etc.
- **CE**: `CE-001.png`, `CE-002.png`, etc.

### Cartas de Explicación
- `explanation-RC.png` - Explicación de Resolución de Conflictos
- `explanation-AC.png` - Explicación de Autoconocimiento
- `explanation-E.png` - Explicación de Empatía
- `explanation-CE.png` - Explicación de Comunicación Efectiva

## Especificaciones Técnicas

- **Formato**: PNG con transparencia
- **Resolución**: 400x600px (proporción 2:3)
- **Calidad**: Alta resolución para pantallas retina
- **Peso**: Máximo 200KB por imagen

## Integración con el Sistema

Las imágenes se referencian en el frontend usando:
```typescript
const cardImageUrl = `/cards/${card.type}/${card.type}-${card.id.padStart(3, '0')}.png`
```

Para cartas de explicación:
```typescript
const explanationImageUrl = `/cards/explanations/explanation-${cardType}.png`
```

## Estado Actual

- ✅ Estructura de carpetas creada
- ⏳ Pendiente: Imágenes remasterizadas (1-65)
- ⏳ Pendiente: Implementación en componentes de frontend

## Notas

Roberto tiene las imágenes originales numeradas del 1 al 65 y las va a remasterizar según esta estructura cuando estén listas.
