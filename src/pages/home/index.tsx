/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useMemo, RefObject } from 'react'
import { NextSeo } from 'next-seo'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Header } from '@/components/Core/Header'
import { TaskCard } from './partials/TaskCard'
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
import {
  filterBoardColumns,
  isBoardFiltered,
  SortKey,
} from '@/utils/filterBoardColumns'

export default function Home() {
  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>()
  const [hideSidebar, setHideSidebar] = useState(false)
  const [isColumnFormModalOpen, setIsColumnFormModalOpen] = useState(false)

  // Search / filter / sort live here so the Header toolbar and the board share them
  const [search, setSearch] = useState('')
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortKey>('manual')

  const { isLoading, activeBoard } = useBoardsContext()

  const { handleMouseMove, handleMouseUp, handleContainerMouseDown } =
    useDragScroll(columnsContainerRef as RefObject<HTMLDivElement>)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)
  const { isCheckingAuth } = useAuthRedirect()
  const { activeTask, isApiProcessing, onDragStart, onDragOver, onDragEnd } =
    useDragAndDrop(boardColumns, setBoardColumns)

  // A small activation distance lets a plain click open the task dialog while
  // an intentional drag still starts past the threshold.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  useEffect(() => {
    setBoardColumns(activeBoard?.columns)
  }, [activeBoard])

  // The column backing the floating overlay card (task may have crossed
  // columns mid-drag, so resolve it from the live board state).
  const overlayColumn =
    activeTask &&
    boardColumns?.find((col) =>
      col.tasks.some((t) => String(t.id) === String(activeTask.id)),
    )

  const isFiltering = isBoardFiltered({ search, tags: filterTags, sortBy })

  // Display view of the board with search/tag/sort applied (board data untouched)
  const displayColumns = useMemo(
    () =>
      filterBoardColumns(boardColumns, { search, tags: filterTags, sortBy }),
    [boardColumns, search, filterTags, sortBy],
  )

  function handleToggleFilterTag(name: string) {
    setFilterTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    )
  }

  function handleClearFilters() {
    setFilterTags([])
  }

  if (isCheckingAuth) return null

  return (
    <>
      <NextSeo title="Kanban App | Dashboard" />
      {!isCheckingAuth && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <LayoutContainer>
            {/* Only block the screen on the initial load. Once a board is on
                screen, background revalidations (e.g. after an optimistic
                drag) refresh it in place instead of flashing this overlay. */}
            {isLoading && !activeBoard && <LoadingComponent />}
            <BoardContent>
              {!isSmallerThanSm && (
                <Sidebar
                  className={!hideSidebar ? '' : 'hidden'}
                  onClose={() => setHideSidebar(true)}
                />
              )}
              <Wrapper>
                <Header
                  hideSidebar={hideSidebar}
                  search={search}
                  onSearchChange={setSearch}
                  filterTags={filterTags}
                  onToggleFilterTag={handleToggleFilterTag}
                  onClearFilters={handleClearFilters}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
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
                      columns={displayColumns}
                      isLoading={isLoading}
                      isApiProcessing={isApiProcessing}
                      dragDisabled={isLoading || isApiProcessing || isFiltering}
                      onOpenModal={(value) => setIsColumnFormModalOpen(value)}
                    />
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

          <DragOverlay>
            {activeTask && overlayColumn ? (
              <TaskCard task={activeTask} column={overlayColumn} dragOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </>
  )
}
