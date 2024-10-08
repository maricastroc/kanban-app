import { BoardColumnProps } from './board-column'

export interface BoardProps {
  id: number,
  name: string
  columns: BoardColumnProps[]
}
