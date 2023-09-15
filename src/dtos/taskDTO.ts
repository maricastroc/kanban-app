import { SubtaskDTO } from './subtaskDTO'

export interface TaskDTO {
  title: string
  description: string
  status: string
  subtasks: SubtaskDTO[]
}
