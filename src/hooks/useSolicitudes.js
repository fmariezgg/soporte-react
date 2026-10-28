import { useCallback, useEffect, useState } from 'react'
import {
  crearSolicitud,
  describirError,
  esCancelacion,
  listarSolicitudes,
} from '../services/solicitudes'

export function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  // Bumping this value re-runs the effect: that is how "Reintentar" works.
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function cargar() {
      try {
        setCargando(true)
        setError('')
        setSolicitudes(await listarSolicitudes(controller.signal))
      } catch (err) {
        if (!esCancelacion(err)) setError(describirError(err))
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }

    cargar()
    return () => controller.abort()
  }, [intento])

  const reintentar = useCallback(() => setIntento((n) => n + 1), [])

  const agregar = useCallback(async (datos) => {
    try {
      const creada = await crearSolicitud(datos)
      setSolicitudes((actuales) => [...actuales, creada])
    } catch (err) {
      throw new Error(describirError(err), { cause: err })
    }
  }, [])

  // Client-side only: the API contract has no PATCH, so this is lost on reload.
  const resolver = useCallback((id) => {
    setSolicitudes((actuales) =>
      actuales.map((s) => (s.id === id ? { ...s, estado: 'Resuelta' } : s)),
    )
  }, [])

  return { solicitudes, cargando, error, reintentar, agregar, resolver }
}
