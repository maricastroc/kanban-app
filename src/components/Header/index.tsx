import { useEffect, useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import Logo from '@/../public/icon.svg'
import LogoTextLight from '@/../public/kanban.svg'
import LogoTextDark from '@/../public/kanban-dark.svg'

import {
  faAngleDown,
  faEllipsisVertical,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  AddButton,
  BoardName,
  Container,
  LaunchButton,
  LogoContainer,
  LogoWrapper,
  OptionsContainer,
  TextMobileContainer,
  ViewMoreButton,
  ViewMoreContainer,
  ViewMoreModal,
  Wrapper,
} from './styles'
import { AddTask } from '@/modals/AddTask'
import { ViewBoards } from '@/modals/ViewBoards'
import { DeleteBoard } from '@/modals/DeleteBoard'
import { EditBoard } from '@/modals/EditBoard'

interface HeaderProps {
  onChangeTheme: () => void
}

export function Header({ onChangeTheme }: HeaderProps) {
  const { activeBoard, isDarkTheme } = useBoardsContext()

  const [isMobile, setIsMobile] = useState(false)

  const [showAddTask, setShowAddTask] = useState(false)

  const [showViewBoards, setShowViewBoards] = useState(false)

  const [showViewMoreModal, setShowViewMoreModal] = useState(false)

  const [showDeleteBoard, setShowDeleteBoard] = useState(false)

  const [showEditBoard, setShowEditBoard] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Container>
      {showAddTask && <AddTask onClose={() => setShowAddTask(false)} />}

      {showViewBoards && (
        <ViewBoards
          onClose={() => setShowViewBoards(false)}
          onChangeTheme={onChangeTheme}
        />
      )}

      {showDeleteBoard && (
        <DeleteBoard
          board={activeBoard}
          onClose={() => setShowDeleteBoard(false)}
        />
      )}

      {showEditBoard && (
        <EditBoard
          board={activeBoard}
          onClose={() => setShowEditBoard(false)}
        />
      )}

      {!isMobile && (
        <LogoContainer>
          <LogoWrapper>
            <img src={Logo} width={24} height={24} alt="" />
            <img
              src={isDarkTheme ? LogoTextLight : LogoTextDark}
              width={112}
              height={24}
              alt=""
            />
          </LogoWrapper>
        </LogoContainer>
      )}

      {isMobile && (
        <TextMobileContainer onClick={() => setShowViewBoards(!showViewBoards)}>
          <img src={Logo} width={24} height={24} alt="" />
          {activeBoard?.name && (
            <LaunchButton>
              <h2>{activeBoard.name}</h2>
              <FontAwesomeIcon icon={faAngleDown} />
            </LaunchButton>
          )}
        </TextMobileContainer>
      )}

      <Wrapper>
        {!isMobile && <BoardName>{activeBoard.name}</BoardName>}

        <OptionsContainer>
          <AddButton onClick={() => setShowAddTask(true)}>
            <FontAwesomeIcon icon={faPlus} />
            <p>+ Add New Task</p>
          </AddButton>

          <ViewMoreContainer>
            <ViewMoreButton
              onClick={() => setShowViewMoreModal(!showViewMoreModal)}
            >
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </ViewMoreButton>
            {showViewMoreModal && (
              <ViewMoreModal>
                <button
                  className="edit"
                  onClick={() => {
                    setShowEditBoard(true)
                    setShowViewMoreModal(false)
                  }}
                >
                  Edit Board
                </button>
                <button
                  className="delete"
                  onClick={() => {
                    setShowDeleteBoard(true)
                    setShowViewMoreModal(false)
                  }}
                >
                  Delete Board
                </button>
              </ViewMoreModal>
            )}
          </ViewMoreContainer>
        </OptionsContainer>
      </Wrapper>
    </Container>
  )
}
