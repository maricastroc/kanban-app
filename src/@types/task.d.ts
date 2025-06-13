import { SubtaskProps } from './subtask'
import { TaskTagProps } from './task-tag'

export interface TaskProps {
  uuid?: string
  id?: string | number
  column_index?: number
  name: string
  description?: string
  status: string
  subtasks: SubtaskProps[]
  dueDate?: Date
  tags?: TaskTagProps[]
}
