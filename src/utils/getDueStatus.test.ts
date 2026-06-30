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

  const incomplete = [{ is_completed: false }]
  const completed = [{ is_completed: true }, { is_completed: true }]

  it("returns 'completed' when every subtask is done, even past the due date", () => {
    expect(getDueStatus('2026-06-01', completed)).toBe('completed')
  })

  it('does not treat an empty subtask list as completed', () => {
    expect(getDueStatus('2026-06-28', [])).toBe('overdue')
  })

  it("returns 'overdue' for a past due date", () => {
    expect(getDueStatus('2026-06-28', incomplete)).toBe('overdue')
  })

  it("returns 'due_soon' when the due date is today", () => {
    expect(getDueStatus('2026-06-29', incomplete)).toBe('due_soon')
  })

  it("returns 'due_soon' when the due date is tomorrow", () => {
    expect(getDueStatus('2026-06-30', incomplete)).toBe('due_soon')
  })

  it('returns an empty string when the due date is comfortably in the future', () => {
    expect(getDueStatus('2026-07-15', incomplete)).toBe('')
  })

  it('accepts a Date instance as well as a string', () => {
    expect(getDueStatus(new Date('2026-06-29T00:00:00Z'), incomplete)).toBe(
      'due_soon',
    )
  })

  it('does not mutate the Date instance passed by the caller', () => {
    const original = new Date('2026-06-29T15:30:00Z')
    const before = original.getTime()

    getDueStatus(original, incomplete)

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

  const incomplete = [{ is_completed: false }]
  const completed = [{ is_completed: true }, { is_completed: true }]

  it("returns 'Done' when every subtask is completed", () => {
    expect(getDueLabel('2026-06-01', completed)).toBe('Done')
  })

  it("returns 'Overdue' for any past due date", () => {
    expect(getDueLabel('2026-06-28', incomplete)).toBe('Overdue')
    expect(getDueLabel('2026-05-29', incomplete)).toBe('Overdue')
  })

  it("returns 'Due today' when the due date is today", () => {
    expect(getDueLabel('2026-06-29', incomplete)).toBe('Due today')
  })

  it("returns 'Due tomorrow' when the due date is tomorrow", () => {
    expect(getDueLabel('2026-06-30', incomplete)).toBe('Due tomorrow')
  })

  it('returns an empty label for a date comfortably in the future', () => {
    expect(getDueLabel('2026-07-15', incomplete)).toBe('')
  })
})
