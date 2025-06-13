export const getDueStatus = (
  date: string | Date,
  subtasks: { is_completed: boolean }[],
): string => {
  const parsedDate = date instanceof Date ? date : new Date(date)
  const today = new Date()

  today.setHours(0, 0, 0, 0)
  parsedDate.setHours(0, 0, 0, 0)

  const allSubtasksCompleted =
    subtasks.length > 0 && subtasks.every((st) => st.is_completed)

  if (allSubtasksCompleted) return 'completed'

  const diffInDays = Math.ceil(
    (parsedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffInDays < 0) return 'overdue'
  if (diffInDays === 1 || diffInDays === 0) return 'due_soon'

  return ''
}
