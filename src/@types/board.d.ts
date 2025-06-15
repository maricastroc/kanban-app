import { BoardColumnProps } from './board-column'

export interface BoardProps {
  uuid?: string
  id: string | null
  name: string
  columns: BoardColumnProps[]
}
