import { TagProps } from './tag'

export interface TaskTagProps {
  id?: string
  tagId: string
  taskId: string
  tag: TagProps
  name: string
  color: string
}
