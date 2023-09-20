import { useState } from 'react'
import { TaskDTO } from '@/dtos/taskDTO'
import { SubtaskItem } from '@/components/SubtaskItem'
import { CurrentStatusBar } from '@/components/CurrentStatusBar'
import { DeleteTask } from '@/modals/DeleteTask'
import { EditTask } from '@/modals/EditTask'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import {
  Description,
  Title,
  SubtasksContainer,
  SubtasksTitle,
  CurrentStatusTitle,
  OptionsModal,
  OptionsContainer,
  OptionsButton,
  EmptySubtask,
} from './styles'

import { Content, Overlay } from '../sharedStyles'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

interface ViewTaskModalProps {
  task: TaskDTO
  onClose: () => void
}

export function ViewTask({ task, onClose }: ViewTaskModalProps) {
  useEscapeKeyHandler(onClose)

  const subtasksCompleted = task.subtasks.filter(
    (subtask) => subtask.isCompleted,
  )

  const [openOptionsModal, setOpenOptionsModal] = useState(false)
  const [openEditTaskModal, setOpenEditTaskModal] = useState(false)
  const [openDeleteTask, setOpenDeleteTask] = useState(false)

  const handleCloseModals = () => {
    setOpenEditTaskModal(false)
    setOpenDeleteTask(false)
    setOpenOptionsModal(false)
    onClose()
  }

  return (
    <>
      {!openEditTaskModal && !openDeleteTask && (
        <>
          <Overlay onClick={() => onClose()} />
          <Content className="bigger">
            <Title>
              <h3>{task.title}</h3>
              <OptionsContainer>
                <OptionsButton
                  onClick={() => setOpenOptionsModal(!openOptionsModal)}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </OptionsButton>
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
                      onClick={() => setOpenDeleteTask(true)}
                    >
                      Delete Task
                    </button>
                  </OptionsModal>
                )}
              </OptionsContainer>
            </Title>
            <Description>
              {task.description.length > 0 ? (
                <p>{task.description}</p>
              ) : (
                <p>No description</p>
              )}
              <SubtasksTitle>{`Subtasks (${subtasksCompleted.length} of ${task.subtasks.length})`}</SubtasksTitle>
              {task.subtasks.length > 0 ? (
                <SubtasksContainer>
                  {task.subtasks.map((subtask) => (
                    <SubtaskItem
                      key={subtask.title}
                      task={task}
                      title={subtask.title}
                      isCompleted={subtask.isCompleted}
                    />
                  ))}
                </SubtasksContainer>
              ) : (
                <EmptySubtask>No subtasks.</EmptySubtask>
              )}
              <CurrentStatusTitle>Current Status</CurrentStatusTitle>
              <CurrentStatusBar task={task} />
            </Description>
          </Content>
        </>
      )}

      {(openEditTaskModal || openDeleteTask) && (
        <>
          {openEditTaskModal && (
            <EditTask task={task} onClose={handleCloseModals} />
          )}

          {openDeleteTask && (
            <DeleteTask task={task} onClose={handleCloseModals} />
          )}
        </>
      )}
    </>
  )
}
