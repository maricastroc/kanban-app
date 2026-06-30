/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useMemo, RefObject } from 'react'
import { NextSeo } from 'next-seo'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Header } from '@/components/Core/Header'
import { TaskCard } from './partials/TaskCard'
import { ColumnOverlay } from './partials/BoardColumn'
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
import { EmptyColumns } from '@/components/Shared/EmptyColumns'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useDragScroll } from '@/utils/useDragScroll'
import {
  useDragAndDrop,
  kanbanCollisionDetection,
} from '@/hooks/useDragAndDrop'
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

  const [search, setSearch] = useState('')
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortKey>('manual')

  const { isLoading, activeBoard, boards } = useBoardsContext()

  const { handleMouseMove, handleMouseUp, handleContainerMouseDown } =
    useDragScroll(columnsContainerRef as RefObject<HTMLDivElement>)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)
  const { isCheckingAuth } = useAuthRedirect()
  const {
    activeTask,
    activeColumn,
    isApiProcessing,
    onDragStart,
    onDragOver,
    onDragEnd,
  } = useDragAndDrop(boardColumns, setBoardColumns)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  useEffect(() => {
    setBoardColumns(activeBoard?.columns)
  }, [activeBoard])

  const overlayColumn =
    activeTask &&
    boardColumns?.find((col) =>
      col.tasks.some((t) => String(t.id) === String(activeTask.id)),
    )

  const isFiltering = isBoardFiltered({ search, tags: filterTags, sortBy })

  // Boards exist but none has resolved yet (initial fetch or the auto-activation
  // round-trip): keep the loader up instead of flashing the "no board selected"
  // / empty-board states between requests.
  const isResolvingBoard =
    !activeBoard && (isLoading || (boards?.length ?? 0) > 0)

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
          collisionDetection={kanbanCollisionDetection}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <LayoutContainer>
            {isResolvingBoard && <LoadingComponent />}
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
                    boardColumns?.length === 0 ? (
                      <EmptyColumns
                        isOpen={isColumnFormModalOpen}
                        onOpenModal={setIsColumnFormModalOpen}
                      />
                    ) : (
                      <BoardColumnsList
                        isOpen={isColumnFormModalOpen}
                        columns={displayColumns}
                        isLoading={isLoading}
                        isApiProcessing={isApiProcessing}
                        dragDisabled={
                          isLoading || isApiProcessing || isFiltering
                        }
                        onOpenModal={(value) => setIsColumnFormModalOpen(value)}
                      />
                    )
                  ) : (
                    !isResolvingBoard &&
                    boards?.length === 0 && <EmptyContainer />
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
            {activeColumn ? (
              <ColumnOverlay column={activeColumn} />
            ) : activeTask && overlayColumn ? (
              <TaskCard task={activeTask} column={overlayColumn} dragOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </>
  )
}
