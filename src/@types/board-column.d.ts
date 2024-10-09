import { TaskProps } from './task'

export interface BoardColumnProps {
  id: string
  name: string
  tasks: TaskProps[]
}
