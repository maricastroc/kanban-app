import { useState, useRef, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BoardColumn } from '@/components/Core/BoardColumn'
import { Header } from '@/components/Core/Header'
import { AddColumnBtn, AddColumnContainer, ColumnsContainer, Container, HomeContent, ShowSidebarBtn, Wrapper } from './styles'
import { BoardColumnProps } from '@/@types/board-column'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { TaskProps } from '@/@types/task'
import { useTaskContext } from '@/contexts/TasksContext'
import { BREAKPOINT_SM } from '@/utils/constants'
import { Sidebar } from '@/components/Core/Sidebar'
import HideSidebar from '@/../public/icon-show-sidebar.svg'

interface HomeProps {
  onChangeTheme: () => void
}

export function Home({ onChangeTheme }: HomeProps) {
  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const { enableDarkMode, activeBoard } = useBoardsContext()

  const { moveTaskToColumn } = useTaskContext()

  const [columns, setColumns] = useState<BoardColumnProps[]>(activeBoard?.columns || [])

  const [isDragging, setIsDragging] = useState(false)

  const [startX, setStartX] = useState<number | null>(null)

  const [scrollLeft, setScrollLeft] = useState<number | null>(null)

  const [isSmallerThanSm, setIsSmallerThanSm] = useState(false)

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

  const handleDragAndDropTask = (
    task: TaskProps,
    previousName: string,
    name: string,
    newColumnIndex: number
  ) => {
    const columnIndex = task.column_index;
  
    if (columnIndex !== undefined) {
      setColumns((prevColumns) => {
        const sourceColumn = prevColumns[columnIndex];
        const targetColumn = prevColumns[newColumnIndex];
  
        const updatedSourceColumnTasks = sourceColumn.tasks.filter(
          (t) => t.title !== task.title
        );
  
        const updatedTargetColumnTasks = [...targetColumn.tasks, task];
  
        const updatedColumns = prevColumns.map((column, index) => {
          if (index === columnIndex) {
            return { ...column, tasks: updatedSourceColumnTasks };
          } else if (index === newColumnIndex) {
            return { ...column, tasks: updatedTargetColumnTasks };
          }
          return column;
        });
  
        moveTaskToColumn(task, name, previousName);
  
        return updatedColumns;
      });
    }
  }

  useEffect(() => {
    function handleResize() {
      setIsSmallerThanSm(window.innerWidth <= BREAKPOINT_SM)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (activeBoard?.columns) {
      setColumns(activeBoard.columns)
    }
  }, [activeBoard])

  console.log(activeBoard, columns)

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
      <HomeContent>
      {!isSmallerThanSm && !hideSidebar && (
            <Sidebar
              onClose={() => setHideSidebar(true)}
              onChangeTheme={onChangeTheme}
            />
          )}
        <Wrapper>
          <Header onChangeTheme={onChangeTheme} />
          <ColumnsContainer
            ref={columnsContainerRef}
            className={`hand-cursor ${hideSidebar && 'hide-sidebar-mode'}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {columns.map((column: BoardColumnProps, index: number) => (
              <BoardColumn
                key={index}
                name={column.name}
                tasks={column.tasks}
                index={index}
                handleDragAndDropTask={handleDragAndDropTask}
              />
            ))}
            <AddColumnContainer className={enableDarkMode ? 'light' : 'dark'}>
              <AddColumnBtn>+ New Column</AddColumnBtn>
            </AddColumnContainer>
          </ColumnsContainer>
        </Wrapper>
        {hideSidebar && (
          <ShowSidebarBtn onClick={() => setHideSidebar(false)}>
            <img src={HideSidebar} alt="" />
          </ShowSidebarBtn>
        )}
        </HomeContent>
      </Container>
    </DndProvider>
  )
}
