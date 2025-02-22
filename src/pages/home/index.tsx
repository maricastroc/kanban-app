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
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'
import { handleApiError } from '@/utils/handleApiError'

interface HomeProps {
  onChangeTheme: () => void
}

export default function Home({ onChangeTheme }: HomeProps) {
  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>()

  const [isLoading, setIsLoading] = useState(false)

  const { enableDarkMode } = useBoardsContext()

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

  const moveTaskToColumn = async (taskId: string, newColumnId: string, newOrder: number) => {
    try {
      setIsLoading(true)

      const payload = {
        taskId,
        newColumnId,
        newOrder
      }

      await api.put('/tasks/move', payload);

      mutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const reorderTaskInColumn = async (taskId: string, newOrder: number) => {
    try {
      setIsLoading(true)

      const payload = {
        taskId,
        newOrder
      }

      await api.put('/columns/move', payload);
      mutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (isLoading) {
      toast.error('Please wait until the current request is completed.')
      return 
    }

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
  
      const newColumns = [...activeBoard.columns]
      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: newSourceTasks,
      }

      setBoardColumns(newColumns)
  
      reorderTaskInColumn(movedTask?.id, destination?.index)
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

      setBoardColumns(newColumns)

      moveTaskToColumn(
        movedTask?.id,
        destinationColumn?.id,
        destination?.index,
      )
    }
  }

  useEffect(() => {
    if (activeBoard) {
      setBoardColumns(activeBoard.columns)
    }
  }, [activeBoard])

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
                  {boardColumns?.map((column: BoardColumnProps, index: number) => (
                    <BoardColumn
                      id={column.id}
                      key={index}
                      name={column.name}
                      tasks={column.tasks.map(task => ({
                        ...task,
                        isDragDisabled: isLoading
                      }))}
                      index={index}
                    />
                  ))}
                  {boardColumns && boardColumns?.length < 6 && (
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
    </DragDropContext>
  )
}
