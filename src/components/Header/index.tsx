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

export function Header() {
  const { activeBoard } = useContext(BoardsContext)

  const [showAddTaskModal, setShowAddTaskModal] = useState(false)

  return (
    <Container>
      {showAddTaskModal && (
        <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
      )}
      <TextContainer>
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
