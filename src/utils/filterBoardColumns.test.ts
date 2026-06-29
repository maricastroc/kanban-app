import { describe, it, expect } from 'vitest'
import {
  filterBoardColumns,
  isBoardFiltered,
  type BoardFilters,
} from './filterBoardColumns'
import type { TaskProps } from '@/@types/task'
import type { BoardColumnProps } from '@/@types/board-column'

const noFilters: BoardFilters = { search: '', tags: [], sortBy: 'manual' }

const makeTask = (overrides: Partial<TaskProps> = {}): TaskProps => ({
  id: Math.random(),
  name: 'Task',
  status: 'Todo',
  subtasks: [],
  ...overrides,
})

const makeColumn = (name: string, tasks: TaskProps[]): BoardColumnProps => ({
  id: name,
  name,
  tasks,
})

describe('isBoardFiltered', () => {
  it('is false for the default (manual, no search, no tags) state', () => {
    expect(isBoardFiltered(noFilters)).toBe(false)
  })

  it('is true when a search term is present', () => {
    expect(isBoardFiltered({ ...noFilters, search: 'abc' })).toBe(true)
  })

  it('is true when tags are selected', () => {
    expect(isBoardFiltered({ ...noFilters, tags: ['Bug'] })).toBe(true)
  })

  it('is true when sorting is not manual', () => {
    expect(isBoardFiltered({ ...noFilters, sortBy: 'name' })).toBe(true)
  })
})

describe('filterBoardColumns', () => {
  it('returns undefined unchanged', () => {
    expect(filterBoardColumns(undefined, noFilters)).toBeUndefined()
  })

  it('returns the same reference when no filters are active (no-op)', () => {
    const columns = [makeColumn('Todo', [makeTask()])]
    expect(filterBoardColumns(columns, noFilters)).toBe(columns)
  })

  it('filters tasks by a case-insensitive, trimmed search term', () => {
    const columns = [
      makeColumn('Todo', [
        makeTask({ name: 'Write report' }),
        makeTask({ name: 'Buy milk' }),
      ]),
    ]
    const result = filterBoardColumns(columns, {
      ...noFilters,
      search: '  REPORT ',
    })
    expect(result?.[0].tasks.map((t) => t.name)).toEqual(['Write report'])
  })

  it('filters tasks by tag, matching any selected tag', () => {
    const columns = [
      makeColumn('Todo', [
        makeTask({ name: 'A', tags: [{ id: 1, name: 'Bug', color: '#fff' }] }),
        makeTask({
          name: 'B',
          tags: [{ id: 2, name: 'Feature', color: '#000' }],
        }),
      ]),
    ]
    const result = filterBoardColumns(columns, { ...noFilters, tags: ['Bug'] })
    expect(result?.[0].tasks.map((t) => t.name)).toEqual(['A'])
  })

  it('sorts by name', () => {
    const columns = [
      makeColumn('Todo', [
        makeTask({ name: 'Banana' }),
        makeTask({ name: 'Apple' }),
        makeTask({ name: 'Cherry' }),
      ]),
    ]
    const result = filterBoardColumns(columns, { ...noFilters, sortBy: 'name' })
    expect(result?.[0].tasks.map((t) => t.name)).toEqual([
      'Apple',
      'Banana',
      'Cherry',
    ])
  })

  it('sorts by due date, pushing tasks without a date to the end', () => {
    const columns = [
      makeColumn('Todo', [
        makeTask({ name: 'no-date' }),
        makeTask({ name: 'later', due_date: new Date('2026-12-01') }),
        makeTask({ name: 'sooner', due_date: new Date('2026-01-01') }),
      ]),
    ]
    const result = filterBoardColumns(columns, { ...noFilters, sortBy: 'due' })
    expect(result?.[0].tasks.map((t) => t.name)).toEqual([
      'sooner',
      'later',
      'no-date',
    ])
  })

  it('does not mutate the original columns order', () => {
    const tasks = [makeTask({ name: 'B' }), makeTask({ name: 'A' })]
    const columns = [makeColumn('Todo', tasks)]
    filterBoardColumns(columns, { ...noFilters, sortBy: 'name' })
    expect(columns[0].tasks.map((t) => t.name)).toEqual(['B', 'A'])
  })
})
