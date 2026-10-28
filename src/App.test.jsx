import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import * as servicio from './services/solicitudes'

vi.mock('./services/solicitudes', async (importOriginal) => ({
  ...(await importOriginal()),
  listarSolicitudes: vi.fn(),
  crearSolicitud: vi.fn(),
  actualizarEstado: vi.fn(),
}))

const datos = [
  { id: 1, titulo: 'Equipo no enciende', prioridad: 'Alta', estado: 'Pendiente' },
  { id: 2, titulo: 'Instalar software', prioridad: 'Media', estado: 'En proceso' },
]

beforeEach(() => {
  vi.resetAllMocks()
})

describe('App', () => {
  it('shows the loading state and then the requests', async () => {
    servicio.listarSolicitudes.mockResolvedValue(datos)
    render(<App />)

    expect(screen.getByText('Cargando solicitudes...')).toBeInTheDocument()
    expect(await screen.findByText('Equipo no enciende')).toBeInTheDocument()
    expect(screen.getByText('Instalar software')).toBeInTheDocument()
  })

  it('shows an error with a retry button that recovers', async () => {
    const user = userEvent.setup()
    const fallo = Object.assign(new Error('network'), { code: 'ERR_NETWORK' })
    servicio.listarSolicitudes.mockRejectedValueOnce(fallo).mockResolvedValueOnce(datos)
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/No hay conexión/)
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('Equipo no enciende')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows an empty state when the API returns no requests', async () => {
    servicio.listarSolicitudes.mockResolvedValue([])
    render(<App />)
    expect(await screen.findByText('No hay solicitudes registradas.')).toBeInTheDocument()
  })

  it('resolves a request through the API and updates the counters', async () => {
    const user = userEvent.setup()
    servicio.listarSolicitudes.mockResolvedValue(datos)
    servicio.actualizarEstado.mockResolvedValue({ ...datos[0], estado: 'Resuelta' })
    render(<App />)
    await screen.findByText('Equipo no enciende')

    const indicadores = screen.getByRole('region', { name: 'Indicadores operativos' })
    expect(within(indicadores).getByText(/Pendientes/)).toHaveTextContent('1')

    await user.click(screen.getByRole('button', { name: 'Resolver solicitud: Equipo no enciende' }))

    expect(servicio.actualizarEstado).toHaveBeenCalledWith(1, 'Resuelta')
    expect(await screen.findByText('✓ Resuelta')).toBeInTheDocument()
    expect(within(indicadores).getByText(/Pendientes/)).toHaveTextContent('0')
    expect(within(indicadores).getByText(/Resueltas/)).toHaveTextContent('1')
  })

  it('disables the button while the request is in flight', async () => {
    const user = userEvent.setup()
    let terminar
    servicio.listarSolicitudes.mockResolvedValue(datos)
    servicio.actualizarEstado.mockReturnValue(new Promise((resolve) => (terminar = resolve)))
    render(<App />)
    await screen.findByText('Equipo no enciende')

    const boton = screen.getByRole('button', { name: 'Resolver solicitud: Equipo no enciende' })
    await user.click(boton)

    expect(boton).toBeDisabled()
    expect(boton).toHaveTextContent('Resolviendo...')

    terminar({ ...datos[0], estado: 'Resuelta' })
    expect(await screen.findByText('✓ Resuelta')).toBeInTheDocument()
  })

  it('keeps the request unresolved and shows an error when the PATCH fails', async () => {
    const user = userEvent.setup()
    servicio.listarSolicitudes.mockResolvedValue(datos)
    servicio.actualizarEstado.mockRejectedValue({ response: { status: 404 } })
    render(<App />)
    await screen.findByText('Equipo no enciende')

    await user.click(screen.getByRole('button', { name: 'Resolver solicitud: Equipo no enciende' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/404/)
    expect(screen.queryByText('✓ Resuelta')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resolver solicitud: Equipo no enciende' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('combines the search text with the estado filter', async () => {
    const user = userEvent.setup()
    servicio.listarSolicitudes.mockResolvedValue(datos)
    render(<App />)
    await screen.findByText('Equipo no enciende')

    await user.selectOptions(screen.getByLabelText('Filtrar por estado'), 'En proceso')
    expect(screen.queryByText('Equipo no enciende')).not.toBeInTheDocument()

    await user.type(screen.getByLabelText('Buscar'), 'zzz')
    expect(screen.getByText(/No hay resultados/)).toBeInTheDocument()
  })

  it('creates a request through the API and lists it', async () => {
    const user = userEvent.setup()
    servicio.listarSolicitudes.mockResolvedValue(datos)
    servicio.crearSolicitud.mockResolvedValue({
      id: 3,
      titulo: 'Wifi caído',
      prioridad: 'Baja',
      estado: 'Pendiente',
    })
    render(<App />)
    await screen.findByText('Equipo no enciende')

    await user.type(screen.getByLabelText('Descripción'), '  Wifi caído ')
    await user.selectOptions(screen.getByLabelText('Prioridad'), 'Baja')
    await user.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(servicio.crearSolicitud).toHaveBeenCalledWith({ titulo: 'Wifi caído', prioridad: 'Baja' })
    expect(await screen.findByText('Wifi caído')).toBeInTheDocument()
  })

  it('rejects a blank description without calling the API', async () => {
    const user = userEvent.setup()
    servicio.listarSolicitudes.mockResolvedValue(datos)
    render(<App />)
    await screen.findByText('Equipo no enciende')

    await user.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Escribe una descripción')
    expect(servicio.crearSolicitud).not.toHaveBeenCalled()
  })
})
