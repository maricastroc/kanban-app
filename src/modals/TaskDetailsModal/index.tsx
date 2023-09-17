import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons'
import { TaskDTO } from '../../dtos/taskDTO'

import { SubtaskItem } from '../../components/SubtaskItem'
import { CurrentStatusBar } from '../../components/CurrentStatusBar'

import {
  Overlay,
  Description,
  Title,
  Content,
  CloseButton,
  SubtasksContainer,
  SubtasksTitle,
  CurrentStatusTitle,
  OptionsModal,
  OptionsContainer,
} from './styles'
import { DeleteTaskModal } from '../DeleteTaskModal'
import { EditTaskModal } from '../EditTaskModal'

interface TaskDetailsModalProps {
  task: TaskDTO
  onClose: () => void
}

export function TaskDetailsModal({ task, onClose }: TaskDetailsModalProps) {
  const subtasksCompleted = task.subtasks.filter(
    (subtask) => subtask.isCompleted,
  )

  const [openOptionsModal, setOpenOptionsModal] = useState(false)
  const [openEditTaskModal, setOpenEditTaskModal] = useState(false)
  const [openDeleteTaskModal, setOpenDeleteTaskModal] = useState(false)

  const handleCloseModals = () => {
    setOpenEditTaskModal(false)
    setOpenDeleteTaskModal(false)
    setOpenOptionsModal(false)
    onClose()
  }

  return (
    <>
      {!openEditTaskModal && !openDeleteTaskModal ? (
        <>
          <Overlay className="DialogOverlay" onClick={() => onClose()} />
          <Content className="DialogContent">
            <CloseButton onClick={() => onClose()}>
              <FontAwesomeIcon icon={faXmark} />
            </CloseButton>
            <Title className="DialogTitle">
              <h3>{task.title}</h3>
              <OptionsContainer>
                <FontAwesomeIcon
                  onClick={() => setOpenOptionsModal(!openOptionsModal)}
                  icon={faEllipsisVertical}
                />
                {openOptionsModal && (
                  <OptionsModal>
                    <button
                      className="edit"
                      onClick={() => setOpenEditTaskModal(true)}
                    >
                      Edit Task
                    </button>
                    <button
                      className="delete"
                      onClick={() => setOpenDeleteTaskModal(true)}
                    >
                      Delete Task
                    </button>
                  </OptionsModal>
                )}
              </OptionsContainer>
            </Title>
            <Description className="DialogDescription">
              {task.description.length > 0 ? (
                <p>{task.description}</p>
              ) : (
                <p>No description</p>
              )}
              <SubtasksTitle>{`Subtasks (${subtasksCompleted.length} of ${task.subtasks.length})`}</SubtasksTitle>
              <SubtasksContainer suppressHydrationWarning>
                {task.subtasks.map((subtask) => {
                  return (
                    <SubtaskItem
                      key={subtask.title}
                      task={task}
                      title={subtask.title}
                      isCompleted={subtask.isCompleted}
                    />
                  )
                })}
              </SubtasksContainer>
              <CurrentStatusTitle>Current Status</CurrentStatusTitle>
              <CurrentStatusBar task={task} />
            </Description>
          </Content>
        </>
      ) : (
        <>
          {openEditTaskModal && (
            <EditTaskModal task={task} onClose={handleCloseModals} />
          )}

          {openDeleteTaskModal && (
            <DeleteTaskModal task={task} onClose={handleCloseModals} />
          )}
        </>
      )}
    </>
  )
}
