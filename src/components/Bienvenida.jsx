const CATEGORIAS = ['Hardware', 'Software', 'Redes']

// Microreto A, as the guide asks: two buttons, each one showing a different alert().
export default function Bienvenida() {
  return (
    <header>
      <h2>Servicios Web · Mi primera aplicación con React</h2>
      <p>Bienvenido al sistema de solicitudes. Categorías de soporte:</p>
      <ul>
        {CATEGORIAS.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <button type="button" onClick={() => alert('Bienvenido a React')}>
        Comenzar
      </button>
      <button
        type="button"
        onClick={() => alert(`Categorías de soporte: ${CATEGORIAS.join(', ')}`)}
      >
        Ver categorías
      </button>
    </header>
  )
}
