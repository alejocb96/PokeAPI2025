import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useClipboard } from '../useClipboard'

describe('useClipboard', () => {
  beforeEach(() => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve())
      }
    })
  })

  it('debería copiar texto al portapapeles', async () => {
    const { copyToClipboard, copied } = useClipboard()
    const text = 'Pikachu, #025, Electric'

    const result = await copyToClipboard(text)

    expect(result).toBe(true)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text)
  })

  it('debería establecer copied a true después de copiar', async () => {
    const { copyToClipboard, copied } = useClipboard()

    await copyToClipboard('test')

    expect(copied.value).toBe(true)
  })

  it('debería manejar errores al copiar', async () => {
    const { copyToClipboard, error } = useClipboard()

    // Mock error
    navigator.clipboard.writeText = vi.fn(() => Promise.reject(new Error('Failed')))

    const result = await copyToClipboard('test')

    expect(result).toBe(false)
    expect(error.value).toBeTruthy()
  })
})
