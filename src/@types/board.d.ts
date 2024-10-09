import { BoardColumnProps } from './board-column'

export interface BoardProps {
  id: string
  name: string
  columns: BoardColumnProps[]
}
