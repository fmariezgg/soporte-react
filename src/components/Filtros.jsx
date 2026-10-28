import { ESTADOS, PRIORIDADES } from '../utils/solicitudes'

export default function Filtros({ filtros, onChange }) {
  const set = (campo) => (e) => onChange({ ...filtros, [campo]: e.target.value })

  return (
    <section aria-label="Filtros" className="filtros">
      <div>
        <label htmlFor="buscar">Buscar</label>
        <input
          id="buscar"
          type="search"
          placeholder="Texto en la descripción"
          value={filtros.texto}
          onChange={set('texto')}
        />
      </div>
      <div>
        <label htmlFor="filtro-estado">Filtrar por estado</label>
        <select id="filtro-estado" value={filtros.estado} onChange={set('estado')}>
          <option>Todas</option>
          {ESTADOS.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filtro-prioridad">Filtrar por prioridad</label>
        <select id="filtro-prioridad" value={filtros.prioridad} onChange={set('prioridad')}>
          <option>Todas</option>
          {PRIORIDADES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
    </section>
  )
}
