/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useMemo, RefObject } from 'react'
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
  const { onDragEnd, isApiProcessing } = useDragAndDrop(setBoardColumns)

  useEffect(() => {
    setBoardColumns(activeBoard?.columns)
  }, [activeBoard])

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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal">
            {(provided) => (
              <LayoutContainer
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {isLoading && <LoadingComponent />}
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
                          dragDisabled={
                            isLoading || isApiProcessing || isFiltering
                          }
                          onOpenModal={(value) =>
                            setIsColumnFormModalOpen(value)
                          }
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
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  )
}
