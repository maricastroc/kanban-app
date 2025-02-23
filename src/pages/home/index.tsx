import { useState, useRef, useEffect, RefObject } from 'react'
import { NextSeo } from 'next-seo'
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
import { BREAKPOINT_SM } from '@/utils/constants'
import { Sidebar } from '@/components/Core/Sidebar'
import HideSidebar from '@/../public/icon-show-sidebar.svg'
import { useWindowResize } from '@/utils/useWindowResize'
import { ColumnFormModal } from '@/components/Modals/ColumnFormModal'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useTheme } from '@/contexts/ThemeContext'
import Image from 'next/image'
import { EmptyContainer } from '@/components/Shared/EmptyContainer'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useDragScroll } from '@/utils/useDragScroll'

export default function Home() {
  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const { status } = useSession()

  const { isLoading, activeBoard, boards, mutate } = useBoardsContext()

  const { handleMouseMove, handleMouseUp, handleContainerMouseDown } =
    useDragScroll(columnsContainerRef as RefObject<HTMLDivElement>)

  const router = useRouter()

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>()

  const [isReordering, setIsReordering] = useState(false)

  const { enableDarkMode } = useTheme()

  const [hideSidebar, setHideSidebar] = useState(false)

  const [isColumnFormModalOpen, setIsColumnFormModalOpen] = useState(false)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  const moveTaskToColumn = async (
    taskId: string,
    newColumnId: string,
    newOrder: number,
  ) => {
    try {
      setIsReordering(true)

      const payload = {
        taskId,
        newColumnId,
        newOrder,
      }

      await api.put('/tasks/reorder', payload)

      mutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsReordering(false)
    }
  }

  const reorderTaskInColumn = async (taskId: string, newOrder: number) => {
    try {
      const payload = {
        taskId,
        newOrder,
      }

      await api.put('/columns/reorder', payload)
      mutate()
    } catch (error) {
      handleApiError(error)
    }
  }

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

      moveTaskToColumn(movedTask?.id, destinationColumn?.id, destination?.index)
    }
  }

  useEffect(() => {
    if (activeBoard) {
      setBoardColumns(activeBoard.columns)
    }
  }, [activeBoard])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  return (
    <>
      <NextSeo title="Kanban App | Dashboard" />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal">
          {(provided) => (
            <LayoutContainer
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <BoardContent>
                {!isSmallerThanSm && !hideSidebar && (
                  <Sidebar onClose={() => setHideSidebar(true)} />
                )}
                <Wrapper>
                  <Header />
                  <ColumnsContainer
                    ref={columnsContainerRef}
                    onMouseDown={handleContainerMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                  >
                    {activeBoard ? (
                      <>
                        {boardColumns?.map(
                          (column: BoardColumnProps, index: number) => (
                            <BoardColumn
                              id={column.id}
                              column={column}
                              key={index}
                              name={column.name}
                              tasks={column.tasks.map((task) => ({
                                ...task,
                                isDragDisabled: isLoading,
                              }))}
                              index={index}
                            />
                          ),
                        )}

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
                      </>
                    ) : (
                      boards && <EmptyContainer />
                    )}
                  </ColumnsContainer>
                </Wrapper>
                {hideSidebar && (
                  <ShowSidebarBtn onClick={() => setHideSidebar(false)}>
                    <Image src={HideSidebar} alt="" />
                  </ShowSidebarBtn>
                )}
              </BoardContent>
            </LayoutContainer>
          )}
        </Droppable>

        {(isLoading || isReordering || !boards) && <LoadingComponent />}
      </DragDropContext>
    </>
  )
}
