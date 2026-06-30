import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getDueStatus, getDueLabel } from './getDueStatus'

// The timezone is pinned to UTC in vitest.setup.ts, so the system time below
// represents 2026-06-29 00:00 UTC as "today" after the function zeroes the hours.
describe('getDueStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-29T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns 'completed' when the task is marked complete, even past the due date", () => {
    expect(getDueStatus('2026-06-01', true)).toBe('completed')
  })

  it("returns 'overdue' for a past due date that isn't complete", () => {
    expect(getDueStatus('2026-06-28', false)).toBe('overdue')
  })

  it("returns 'due_soon' when the due date is today", () => {
    expect(getDueStatus('2026-06-29', false)).toBe('due_soon')
  })

  it("returns 'due_soon' when the due date is tomorrow", () => {
    expect(getDueStatus('2026-06-30', false)).toBe('due_soon')
  })

  it('returns an empty string when the due date is comfortably in the future', () => {
    expect(getDueStatus('2026-07-15', false)).toBe('')
  })

  it('accepts a Date instance as well as a string', () => {
    expect(getDueStatus(new Date('2026-06-29T00:00:00Z'), false)).toBe(
      'due_soon',
    )
  })

  it('does not mutate the Date instance passed by the caller', () => {
    const original = new Date('2026-06-29T15:30:00Z')
    const before = original.getTime()

    getDueStatus(original, false)

    // The function zeroes the hours internally; the caller's Date must be intact.
    expect(original.getTime()).toBe(before)
    expect(original.getUTCHours()).toBe(15)
  })
})

describe('getDueLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-29T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns 'Done' when the task is marked complete", () => {
    expect(getDueLabel('2026-06-01', true)).toBe('Done')
  })

  it("returns 'Overdue' for any past due date", () => {
    expect(getDueLabel('2026-06-28', false)).toBe('Overdue')
    expect(getDueLabel('2026-05-29', false)).toBe('Overdue')
  })

  it("returns 'Due today' when the due date is today", () => {
    expect(getDueLabel('2026-06-29', false)).toBe('Due today')
  })

  it("returns 'Due tomorrow' when the due date is tomorrow", () => {
    expect(getDueLabel('2026-06-30', false)).toBe('Due tomorrow')
  })

  it('returns an empty label for a date comfortably in the future', () => {
    expect(getDueLabel('2026-07-15', false)).toBe('')
  })
})
