# soporte-react

Aplicación React (Vite + JavaScript/JSX) que consulta y registra solicitudes de soporte técnico en un servicio REST mediante Axios, con estados de carga y error. Práctica de *Servicios Web · Unidad II*.

El backend vive en un repositorio aparte: **soporte-api** (Spring Boot, en memoria).

## Requisitos

- Node.js 20+ y npm
- `soporte-api` ejecutándose en `http://localhost:8080` (`./mvnw spring-boot:run`)

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:5173
```

El origen del frontend debe coincidir con `app.cors.allowed-origins` del backend (por defecto `http://localhost:5173`). Si Vite usa otro puerto, ajusta esa propiedad.

La URL de la API se puede cambiar con la variable `VITE_API_URL` (por defecto `http://localhost:8080/api`).

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm test` | Pruebas (Vitest + Testing Library) |
| `npm run lint` | Oxlint |
| `npm run build` | Build de producción |

## Estructura

```
src/
├── App.jsx                  # composición de la pantalla
├── components/              # SolicitudCard, SolicitudForm, Filtros, Indicadores, Bienvenida
├── hooks/useSolicitudes.js  # useEffect + Axios: carga, error, reintento, crear, resolver
├── services/                # api.js (cliente Axios), solicitudes.js (llamadas + errores)
└── utils/solicitudes.js     # filtrado y métricas (funciones puras)
evidencia/                   # capturas y respuestas de la API
REFLEXION.md                 # respuestas de autoevaluación y justificación de retos
```

## Retos implementados

1. **Filtro combinado** (estado + prioridad, semántica AND).
2. **Indicadores operativos** (total, por estado, prioridad alta), calculados al renderizar.
3. **Búsqueda robusta** (sin distinguir mayúsculas ni tildes, ignora espacios).
4. **Registro real por POST** contra `soporte-api`.
5. **Diseño y resiliencia** (timeout, mensajes por tipo de error, botón *Reintentar*, cancelación con `AbortController`).

Detalle y decisiones en [REFLEXION.md](REFLEXION.md).

## Nota sobre «Resolver»

El contrato del laboratorio solo define `GET` y `POST`. El botón **Resolver** (Microreto B) cambia el estado en el cliente, sin mutar el arreglo, y se pierde al recargar. Persistirlo requeriría un `PATCH` en el backend.
