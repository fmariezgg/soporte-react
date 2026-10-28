import { describe, expect, it } from 'vitest'
import { describirError, esCancelacion } from './solicitudes'

describe('describirError', () => {
  it('reports 404 as a missing resource', () => {
    expect(describirError({ response: { status: 404 } })).toMatch(/404/)
  })

  it('reports 5xx as a server failure', () => {
    expect(describirError({ response: { status: 503 } })).toMatch(/servidor falló \(503\)/)
  })

  it('shows validation messages for a 400', () => {
    const err = { response: { status: 400, data: { messages: ['titulo: requerido'] } } }
    expect(describirError(err)).toMatch(/titulo: requerido/)
  })

  it('reports timeouts', () => {
    expect(describirError({ code: 'ECONNABORTED' })).toMatch(/timeout/)
  })

  it('reports network errors (down server or CORS)', () => {
    expect(describirError({ code: 'ERR_NETWORK' })).toMatch(/CORS/)
  })

  it('falls back to a generic message', () => {
    expect(describirError(new Error('boom'))).toMatch(/No fue posible/)
  })
})

describe('esCancelacion', () => {
  it('detects aborted requests', () => {
    expect(esCancelacion({ code: 'ERR_CANCELED' })).toBe(true)
    expect(esCancelacion({ code: 'ERR_NETWORK' })).toBe(false)
  })
})
