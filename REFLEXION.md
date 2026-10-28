# Reflexión · soporte-react

## Preguntas de la guía

### 1. ¿Qué diferencia existe entre componente, prop y estado?

- **Componente**: función que recibe datos y devuelve JSX. Ejemplo: `SolicitudCard`.
- **Prop**: dato que el padre le pasa al hijo; es de solo lectura. `App` pasa `titulo`, `prioridad`, `estado` y `onResolver` a cada `SolicitudCard`.
- **Estado**: dato que el propio componente recuerda entre renders y que, al cambiar, vuelve a renderizar (`useState`). Ejemplo: la lista `solicitudes`, el texto de búsqueda o `cargando`.

Regla práctica: si un valor se puede calcular a partir de otro, no es estado (ver Microreto C).

### 2. ¿Por qué `useEffect` es adecuado para iniciar una consulta externa?

Renderizar debe ser una operación pura, sin efectos secundarios. Una petición HTTP es un efecto: sale del mundo de React. `useEffect` la ejecuta después de pintar y permite limpiar al desmontar (`controller.abort()`). Con el arreglo de dependencias `[intento]` se consulta al montar y cada vez que se pulsa *Reintentar*.

### 3. ¿Qué responsabilidades corresponden a React y cuáles a Spring Boot?

| React (cliente) | Spring Boot (servidor) |
|---|---|
| Presentación, interacción, estados de carga/error | Reglas de negocio y datos |
| Validación para dar feedback rápido | Validación **autoritativa** (nunca confiar en el cliente) |
| Filtros y búsqueda en memoria | Persistencia, ids, estado inicial `Pendiente` |
| Mensajes entendibles por tipo de error | Códigos HTTP correctos, política CORS |

### 4. ¿Cómo distinguirías un error de CORS, un 404 y una caída del servidor?

- **404**: hay respuesta HTTP (`err.response.status === 404`). El servidor está vivo; ruta o método incorrectos.
- **Caída del servidor**: no hay respuesta; en el navegador es `ERR_NETWORK` y en consola `ERR_CONNECTION_REFUSED`. Con `curl` se confirma: la conexión es rechazada.
- **CORS**: el navegador bloquea la lectura de la respuesta, y Axios también reporta `ERR_NETWORK` sin `response`. En la consola aparece «blocked by CORS policy». La prueba decisiva es `curl -i -H "Origin: http://localhost:5173" <url>`: si responde 200 pero **sin** `Access-Control-Allow-Origin`, es CORS; si no conecta, es una caída.

Desde JavaScript no se pueden distinguir los dos últimos casos (limitación del navegador, por seguridad). Por eso el mensaje de la app menciona ambas causas. Evidencia en `evidencia/04-error-controlado-backend-detenido.png`.

### 5. ¿Qué mejorarías antes de publicar el sistema para usuarios reales?

1. Persistencia real (base de datos) y `PATCH`/`DELETE`; hoy todo se pierde al reiniciar la API.
2. Autenticación y autorización, y CORS restringido al dominio real.
3. Paginación y búsqueda en el servidor (la guía de sesión 8 ya lo plantea).
4. HTTPS y configuración por entorno (`VITE_API_URL`), sin URLs fijas.
5. Capa de datos con caché y reintentos (por ejemplo TanStack Query) y un `ErrorBoundary`.
6. Pruebas end-to-end, CI con lint + test + build, y migrar a TypeScript.
7. Accesibilidad auditada y bitácora de errores (observabilidad).

## Comprueba / Preguntas de los pasos

- **`npm install`** descarga las dependencias de `package.json` a `node_modules` y fija versiones en `package-lock.json`. **`npm run dev`** inicia Vite, que sirve la app con recarga en caliente (HMR).
- **¿Por qué el contador cambia sin recargar la página?** Al cambiar el estado, React vuelve a ejecutar el componente y actualiza solo los nodos del DOM que difieren; el navegador nunca navega.
- **Reutilizar componentes** evita duplicar JSX, centraliza cambios de estilo y comportamiento (el botón *Resolver* se añadió en un solo lugar) y facilita probarlos aislados.
- **StrictMode** ejecuta los efectos dos veces en desarrollo para detectar fugas. La primera petición se cancela con `AbortController` (se ve como *canceled* en la pestaña Network); no es un registro duplicado.

## Microretos

- **A (Bienvenida)**: `Bienvenida.jsx` muestra la asignatura, la lista Hardware/Software/Redes y un botón. *Desviación:* en vez de `alert()` muestra un mensaje en la página; `alert` bloquea el hilo de la UI y es difícil de probar. JSX son las etiquetas; JavaScript, lo que va entre `{}` (el `map`, el `onClick`).
- **B (Resolver)**: `onResolver(id)` se pasa por props desde `App`. La función de `useSolicitudes` usa `map` y devuelve un objeto nuevo `{ ...s, estado: 'Resuelta' }`; no se muta el arreglo. Vive en el padre porque ahí está el estado (*lifting state up*).
- **C (Pendientes)**: se calcula con `calcularIndicadores(solicitudes)` en cada render. No va en otro `useState` porque duplicaría la fuente de verdad y podría desincronizarse; basta derivarlo.

## Retos

1. **Filtro combinado**: `filtrarSolicitudes` aplica estado, prioridad y texto con AND. Es una función pura con pruebas unitarias.
2. **Indicadores**: total, por estado y prioridad alta; derivados, no almacenados.
3. **Búsqueda robusta**: normaliza con `NFD` y elimina diacríticos, pasa a minúsculas y recorta espacios. Una búsqueda en blanco equivale a no buscar. Prueba: «CONEXION» encuentra «conexión».
4. **POST real**: el formulario llama a `crearSolicitud`. Valida en cliente (descripción vacía) y el servidor vuelve a validar (400 con lista de mensajes que la UI muestra). El botón se deshabilita mientras envía, y el id y el estado los asigna el servidor.
5. **Resiliencia**: `timeout` de 8 s; `describirError` distingue 400/404/5xx/timeout/red; botón *Reintentar*; cancelación al desmontar; `role="alert"` y `role="status"` para lectores de pantalla; estados vacío y «sin resultados» diferenciados.

## Decisiones de diseño

- **Capas**: componentes (UI) → hook (estado + efecto) → servicio (HTTP) → utilidades puras. Cada capa se prueba por separado, sin sobre-ingeniería.
- **CORS** en el backend con un `WebMvcConfigurer` y una propiedad, en lugar de `@CrossOrigin` fijo, para no recompilar si cambia el puerto.
- **Pruebas**: 24 pruebas (lógica pura, errores, y la app completa con el servicio simulado). La integración real contra Spring Boot se verificó a mano; ver `evidencia/`.
