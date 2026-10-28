import { useState } from 'react'

const CATEGORIAS = ['Hardware', 'Software', 'Redes']

// Microreto A. The guide uses alert(); an inline message does the same job
// without blocking the page (and keeps the component testable).
export default function Bienvenida() {
  const [saludo, setSaludo] = useState('')

  return (
    <header>
      <h2>Servicios Web · Mi primera aplicación con React</h2>
      <p>Bienvenido al sistema de solicitudes. Categorías de soporte:</p>
      <ul>
        {CATEGORIAS.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <button type="button" onClick={() => setSaludo('Bienvenido a React, ¡manos a la obra!')}>
        Comenzar
      </button>
      <p role="status">{saludo}</p>
    </header>
  )
}
