import { Header } from '@/components/Header'
import { Column } from '@/components/Column'
import {
  Container,
  ColumnsContainer,
  NewColumnContainer,
  NewColumnButton,
} from './styles'
import { useContext, useEffect, useState, useRef } from 'react'
import { BoardsContext } from '@/contexts/BoardsContext'
import { ColumnDTO } from '@/dtos/columnDTO'
import { BoardDTO } from '@/dtos/boardDTO'
import { getActiveStorageBoard } from '@/storage/boardsConfig'
import { AddColumn } from '@/modals/AddColumn'

export default function Home() {
  const { activeBoard } = useContext(BoardsContext)
  const [updatedBoard, setUpdatedBoard] = useState<BoardDTO>(activeBoard)
  const [openAddColumn, setOpenAddColumn] = useState(false)

  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState<number | null>(null)
  const [scrollLeft, setScrollLeft] = useState<number | null>(null)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    const container = columnsContainerRef.current

    if (container) {
      container.classList.add('hand-cursor')
      setStartX(e.pageX - container.offsetLeft)
      setScrollLeft(container.scrollLeft)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const container = columnsContainerRef.current

    if (container && startX !== null && scrollLeft !== null) {
      const x = e.pageX - container.offsetLeft
      const walk = (x - startX) * 1
      container.scrollLeft = scrollLeft - walk
    }
  }

  useEffect(() => {
    setUpdatedBoard(getActiveStorageBoard())
  }, [activeBoard])

  return (
    <Container>
      <Header />
      {openAddColumn && <AddColumn onClose={() => setOpenAddColumn(false)} />}
      <ColumnsContainer
        ref={columnsContainerRef}
        className="hand-cursor"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {updatedBoard?.columns.map((column: ColumnDTO, index: number) => (
          <Column
            key={index}
            name={column.name}
            tasks={column.tasks}
            index={index}
          />
        ))}
        <NewColumnContainer onClick={() => setOpenAddColumn(true)}>
          <NewColumnButton>
            <h2>+ New Column</h2>
          </NewColumnButton>
        </NewColumnContainer>
      </ColumnsContainer>
    </Container>
  )
}
