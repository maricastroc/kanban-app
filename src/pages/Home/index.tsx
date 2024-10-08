import { useState, useRef, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import * as Dialog from '@radix-ui/react-dialog'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BoardColumn } from '@/components/Core/BoardColumn'
import { Header } from '@/components/Core/Header'
import {
  AddColumnBtn,
  AddColumnContainer,
  ColumnsContainer,
  LayoutContainer,
  BoardContent,
  ShowSidebarBtn,
  Wrapper,
} from './styles'
import { BoardColumnProps } from '@/@types/board-column'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useTaskContext } from '@/contexts/TasksContext'
import { BREAKPOINT_SM } from '@/utils/constants'
import { Sidebar } from '@/components/Core/Sidebar'
import HideSidebar from '@/../public/icon-show-sidebar.svg'
import { useDragAndDropTask } from '@/utils/useDragAndDropTask'
import { useWindowResize } from '@/utils/useWindowResize'
import { useDragScroll } from '@/utils/useDragScroll'
import { ColumnFormModal } from '@/components/Modals/ColumnFormModal'

interface HomeProps {
  onChangeTheme: () => void
}

export function Home({ onChangeTheme }: HomeProps) {
  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const { enableDarkMode, activeBoard } = useBoardsContext()

  const { moveTaskToColumn } = useTaskContext()

  const [columns, setColumns] = useState<BoardColumnProps[]>(
    activeBoard?.columns || [],
  )

  const [hideSidebar, setHideSidebar] = useState(false)

  const [isColumnFormModalOpen, setIsColumnFormModalOpen] = useState(false)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  const { handleMouseDown, handleMouseMove, handleMouseUp } =
    useDragScroll(columnsContainerRef)

  const { handleDragAndDropTask } = useDragAndDropTask(
    activeBoard?.columns || [],
    moveTaskToColumn,
  )

  useEffect(() => {
    if (activeBoard?.columns) {
      setColumns(activeBoard.columns)
    }
  }, [activeBoard])

  const handleContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement

    if (target.closest('.task-card') || target.closest('.modal')) {
      return
    }

    handleMouseDown(e)
  }

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
              onMouseDown={handleContainerMouseDown} // Usa a função personalizada
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {columns.map((column: BoardColumnProps, index: number) => (
                <BoardColumn
                  id={column.id}
                  key={index}
                  name={column.name}
                  tasks={column.tasks}
                  index={index}
                  handleDragAndDropTask={handleDragAndDropTask}
                />
              ))}
              {(activeBoard?.columns && activeBoard?.columns?.length < 6) && (
                <Dialog.Root open={isColumnFormModalOpen}>
                <Dialog.Trigger asChild>
                  <AddColumnContainer
                    className={enableDarkMode ? 'dark' : 'light'}
                    onClick={() => setIsColumnFormModalOpen(true)}
                  >
                    <AddColumnBtn>+ New Column</AddColumnBtn>
                  </AddColumnContainer>
                </Dialog.Trigger>
                {isColumnFormModalOpen && (
                  <ColumnFormModal
                    onClose={() => setIsColumnFormModalOpen(false)}
                  />
                )}
              </Dialog.Root>
              )}
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
