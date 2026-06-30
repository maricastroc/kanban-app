type Subtaskish = { is_completed: boolean }

// Always clone: `new Date(value)` copies a Date argument (and parses a string),
// so the setHours() below never mutates the caller's original Date.
const startOfDay = (value: string | Date): Date => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

const allSubtasksCompleted = (subtasks: Subtaskish[]): boolean =>
  subtasks.length > 0 && subtasks.every((st) => st.is_completed)

// Whole-day distance from today; negative when the date is already in the past.
const daysUntil = (date: string | Date): number => {
  const diff = startOfDay(date).getTime() - startOfDay(new Date()).getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const getDueStatus = (
  date: string | Date,
  subtasks: Subtaskish[],
): string => {
  if (allSubtasksCompleted(subtasks)) return 'completed'

  const days = daysUntil(date)

  if (days < 0) return 'overdue'
  if (days === 0 || days === 1) return 'due_soon'

  return ''
}

/**
 * A short, glanceable label for the due-date status chip ("Overdue", "Due
 * today", "Done"). Pairs with the chip colour so the meaning never rides on
 * colour alone. Returns '' for dates comfortably in the future, where the
 * formatted date already speaks for itself.
 */
export const getDueLabel = (
  date: string | Date,
  subtasks: Subtaskish[],
): string => {
  if (allSubtasksCompleted(subtasks)) return 'Done'

  const days = daysUntil(date)

  if (days < 0) return 'Overdue'
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'

  return ''
}
