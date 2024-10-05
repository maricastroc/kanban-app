import { useState, useRef, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BoardColumn } from '@/components/Core/BoardColumn'
import { Header } from '@/components/Core/Header'
import { AddColumnBtn, AddColumnContainer, ColumnsContainer, LayoutContainer, BoardContent, ShowSidebarBtn, Wrapper } from './styles'
import { BoardColumnProps } from '@/@types/board-column'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useTaskContext } from '@/contexts/TasksContext'
import { BREAKPOINT_SM } from '@/utils/constants'
import { Sidebar } from '@/components/Core/Sidebar'
import HideSidebar from '@/../public/icon-show-sidebar.svg'
import { useDragAndDropTask } from '@/utils/useDragAndDropTask'
import { useWindowResize } from '@/utils/useWindowResize'

interface HomeProps {
  onChangeTheme: () => void
}

export function Home({ onChangeTheme }: HomeProps) {
  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const { enableDarkMode, activeBoard } = useBoardsContext()

  const { moveTaskToColumn } = useTaskContext()

  const [columns, setColumns] = useState<BoardColumnProps[]>(activeBoard?.columns || [])

  const [hideSidebar, setHideSidebar] = useState(false)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM);

  const { handleDragAndDropTask } = useDragAndDropTask(
    activeBoard?.columns || [], 
    moveTaskToColumn
  );

  useEffect(() => {
    if (activeBoard?.columns) {
      setColumns(activeBoard.columns)
    }
  }, [activeBoard])

  return (
    <DndProvider backend={HTML5Backend}>
      <LayoutContainer>
      <BoardContent>
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
            className={`${hideSidebar && 'hide-sidebar-mode'}`}
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
        </BoardContent>
      </LayoutContainer>
    </DndProvider>
  )
}
