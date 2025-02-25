import { SubtaskProps } from './subtask'
import { TaskTagProps } from './task-tag'

export interface TaskProps {
  id: string
  column_index?: number
  title: string
  description: string
  status: string
  subtasks: SubtaskProps[]
  dueDate?: Date
  tags: TaskTagProps[]
}
