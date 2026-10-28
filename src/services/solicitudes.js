import { api } from './api'

export async function listarSolicitudes(signal) {
  const { data } = await api.get('/solicitudes', { signal })
  if (!Array.isArray(data)) {
    throw new TypeError('La respuesta del servicio no es una lista de solicitudes.')
  }
  return data
}

export async function crearSolicitud({ titulo, prioridad }, signal) {
  const { data } = await api.post('/solicitudes', { titulo, prioridad }, { signal })
  return data
}

// Turns an Axios error into a user-facing message. A browser cannot tell a CORS
// rejection from a server that is down: both surface as ERR_NETWORK without a response.
export function describirError(err) {
  if (err.response) {
    const { status, data } = err.response
    if (status === 400 && Array.isArray(data?.messages)) {
      return `Datos inválidos: ${data.messages.join('; ')}`
    }
    if (status === 404) {
      return 'El recurso no existe (404). Revisa la ruta /api/solicitudes.'
    }
    if (status >= 500) {
      return `El servidor falló (${status}). Intenta de nuevo en unos minutos.`
    }
    return `El servidor respondió con error ${status}.`
  }
  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
    return 'El servidor tardó demasiado en responder (timeout).'
  }
  if (err.code === 'ERR_NETWORK') {
    return 'No hay conexión con el servidor: verifica que esté encendido en el puerto 8080 y que CORS permita este origen.'
  }
  return 'No fue posible completar la operación.'
}

export function esCancelacion(err) {
  return err.code === 'ERR_CANCELED'
}
