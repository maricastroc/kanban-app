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
import HideSidebar from '../../../public/icon-show-sidebar.svg'
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
import { getToken } from "next-auth/jwt"
import { TaskProps } from '@/@types/task'
import toast from 'react-hot-toast'


export default function Home() {
  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const { data: session, status } = useSession()

  const { isLoading, activeBoard, activeBoardMutate, isValidatingActiveBoard } = useBoardsContext()

  const { handleMouseMove, handleMouseUp, handleContainerMouseDown } =
    useDragScroll(columnsContainerRef as RefObject<HTMLDivElement>)

  const router = useRouter()

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>()

  const { enableDarkMode } = useTheme()

  const [hideSidebar, setHideSidebar] = useState(false)

  const [isColumnFormModalOpen, setIsColumnFormModalOpen] = useState(false)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  const [isApiProcessing, setIsApiProcessing] = useState(false);

const moveTaskToColumn = async (
  task: TaskProps,
  newColumnId: string,
  newOrder: number,
) => {
    setIsApiProcessing(true)

  if (!activeBoard) {
      return
  }

  const originalColumns = [...activeBoard.columns];
  
  try {
    if (isValidatingActiveBoard || isApiProcessing || !task?.id || !newColumnId) {
      return
    }

    const sourceColumnIndex = originalColumns.findIndex(col => 
      col.tasks.some(t => String(t.id) === String(task.id))
    );
    const destinationColumnIndex = originalColumns.findIndex(col => 
      String(col.id) === String(newColumnId)
    );

    if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return;
    
    const sourceColumn = originalColumns[sourceColumnIndex];
    const updatedSourceTasks = sourceColumn.tasks.filter(t => t.id !== task.id);
    
    // Adiciona a task na nova coluna na posição correta
    const destinationColumn = originalColumns[destinationColumnIndex];
    const updatedDestinationTasks = [...destinationColumn.tasks];
    updatedDestinationTasks.splice(newOrder, 0, task);
    
    // Atualiza o estado local imediatamente
    const updatedColumns = [...originalColumns];
    updatedColumns[sourceColumnIndex] = {
      ...sourceColumn,
      tasks: updatedSourceTasks,
    };

    updatedColumns[destinationColumnIndex] = {
      ...destinationColumn,
      tasks: updatedDestinationTasks,
    };
    
    setBoardColumns(updatedColumns);
    
    // Envia a requisição para o servidor em segundo plano
    const payload = {
      new_column_id: newColumnId,
      new_order: newOrder,
    };
    
    await api.put(`tasks/${task?.id}/move`, payload);
    
    // Se a API retornar sucesso, atualiza o estado novamente para garantir sincronia
    await activeBoardMutate();
    
  } catch (error) {
    setBoardColumns(originalColumns);
    handleApiError(error);
  } finally {
    setIsApiProcessing(false);
  }
};

  const reorderTaskInColumn = async (task: TaskProps, newOrder: number) => {
  if (!activeBoard) return

  setIsApiProcessing(true)

  const originalColumns = [...activeBoard.columns]

  try {
    const columnIndex = originalColumns.findIndex(col =>
      col.tasks.some(t => t.id === task.id)
    )
    if (columnIndex === -1) return

    const column = originalColumns[columnIndex]
    const tasks = Array.from(column.tasks)

    const oldIndex = tasks.findIndex(t => t.id === task.id)
    if (oldIndex === -1) return

    const [movedTask] = tasks.splice(oldIndex, 1)

    tasks.splice(newOrder, 0, movedTask)

    const newColumns = [...originalColumns]
    newColumns[columnIndex] = {
      ...column,
      tasks,
    }

    setBoardColumns(newColumns)

    const payload = {
      new_order: newOrder,
    }

    await api.put(`tasks/${task.id}/reorder`, payload)

    await activeBoardMutate()
  } catch (error) {
    setBoardColumns(originalColumns)
    handleApiError(error)
  } finally {
    setIsApiProcessing(false)
  }
}

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

if (isApiProcessing) {
    return;
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
      reorderTaskInColumn(movedTask, destination?.index)
    } else {
      moveTaskToColumn(
        movedTask,
        String(destinationColumn?.id),
        destination?.index
      )
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('auth_token')

    if (!token) {
      router.push('/login')
    }
  }, [])

  useEffect(() => {
    if (activeBoard) {
      setBoardColumns(activeBoard.columns)
    }
  }, [activeBoard])

useEffect(() => {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    router.replace('/login');
  } else {
    setIsCheckingAuth(false);
  }
}, []);

  return (
    <>
      <NextSeo title="Kanban App | Dashboard" />
      {!isCheckingAuth && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal">
            {(provided) => (
              <LayoutContainer
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <BoardContent>
                  {!isSmallerThanSm && (
                    <Sidebar
                      className={!hideSidebar ? '' : 'hidden'}
                      onClose={() => setHideSidebar(true)}
                    />
                  )}
                  <Wrapper>
                    <Header hideSidebar={hideSidebar} />
                    <ColumnsContainer
                      ref={columnsContainerRef}
                      onMouseDown={handleContainerMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onMouseMove={handleMouseMove}
                      className={hideSidebar ? 'hide-sidebar-mode' : ''}
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
                                  isDragDisabled: isLoading || isApiProcessing,
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
                                  onClose={() =>
                                    setIsColumnFormModalOpen(false)
                                  }
                                />
                              )}
                            </Dialog.Root>
                          )}
                        </>
                      ) : (
                        <EmptyContainer />
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

          {isLoading && <LoadingComponent />}
        </DragDropContext>
      )}
    </>
  )
}
