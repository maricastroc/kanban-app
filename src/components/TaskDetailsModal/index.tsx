import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons'
import { TaskDTO } from '../../dtos/taskDTO'

import { SubtaskItem } from '../SubtaskItem'
import { EditTaskModal } from '../EditTaskModal'
import { CurrentStatusBar } from '../CurrentStatusBar'

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

interface TaskDetailsModalProps {
  task: TaskDTO
}

export function TaskDetailsModal({ task }: TaskDetailsModalProps) {
  const subtasksCompleted = task.subtasks.filter(
    (subtask) => subtask.isCompleted,
  )

  const [openOptionsModal, setOpenOptionsModal] = useState(false)

  const [openEditTaskModal, setOpenEditTaskModal] = useState(false)

  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" />
      <Content
        className="DialogContent"
        onCloseAutoFocus={() => setOpenOptionsModal(false)}
      >
        <CloseButton>
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
              <OptionsModal suppressHydrationWarning>
                <Dialog.Root key={task.title} open={openEditTaskModal}>
                  <Dialog.Trigger asChild>
                    <button
                      className="edit"
                      onClick={() => setOpenEditTaskModal(true)}
                    >
                      Edit Task
                    </button>
                  </Dialog.Trigger>
                  <EditTaskModal
                    task={task}
                    onClose={() => setOpenEditTaskModal(false)}
                  />
                </Dialog.Root>
                <button className="delete">Delete Task</button>
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
    </Dialog.Portal>
  )
}
