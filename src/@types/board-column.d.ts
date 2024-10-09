import { TaskProps } from './task'

export interface BoardColumnProps {
  id: number
  name: string
  tasks: TaskProps[]
}
