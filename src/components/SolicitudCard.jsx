export default function SolicitudCard({ id, titulo, prioridad, estado, onResolver }) {
  return (
    <article className={`card prioridad-${prioridad.toLowerCase()}`}>
      <h3>{titulo}</h3>
      <p>Prioridad: {prioridad}</p>
      <p>Estado: {estado}</p>
      {onResolver && estado !== 'Resuelta' && (
        <button type="button" onClick={() => onResolver(id)}>
          Resolver
        </button>
      )}
    </article>
  )
}
