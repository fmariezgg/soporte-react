import { useCallback, useEffect, useState } from 'react'
import {
  actualizarEstado,
  crearSolicitud,
  describirError,
  esCancelacion,
  listarSolicitudes,
} from '../services/solicitudes'

export function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  // Ids with a PATCH in flight (their button is disabled) and the last action error.
  const [resolviendo, setResolviendo] = useState(() => new Set())
  const [errorAccion, setErrorAccion] = useState('')
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

  // Pessimistic update: the UI changes only after the server confirms, so a failed
  // PATCH never leaves a "Resuelta" card that the backend does not know about.
  const resolver = useCallback(async (id) => {
    setErrorAccion('')
    setResolviendo((ids) => new Set(ids).add(id))
    try {
      const actualizada = await actualizarEstado(id, 'Resuelta')
      setSolicitudes((actuales) => actuales.map((s) => (s.id === id ? actualizada : s)))
    } catch (err) {
      setErrorAccion(describirError(err))
    } finally {
      setResolviendo((ids) => {
        const restantes = new Set(ids)
        restantes.delete(id)
        return restantes
      })
    }
  }, [])

  const descartarErrorAccion = useCallback(() => setErrorAccion(''), [])

  return {
    solicitudes,
    cargando,
    error,
    reintentar,
    agregar,
    resolver,
    resolviendo,
    errorAccion,
    descartarErrorAccion,
  }
}
