export default function Indicadores({ indicadores }) {
  const { total, porEstado, porPrioridad } = indicadores

  return (
    <section aria-label="Indicadores operativos" className="indicadores">
      <p>
        Total registradas: <strong>{total}</strong>
      </p>
      <p>
        Pendientes: <strong>{porEstado.Pendiente}</strong>
      </p>
      <p>
        En proceso: <strong>{porEstado['En proceso']}</strong>
      </p>
      <p>
        Resueltas: <strong>{porEstado.Resuelta}</strong>
      </p>
      <p>
        Prioridad alta: <strong>{porPrioridad.Alta}</strong>
      </p>
    </section>
  )
}
