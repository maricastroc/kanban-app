import { describe, it, expect } from 'vitest'
import { initialBoardColumns, initialSubtasks } from './getInitialValues'

describe('getInitialValues', () => {
  it('provides Todo and Doing columns with empty task lists and generated ids', () => {
    expect(initialBoardColumns.map((c) => c.name)).toEqual(['Todo', 'Doing'])

    for (const column of initialBoardColumns) {
      expect(column.tasks).toEqual([])
      expect(typeof column.id).toBe('string')
      expect(column.id).toBeTruthy()
    }
  })

  it('provides a single blank initial subtask', () => {
    expect(initialSubtasks).toHaveLength(1)
    expect(initialSubtasks[0]).toMatchObject({
      name: '',
      is_completed: false,
      order: 1,
    })
    expect(typeof initialSubtasks[0].id).toBe('string')
  })
})
