import { useState } from 'react'
import { PRIORIDADES } from '../utils/solicitudes'

export default function SolicitudForm({ onSubmit }) {
  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState('Media')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })

  async function enviar(e) {
    e.preventDefault()
    if (!titulo.trim()) {
      setMensaje({ tipo: 'error', texto: 'Escribe una descripción de la solicitud.' })
      return
    }
    try {
      setEnviando(true)
      await onSubmit({ titulo: titulo.trim(), prioridad })
      setTitulo('')
      setMensaje({ tipo: 'ok', texto: 'Solicitud agregada correctamente.' })
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section aria-labelledby="registrar">
      <h2 id="registrar">Registrar solicitud</h2>
      <form onSubmit={enviar}>
        <label htmlFor="titulo">Descripción</label>
        <input
          id="titulo"
          value={titulo}
          maxLength={120}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <label htmlFor="prioridad">Prioridad</label>
        <select id="prioridad" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
          {PRIORIDADES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
      <p role={mensaje.tipo === 'error' ? 'alert' : 'status'} className={mensaje.tipo}>
        {mensaje.texto}
      </p>
    </section>
  )
}
