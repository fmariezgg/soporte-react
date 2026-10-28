import { describe, expect, it } from 'vitest'
import { calcularIndicadores, filtrarSolicitudes } from './solicitudes'

const datos = [
  { id: 1, titulo: 'Equipo no enciende', prioridad: 'Alta', estado: 'Pendiente' },
  { id: 2, titulo: 'Instalar software', prioridad: 'Media', estado: 'En proceso' },
  { id: 3, titulo: 'Red sin conexión', prioridad: 'Alta', estado: 'Resuelta' },
]

describe('filtrarSolicitudes', () => {
  it('returns everything with default filters', () => {
    expect(filtrarSolicitudes(datos)).toHaveLength(3)
  })

  it('combines estado and prioridad with AND semantics', () => {
    const r = filtrarSolicitudes(datos, { estado: 'Pendiente', prioridad: 'Alta' })
    expect(r.map((s) => s.id)).toEqual([1])
  })

  it('returns nothing when the combination has no match', () => {
    expect(filtrarSolicitudes(datos, { estado: 'Resuelta', prioridad: 'Media' })).toEqual([])
  })

  it('searches ignoring case, accents and surrounding spaces', () => {
    expect(filtrarSolicitudes(datos, { texto: '  CONEXION ' }).map((s) => s.id)).toEqual([3])
  })

  it('treats a blank search as no search', () => {
    expect(filtrarSolicitudes(datos, { texto: '   ' })).toHaveLength(3)
  })

  it('does not mutate the input array', () => {
    const copia = [...datos]
    filtrarSolicitudes(datos, { estado: 'Pendiente' })
    expect(datos).toEqual(copia)
  })
})

describe('calcularIndicadores', () => {
  it('counts total, by estado and by prioridad', () => {
    const r = calcularIndicadores(datos)
    expect(r.total).toBe(3)
    expect(r.porEstado).toEqual({ Pendiente: 1, 'En proceso': 1, Resuelta: 1 })
    expect(r.porPrioridad).toEqual({ Alta: 2, Media: 1, Baja: 0 })
  })

  it('handles an empty list', () => {
    expect(calcularIndicadores([]).total).toBe(0)
  })
})
