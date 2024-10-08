import { SubtaskProps } from './subtask'

export interface TaskProps {
  id: number,
  column_index?: number
  title: string
  description: string
  status: string
  subtasks: SubtaskProps[]
}
