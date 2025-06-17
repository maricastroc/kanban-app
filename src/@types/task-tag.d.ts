import { TagProps } from './tag'

export interface TaskTagProps {
  id: string | number | null
  tagId?: string
  taskId?: string
  tag?: TagProps
  name: string
  color: string
}
