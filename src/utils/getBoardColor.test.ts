import { describe, it, expect } from 'vitest'
import { getBoardColor } from './getBoardColor'

const PALETTE = [
  '#14B8A6',
  '#3B82F6',
  '#E8638F',
  '#E0A53B',
  '#8B5CF6',
  '#22C55E',
  '#F0795B',
  '#56C7E8',
]

describe('getBoardColor', () => {
  it('is deterministic for the same name', () => {
    expect(getBoardColor('Marketing')).toBe(getBoardColor('Marketing'))
  })

  it('always returns a color from the palette', () => {
    for (const name of ['', 'A', 'Platform', 'Design System', '123']) {
      expect(PALETTE).toContain(getBoardColor(name))
    }
  })

  it('maps a known name to its expected color', () => {
    // 'A' -> charCode 65, 65 % 8 = 1 -> PALETTE[1]
    expect(getBoardColor('A')).toBe('#3B82F6')
  })
})
