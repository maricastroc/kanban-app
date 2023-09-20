import { useEffect, useState, useRef } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { ColumnDTO } from '@/dtos/columnDTO'
import { BoardDTO } from '@/dtos/boardDTO'
import { getActiveStorageBoard } from '@/storage/boardsConfig'

import { AddColumn } from '@/modals/AddColumn'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { Column } from '@/components/Column'

import {
  Container,
  ColumnsContainer,
  NewColumnContainer,
  NewColumnButton,
  Wrapper,
  ShowSidebarButton,
} from './styles'

import HideSidebar from '@/../public/icon-show-sidebar.svg'

export default function Home() {
  const { activeBoard } = useBoardsContext()

  const [isMobile, setIsMobile] = useState(true)
  const [updatedBoard, setUpdatedBoard] = useState<BoardDTO>(activeBoard)
  const [openAddColumn, setOpenAddColumn] = useState(false)

  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState<number | null>(null)
  const [scrollLeft, setScrollLeft] = useState<number | null>(null)

  const [hideSidebar, setHideSidebar] = useState(false)

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

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Container>
      <Header />
      {openAddColumn && <AddColumn onClose={() => setOpenAddColumn(false)} />}
      <Wrapper>
        {!isMobile && !hideSidebar && (
          <Sidebar onClose={() => setHideSidebar(true)} />
        )}
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
      </Wrapper>
      {hideSidebar && (
        <ShowSidebarButton onClick={() => setHideSidebar(false)}>
          <img src={HideSidebar} alt="" />
        </ShowSidebarButton>
      )}
    </Container>
  )
}
