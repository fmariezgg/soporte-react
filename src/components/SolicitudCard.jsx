export default function SolicitudCard({
  id,
  titulo,
  prioridad,
  estado,
  onResolver,
  resolviendo = false,
}) {
  const resuelta = estado === 'Resuelta'

  return (
    <article
      className={`card prioridad-${prioridad.toLowerCase()}${resuelta ? ' resuelta' : ''}`}
      aria-busy={resolviendo}
    >
      <h3>{titulo}</h3>
      <p>Prioridad: {prioridad}</p>
      <p>Estado: {estado}</p>
      {resuelta && <p className="insignia">✓ Resuelta</p>}
      {onResolver && !resuelta && (
        <button
          type="button"
          aria-label={`Resolver solicitud: ${titulo}`}
          disabled={resolviendo}
          onClick={() => onResolver(id)}
        >
          {resolviendo ? 'Resolviendo...' : 'Resolver'}
        </button>
      )}
    </article>
  )
}
