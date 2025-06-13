import { TaskProps } from './task'

export interface BoardColumnProps {
  uuid?: string
  id: string | number
  name: string
  tasks: TaskProps[]
}
