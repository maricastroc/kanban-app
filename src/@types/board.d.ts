import { BoardColumnProps } from './board-column'

export interface BoardProps {
  uuid?: string
  id: string
  name: string
  columns: BoardColumnProps[]
}
