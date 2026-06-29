import { BoardColumnProps } from '@/@types/board-column'
import { TaskProps } from '@/@types/task'

export type SortKey = 'manual' | 'due' | 'name'

export interface BoardFilters {
  search: string
  tags: string[]
  sortBy: SortKey
}

export const isBoardFiltered = (filters: BoardFilters): boolean =>
  filters.search.trim() !== '' ||
  filters.tags.length > 0 ||
  filters.sortBy !== 'manual'

const matchesSearch = (task: TaskProps, search: string): boolean => {
  const term = search.trim().toLowerCase()
  if (!term) return true
  return task.name?.toLowerCase().includes(term)
}

const matchesTags = (task: TaskProps, tags: string[]): boolean => {
  if (tags.length === 0) return true
  return Boolean(task.tags?.some((tag) => tags.includes(tag.name)))
}

const sortTasks = (tasks: TaskProps[], sortBy: SortKey): TaskProps[] => {
  if (sortBy === 'manual') return tasks

  const sorted = [...tasks]

  if (sortBy === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name))
  }

  if (sortBy === 'due') {
    sorted.sort((a, b) => {
      const aTime = a.due_date ? new Date(a.due_date).getTime() : Infinity
      const bTime = b.due_date ? new Date(b.due_date).getTime() : Infinity
      return aTime - bTime
    })
  }

  return sorted
}

/**
 * Returns a view of the board columns with search/tag filters and sorting
 * applied to each column's tasks. The original columns array is never mutated.
 */
export const filterBoardColumns = (
  columns: BoardColumnProps[] | undefined,
  filters: BoardFilters,
): BoardColumnProps[] | undefined => {
  if (!columns) return columns
  if (!isBoardFiltered(filters)) return columns

  return columns.map((column) => {
    const visibleTasks = column.tasks.filter(
      (task) =>
        matchesSearch(task, filters.search) && matchesTags(task, filters.tags),
    )

    return {
      ...column,
      tasks: sortTasks(visibleTasks, filters.sortBy),
    }
  })
}
