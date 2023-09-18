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
  ViewMoreContainer,
  ViewMoreModal,
} from './styles'
import { AddTask } from '@/modals/AddTask'
import { ViewBoards } from '@/modals/ViewBoards'
import { DeleteBoard } from '@/modals/DeleteBoard'

export function Header() {
  const { activeBoard } = useContext(BoardsContext)

  const [showAddTask, setShowAddTask] = useState(false)

  const [showViewBoards, setShowViewBoards] = useState(false)

  const [showViewMoreModal, setShowViewMoreModal] = useState(false)

  const [showDeleteBoard, setShowDeleteBoard] = useState(false)

  return (
    <Container>
      {showAddTask && <AddTask onClose={() => setShowAddTask(false)} />}

      {showViewBoards && (
        <ViewBoards onClose={() => setShowViewBoards(false)} />
      )}

      {showDeleteBoard && (
        <DeleteBoard
          board={activeBoard}
          onClose={() => setShowDeleteBoard(false)}
        />
      )}

      <TextContainer onClick={() => setShowViewBoards(!showViewBoards)}>
        <img src={Logo} width={24} height={24} alt="" />
        {activeBoard?.name && (
          <LaunchButton>
            <h2>{activeBoard.name}</h2>
            <FontAwesomeIcon icon={faAngleDown} />
          </LaunchButton>
        )}
      </TextContainer>

      <OptionsContainer>
        <AddButton onClick={() => setShowAddTask(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </AddButton>

        <ViewMoreContainer>
          <ViewMoreButton
            onClick={() => setShowViewMoreModal(!showViewMoreModal)}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </ViewMoreButton>
          {showViewMoreModal && (
            <ViewMoreModal>
              <button className="edit">Edit Board</button>
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
    </Container>
  )
}
