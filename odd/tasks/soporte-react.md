# soporte-react

**Objective:** React (Vite, JS) app that lists/creates support requests from a REST service (Axios + useEffect), with loading and error states. Lab guide: Servicios Web, Unidad II.
**Backend:** `../soporte-api` (Spring Boot, built by a delegated writer). Contract: GET/POST `http://localhost:8080/api/solicitudes`.
**TDD:** off (no project config); source: none. Runner for checks: `npm test` (vitest), `npm run lint` (oxlint), `npm run build`.
**Decisions:** `Resolver` is client-side only (contract has no PATCH). CORS via config in the API, not `@CrossOrigin`. Error classification in one service module.

## Tasks
- [x] T1 Scaffold Vite + axios + vitest + git (beb6680) — route: inline
- [x] T2 Pure logic: `filtrarSolicitudes` (estado + prioridad + texto accent-insensitive), `calcularIndicadores` + unit tests — route: inline (8 tests green)
- [x] T3 Service layer: `api.js`, `solicitudes.js`, error classification (`describirError`) + tests (15 tests green)
- [x] T4 Hook `useSolicitudes` (useEffect + AbortController, loading/error/retry, crear, resolver)
- [x] T5 Components (SolicitudCard, SolicitudForm, Filtros, Indicadores) + App + styles + component tests (22 tests, lint, build green)
- [x] T6 Integration with real backend, error-state evidence, README + REFLEXION.md (backend real: GET/POST/400/CORS OK; error state verified; evidence in evidencia/)
- [x] T7 Final checks: lint, test (24), build all green

## Evidence
(filled per task)

## Follow-up: persistent Resolver (user request)
- [x] T8 `env.example` (the `.env.example` name is blocked by tool permissions; user suggested a different name) — route: inline
- [x] T9 Resolver via `PATCH /solicitudes/{id}`: pessimistic update, in-flight disabled button, error banner, aria-label, "Resuelta" badge; 26 tests green — route: inline (frontend) + delegated writer (backend `soporte-api`, PATCH + GET by id + CORS PATCH)
- [x] T10 Browser verification with real backend: Resolver persisted (evidencia/05-resolver-persistente.jpg)
- [x] T11 Postman web GET 200 OK via Desktop Agent (evidencia/06-postman-get.jpg)

## Follow-up: guide compliance audit
- [x] T12 Microreto A as the guide states: Comenzar uses alert(), plus a second button with a different alert(); tests spy on window.alert (26 tests green)
