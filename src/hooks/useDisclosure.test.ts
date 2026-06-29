import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDisclosure } from './useDisclosure'

describe('useDisclosure', () => {
  it('defaults to closed', () => {
    const { result } = renderHook(() => useDisclosure())
    expect(result.current.isOpen).toBe(false)
  })

  it('respects the initial value', () => {
    const { result } = renderHook(() => useDisclosure(true))
    expect(result.current.isOpen).toBe(true)
  })

  it('open() and close() set the state explicitly', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
  })

  it('toggle() flips the state', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
  })

  it('exposes setIsOpen for controlled usage', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => result.current.setIsOpen(true))
    expect(result.current.isOpen).toBe(true)
  })
})
