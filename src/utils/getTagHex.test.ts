import { describe, it, expect } from 'vitest'
import { getTagHex } from './getTagHex'

describe('getTagHex', () => {
  it('resolves a known color name to its hex value', () => {
    expect(getTagHex('Aqua Blue')).toBe('#4FC4DA')
    expect(getTagHex('Rose Red')).toBe('#DD7A93')
  })

  it('falls back to neutral gray for an unknown name', () => {
    expect(getTagHex('Not A Color')).toBe('#8A8E98')
  })

  it('respects a custom fallback', () => {
    expect(getTagHex('Not A Color', '#000000')).toBe('#000000')
  })
})
