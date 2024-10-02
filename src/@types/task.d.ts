import { SubtaskProps } from './subtask'

export interface TaskProps {
  title: string
  description: string
  status: string
  subtasks: SubtaskProps[]
}
