import { TaskProps } from './task'

export interface BoardColumnProps {
  uuid?: string
  id: string | number | null
  name: string
  tasks: TaskProps[]
}
