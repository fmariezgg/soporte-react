import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Bienvenida from './Bienvenida'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Bienvenida', () => {
  it('lists the support categories', () => {
    render(<Bienvenida />)
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Hardware',
      'Software',
      'Redes',
    ])
  })

  it('shows a different alert for each button', async () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<Bienvenida />)

    await userEvent.click(screen.getByRole('button', { name: 'Comenzar' }))
    expect(alerta).toHaveBeenLastCalledWith('Bienvenido a React')

    await userEvent.click(screen.getByRole('button', { name: 'Ver categorías' }))
    expect(alerta).toHaveBeenLastCalledWith('Categorías de soporte: Hardware, Software, Redes')
  })
})
