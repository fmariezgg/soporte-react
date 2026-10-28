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

## Botón «Resolver» (mejora sobre la guía)

La guía (Microreto B) pide cambiar el estado sin mutar el arreglo, y el contrato del laboratorio solo define `GET` y `POST`. Una primera versión lo hacía solo en el cliente y el cambio se perdía al recargar. Se mejoró así:

| Antes | Ahora |
|---|---|
| Solo cambiaba el estado en memoria del navegador | Llama a `PATCH /api/solicitudes/{id}` con `{ "estado": "Resuelta" }`: **persiste** mientras el backend siga encendido |
| Sin feedback durante la acción | El botón se deshabilita y muestra «Resolviendo...» (evita doble clic) |
| Un fallo era invisible | Si el `PATCH` falla (404, red, 5xx) se muestra un mensaje con botón *Cerrar* y la tarjeta **no** cambia |
| Nombre accesible genérico («Resolver») | `aria-label` con el título: «Resolver solicitud: …» |
| Sin señal visual al terminar | Insignia «✓ Resuelta» y tarjeta atenuada; el botón desaparece |

**Decisión: actualización pesimista.** La interfaz cambia solo cuando el servidor confirma. Una actualización optimista sería más rápida de percibir, pero exige revertir si falla; para una acción poco frecuente se prefirió la consistencia a la velocidad percibida.

Esto amplía el contrato original con `PATCH /api/solicitudes/{id}` y `GET /api/solicitudes/{id}` en `soporte-api` (CORS ahora permite `PATCH`). Si se usa un backend que solo implementa `GET`/`POST`, el botón mostrará el error de la API en vez de fingir éxito.

## Variables de entorno

Copia `env.example` a `.env.local` para cambiar la URL de la API (`VITE_API_URL`). Solo las variables con prefijo `VITE_` llegan al navegador: no guardes secretos ahí.
