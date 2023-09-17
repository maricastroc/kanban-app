import { useContext, useState } from 'react'
import { BoardsContext } from '@/contexts/BoardsContext'
import Logo from '@/../public/icon.svg'

import {
  faAngleDown,
  faEllipsisVertical,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  AddButton,
  Container,
  LaunchButton,
  OptionsContainer,
  TextContainer,
  ViewMoreButton,
} from './styles'
import { AddTaskModal } from '@/modals/AddTaskModal'
import { BoardsModal } from '@/modals/BoardsModal'

export function Header() {
  const { activeBoard } = useContext(BoardsContext)

  const [showAddTaskModal, setShowAddTaskModal] = useState(false)

  const [showBoardsModal, setShowBoardsModal] = useState(false)

  return (
    <Container>
      {showAddTaskModal && (
        <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
      )}
      {showBoardsModal && (
        <BoardsModal onClose={() => setShowBoardsModal(false)} />
      )}
      <TextContainer onClick={() => setShowBoardsModal(!showBoardsModal)}>
        <img src={Logo} width={24} height={24} alt="" />
        {activeBoard?.name && (
          <LaunchButton>
            <h2>{activeBoard.name}</h2>
            <FontAwesomeIcon icon={faAngleDown} />
          </LaunchButton>
        )}
      </TextContainer>
      <OptionsContainer>
        <AddButton onClick={() => setShowAddTaskModal(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </AddButton>
        <ViewMoreButton>
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </ViewMoreButton>
      </OptionsContainer>
    </Container>
  )
}
