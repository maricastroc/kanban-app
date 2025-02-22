import { useState, useRef, useEffect, RefObject } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import * as Dialog from '@radix-ui/react-dialog'
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
import { useWindowResize } from '@/utils/useWindowResize'
import { useDragScroll } from '@/utils/useDragScroll'
import { ColumnFormModal } from '@/components/Modals/ColumnFormModal'
import { Loader } from '@/styles/shared'
import { Circles } from 'react-loader-spinner'
import useRequest from '@/utils/useRequest'
import { BoardProps } from '@/@types/board'

interface HomeProps {
  onChangeTheme: () => void
}

export default function Home({ onChangeTheme }: HomeProps) {
  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const { enableDarkMode, isLoading } = useBoardsContext()

  const { moveTaskToColumn, reorderTasksInColumn } = useTaskContext()

  const [hideSidebar, setHideSidebar] = useState(false)

  const [isColumnFormModalOpen, setIsColumnFormModalOpen] = useState(false)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  const { handleMouseDown, handleMouseMove, handleMouseUp } =
    useDragScroll(columnsContainerRef as RefObject<HTMLDivElement>)

  const handleContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement

    if (target.closest('.task-card') || target.closest('.modal')) {
      return
    }

    handleMouseDown(e)
  }

  const { data: activeBoard, mutate } =
    useRequest<BoardProps>({
      url: '/board',
      method: 'GET',
  })

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!activeBoard) {
      return
    }

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return
    }

    const sourceColumnIndex = parseInt(source.droppableId, 10)
    const destinationColumnIndex = parseInt(destination.droppableId, 10)

    const sourceColumn = activeBoard?.columns[sourceColumnIndex]
    const destinationColumn = activeBoard?.columns[destinationColumnIndex]

    const newSourceTasks = Array.from(sourceColumn.tasks)
    const [movedTask] = newSourceTasks.splice(source.index, 1)

    if (sourceColumnIndex === destinationColumnIndex) {
      newSourceTasks.splice(destination.index, 0, movedTask)

      const newColumns = [...activeBoard?.columns]

      reorderTasksInColumn(sourceColumnIndex, newSourceTasks)
      
      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: newSourceTasks,
      }
    } else {
      const newDestinationTasks = Array.from(destinationColumn.tasks)

      newDestinationTasks.splice(destination.index, 0, movedTask)

      const newColumns = [...activeBoard?.columns]

      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: newSourceTasks,
      }

      newColumns[destinationColumnIndex] = {
        ...destinationColumn,
        tasks: newDestinationTasks,
      }

      moveTaskToColumn(
        movedTask,
        destinationColumn.name,
        sourceColumn.name,
        destination.index,
      )
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal">
        {(provided) => (
          <LayoutContainer ref={provided.innerRef} {...provided.droppableProps}>
            <BoardContent>
              {!isSmallerThanSm && !hideSidebar && (
                <Sidebar
                  onClose={() => setHideSidebar(true)}
                  onChangeTheme={onChangeTheme}
                />
              )}
              <Wrapper>
                <Header onChangeTheme={onChangeTheme} mutate={mutate} />
                <ColumnsContainer
                  ref={columnsContainerRef}
                  onMouseDown={handleContainerMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onMouseMove={handleMouseMove}
                >
                  {activeBoard?.columns.map((column: BoardColumnProps, index: number) => (
                    <BoardColumn
                      id={column.id}
                      key={index}
                      name={column.name}
                      tasks={column.tasks}
                      index={index}
                    />
                  ))}
                  {activeBoard?.columns && activeBoard?.columns?.length < 6 && (
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
        )}
      </Droppable>

      {isLoading && (
        <Loader className="overlay">
          <Circles color="#635FC7" height={80} width={80} />
        </Loader>
      )}
    </DragDropContext>
  )
}
