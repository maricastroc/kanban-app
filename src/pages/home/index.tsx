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
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchBoards, fetchActiveBoard, setActiveBoard, setBoards } from '@/store/boardsSlice'
import { useDragScroll } from '@/utils/useDragScroll'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { BoardColumnsList } from './partials/BoardColumnsList'
import { ProfilerWrapper } from '@/components/Shared/ProfilerWrapper'
import { PerformanceDashboard } from '@/components/Shared/PerformanceDashboard'
import { BoardProps } from '@/@types/board'

export default function Home() {
  const dispatch = useAppDispatch()
  const columnsContainerRef = useRef<HTMLDivElement | null>(null)

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>()
  const [hideSidebar, setHideSidebar] = useState(false)
  const [isColumnFormModalOpen, setIsColumnFormModalOpen] = useState(false)

  const activeBoard = useAppSelector((state) => state.boards.activeBoard)
  const isLoading = useAppSelector(
    (state) => state.boards.isValidatingBoards || state.boards.isValidatingActiveBoard,
  )
  const enableDarkMode = useAppSelector((state) => state.theme.enableDarkMode)

  const { handleMouseMove, handleMouseUp, handleContainerMouseDown } =
    useDragScroll(columnsContainerRef as RefObject<HTMLDivElement>)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)
  const { isCheckingAuth } = useAuthRedirect()
  const { onDragEnd, onDragStart, isApiProcessing } = useDragAndDrop(setBoardColumns)

  useEffect(() => {
    if (!isCheckingAuth) {
      dispatch(fetchBoards())
      dispatch(fetchActiveBoard())
    }
  }, [isCheckingAuth, dispatch])

  useEffect(() => {
    setBoardColumns(activeBoard?.columns)
  }, [activeBoard])

  function handleLoadScaleTest(board: BoardProps) {
    // só substitui o activeBoard visualmente — não toca na lista real de boards
    dispatch(setActiveBoard(board))
    setBoardColumns(board.columns)
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
      <PerformanceDashboard onLoadScaleTest={handleLoadScaleTest} version="redux" />
    </>
  )
}
