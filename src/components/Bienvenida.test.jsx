import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Bienvenida from './Bienvenida'

describe('Bienvenida', () => {
  it('lists the support categories', () => {
    render(<Bienvenida />)
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Hardware',
      'Software',
      'Redes',
    ])
  })

  it('shows a greeting after clicking Comenzar', async () => {
    render(<Bienvenida />)
    await userEvent.click(screen.getByRole('button', { name: 'Comenzar' }))
    expect(screen.getByRole('status')).toHaveTextContent('Bienvenido a React')
  })
})
