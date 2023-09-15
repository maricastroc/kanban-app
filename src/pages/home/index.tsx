import { Header } from '../../components/Header'
import { Column } from '../../components/Column'
import {
  Container,
  ColumnsContainer,
  NewColumnContainer,
  NewColumnButton,
} from './styles'
import { useContext } from 'react'
import { BoardsContext } from '../../contexts/BoardsContext'
import { ColumnDTO } from '../../dtos/columnDTO'

export default function Home() {
  const { activeBoard } = useContext(BoardsContext)

  return (
    <Container suppressHydrationWarning>
      <Header />
      <ColumnsContainer suppressHydrationWarning>
        {activeBoard?.columns.map((column: ColumnDTO, index: number) => {
          return (
            <Column
              key={index}
              name={column.name}
              tasks={column.tasks}
              index={index}
            />
          )
        })}
        <NewColumnContainer>
          <NewColumnButton>
            <h2>+ New Column</h2>
          </NewColumnButton>
        </NewColumnContainer>
      </ColumnsContainer>
    </Container>
  )
}
