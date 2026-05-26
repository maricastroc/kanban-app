/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, RefObject } from 'react'
import { NextSeo } from 'next-seo'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Header } from '@/components/Core/Header'
import {
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
import Image from 'next/image'
import { EmptyContainer } from '@/components/Shared/EmptyContainer'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useDragScroll } from '@/utils/useDragScroll'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { BoardColumnsList } from './partials/BoardColumnsList'
import { useTheme } from '@/contexts/ThemeContext'
import { ProfilerWrapper } from '@/components/Shared/ProfilerWrapper'
import { PerformanceDashboard } from '@/components/Shared/PerformanceDashboard'
import { BoardProps } from '@/@types/board'
import { api } from '@/lib/axios'
import { v4 as uuidv4 } from 'uuid'

const SEED_TASK_PREFIX = '[scale-test]'
const SEED_BATCH_SIZE = 10

export default function Home() {
  const columnsContainerRef = useRef<HTMLDivElement | null>(null)
  // Stores IDs of tasks created by the seeding function so cleanup can delete them
  const seededTaskIdsRef = useRef<number[]>([])

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>()
  const [hideSidebar, setHideSidebar] = useState(false)
  const [isColumnFormModalOpen, setIsColumnFormModalOpen] = useState(false)

  const { isLoading, activeBoard, setActiveBoard, setBoards, activeBoardMutate } =
    useBoardsContext()
  const { enableDarkMode } = useTheme()

  const { handleMouseMove, handleMouseUp, handleContainerMouseDown } =
    useDragScroll(columnsContainerRef as RefObject<HTMLDivElement>)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)
  const { isCheckingAuth } = useAuthRedirect()
  const { onDragEnd, onDragStart, isApiProcessing } =
    useDragAndDrop(setBoardColumns)

  useEffect(() => {
    setBoardColumns(activeBoard?.columns)
  }, [activeBoard])

  function handleLoadScaleTest(board: BoardProps) {
    setActiveBoard(board)
    setBoardColumns(board.columns)
  }

  /**
   * Creates `count` real tasks in the active board via the API (batched),
   * then forces SWR to re-fetch fresh board data.
   * Task IDs are stored in seededTaskIdsRef for later cleanup.
   */
  async function handleSeedAndFresh(
    count: number,
    onProgress: (done: number, total: number) => void,
  ) {
    if (!activeBoard?.columns?.length) return

    const columns = activeBoard.columns
    seededTaskIdsRef.current = []

    // Build task payloads distributed evenly across columns
    const payloads = Array.from({ length: count }, (_, i) => ({
      uuid: uuidv4(),
      name: `${SEED_TASK_PREFIX} Task ${i + 1}`,
      description: 'Automatically created for scale DnD performance test.',
      column_id: Number(columns[i % columns.length].id),
      subtasks: [],
      tags: [],
    }))

    // POST in batches of SEED_BATCH_SIZE
    let done = 0
    for (let i = 0; i < payloads.length; i += SEED_BATCH_SIZE) {
      const batch = payloads.slice(i, i + SEED_BATCH_SIZE)
      // API response shape: { success, message, data: { task: { id, ... } } }
      const responses = await Promise.all(
        batch.map((p) =>
          api.post<{ data: { task: { id: number } } }>('/tasks', p),
        ),
      )
      responses.forEach((r) => {
        const id = r.data?.data?.task?.id
        if (id) seededTaskIdsRef.current.push(id)
      })
      done += batch.length
      onProgress(done, count)
    }

    // Invalidate SWR cache and fetch fresh data so DnD uses real task IDs
    await activeBoardMutate(undefined, { revalidate: true })
  }

  /**
   * Deletes all tasks created by the last seed run, then refreshes the board.
   */
  async function handleCleanupSeedTasks(
    onProgress: (done: number, total: number) => void,
  ) {
    const ids = seededTaskIdsRef.current
    if (!ids.length) return

    let done = 0
    for (let i = 0; i < ids.length; i += SEED_BATCH_SIZE) {
      const batch = ids.slice(i, i + SEED_BATCH_SIZE)
      await Promise.all(batch.map((id) => api.delete(`/tasks/${id}`)))
      done += batch.length
      onProgress(done, ids.length)
    }

    seededTaskIdsRef.current = []
    await activeBoardMutate(undefined, { revalidate: true })
  }

  /**
   * Invalidates SWR cache and re-fetches fresh board data (no seeding).
   */
  async function handleForceFresh() {
    await activeBoardMutate(undefined, { revalidate: true })
  }

  if (isCheckingAuth) return null

  return (
    <>
      <NextSeo title="Kanban App | Dashboard" />
      {!isCheckingAuth && (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Droppable droppableId="all-columns" direction="horizontal">
            {(provided) => (
              <LayoutContainer
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {isLoading && <LoadingComponent />}
                <BoardContent>
                  {!isSmallerThanSm && (
                    <ProfilerWrapper id="Sidebar">
                      <Sidebar
                        className={!hideSidebar ? '' : 'hidden'}
                        onClose={() => setHideSidebar(true)}
                      />
                    </ProfilerWrapper>
                  )}
                  <Wrapper>
                    <ProfilerWrapper id="Header">
                      <Header
                        hideSidebar={hideSidebar}
                        enableDarkMode={enableDarkMode}
                      />
                    </ProfilerWrapper>
                    <ProfilerWrapper id="ColumnsContainer">
                      <ColumnsContainer
                        ref={columnsContainerRef}
                        onMouseDown={handleContainerMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        className={hideSidebar ? 'hide-sidebar-mode' : ''}
                      >
                        {activeBoard ? (
                          <BoardColumnsList
                            isOpen={isColumnFormModalOpen}
                            columns={boardColumns}
                            isLoading={isLoading}
                            isApiProcessing={isApiProcessing}
                            onOpenModal={(value) =>
                              setIsColumnFormModalOpen(value)
                            }
                          />
                        ) : (
                          <EmptyContainer />
                        )}
                      </ColumnsContainer>
                    </ProfilerWrapper>
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
        </DragDropContext>
      )}
      <PerformanceDashboard
        onLoadScaleTest={handleLoadScaleTest}
        onForceFresh={handleForceFresh}
        onSeedAndFresh={handleSeedAndFresh}
        onCleanupSeedTasks={handleCleanupSeedTasks}
        version="context"
      />
    </>
  )
}
