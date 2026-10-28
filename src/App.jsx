import { useState } from 'react'
import Filtros from './components/Filtros'
import Indicadores from './components/Indicadores'
import SolicitudCard from './components/SolicitudCard'
import SolicitudForm from './components/SolicitudForm'
import { useSolicitudes } from './hooks/useSolicitudes'
import { calcularIndicadores, filtrarSolicitudes } from './utils/solicitudes'

const FILTROS_INICIALES = { texto: '', estado: 'Todas', prioridad: 'Todas' }

function App() {
  const { solicitudes, cargando, error, reintentar, agregar, resolver } = useSolicitudes()
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)

  // Derived from `solicitudes` on each render, so it never gets out of sync.
  const indicadores = calcularIndicadores(solicitudes)
  const visibles = filtrarSolicitudes(solicitudes, filtros)

  return (
    <main>
      <h1>Sistema de Soporte Técnico</h1>

      {cargando && <p role="status">Cargando solicitudes...</p>}

      {error && (
        <div role="alert" className="error">
          <p>{error}</p>
          <button type="button" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <>
          <Indicadores indicadores={indicadores} />
          <SolicitudForm onSubmit={agregar} />
          <Filtros filtros={filtros} onChange={setFiltros} />

          <section aria-label="Solicitudes">
            {solicitudes.length === 0 ? (
              <p>No hay solicitudes registradas.</p>
            ) : visibles.length === 0 ? (
              <p>No hay resultados para los filtros aplicados.</p>
            ) : (
              visibles.map((s) => <SolicitudCard key={s.id} {...s} onResolver={resolver} />)
            )}
          </section>
        </>
      )}
    </main>
  )
}

export default App
