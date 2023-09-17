import { Header } from '@/components/Header'
import { Column } from '@/components/Column'
import {
  Container,
  ColumnsContainer,
  NewColumnContainer,
  NewColumnButton,
} from './styles'
import { useContext, useEffect, useState } from 'react'
import { BoardsContext } from '@/contexts/BoardsContext'
import { ColumnDTO } from '@/dtos/columnDTO'
import { BoardDTO } from '@/dtos/boardDTO'
import { getActiveStorageBoard } from '@/storage/boardsConfig'
import { AddColumnModal } from '@/modals/AddColumnModal'

export default function Home() {
  const { activeBoard } = useContext(BoardsContext)

  const [updatedBoard, setUpdatedBoard] = useState<BoardDTO>(activeBoard)

  const [openAddColumnModal, setOpenAddColumnModal] = useState(false)

  useEffect(() => {
    setUpdatedBoard(getActiveStorageBoard())
  }, [activeBoard])

  return (
    <Container suppressHydrationWarning>
      <Header />

      {openAddColumnModal && (
        <AddColumnModal onClose={() => setOpenAddColumnModal(false)} />
      )}

      <ColumnsContainer suppressHydrationWarning>
        {updatedBoard?.columns.map((column: ColumnDTO, index: number) => {
          return (
            <Column
              key={index}
              name={column.name}
              tasks={column.tasks}
              index={index}
            />
          )
        })}
        <NewColumnContainer onClick={() => setOpenAddColumnModal(true)}>
          <NewColumnButton>
            <h2>+ New Column</h2>
          </NewColumnButton>
        </NewColumnContainer>
      </ColumnsContainer>
    </Container>
  )
}
