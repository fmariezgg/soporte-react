export const ESTADOS = ['Pendiente', 'En proceso', 'Resuelta']
export const PRIORIDADES = ['Alta', 'Media', 'Baja']

// Lowercase and strip accents so "Teclado" matches "téclado" and "RED" matches "red".
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function filtrarSolicitudes(
  solicitudes,
  { estado = 'Todas', prioridad = 'Todas', texto = '' } = {},
) {
  const busqueda = normalizar(texto)
  return solicitudes.filter(
    (s) =>
      (estado === 'Todas' || s.estado === estado) &&
      (prioridad === 'Todas' || s.prioridad === prioridad) &&
      (busqueda === '' || normalizar(s.titulo).includes(busqueda)),
  )
}

// Derived data: computed on every render from `solicitudes`, never stored in state.
export function calcularIndicadores(solicitudes) {
  const porEstado = Object.fromEntries(ESTADOS.map((e) => [e, 0]))
  const porPrioridad = Object.fromEntries(PRIORIDADES.map((p) => [p, 0]))
  for (const s of solicitudes) {
    if (s.estado in porEstado) porEstado[s.estado] += 1
    if (s.prioridad in porPrioridad) porPrioridad[s.prioridad] += 1
  }
  return { total: solicitudes.length, porEstado, porPrioridad }
}
