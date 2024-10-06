import { useRef, useState } from 'react'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'

import {
  Description,
  Title,
  SubtasksContainer,
  SubtasksTitle,
  OptionsModal,
  OptionsContainer,
  OptionsBtn,
  EmptySubtask,
} from './styles'

import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { ModalContent, ModalOverlay, SelectStatusField, StatusContainer, StatusSelectorContainer } from '@/styles/shared'
import { CustomLabel } from '@/components/Shared/Label'
import { SubtaskItem } from '@/components/Core/SubtaskItem'
import { SubtaskProps } from '@/@types/subtask'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { TaskProps } from '@/@types/task'
import { useBoardsContext } from '@/contexts/BoardsContext'

import { useTaskContext } from '@/contexts/TasksContext'
import { StatusSelector } from '@/components/Shared/StatusSelector'

interface ViewTaskModalProps {
  task: TaskProps
  onClose: () => void
}

export function ViewTaskModal({ task, onClose }: ViewTaskModalProps) {
  useEscapeKeyHandler(onClose)

  const subtasksCompleted = task.subtasks.filter(
    (subtask: SubtaskProps) => subtask.isCompleted,
  )

  const { activeBoard } = useBoardsContext()

  const { moveTaskToColumn } = useTaskContext()

  const [openStatusOptionsContainer, setOpenStatusOptionsContainer] = useState(false)

  const [openMoreOptionsModal, setOpenMoreOptionsModal] = useState(false)

  const [openEditTaskModal, setOpenEditTaskModal] = useState(false)

  const [openDeleteTask, setOpenDeleteTask] = useState(false)

  const [status, setStatus] = useState(task.status)

  const statusRef = useRef<HTMLDivElement | null>(null)

  useOutsideClick(statusRef, () => handleCloseModals())

  const handleCloseModals = () => {
    setOpenEditTaskModal(false)
    setOpenDeleteTask(false)
    setOpenMoreOptionsModal(false)
    onClose()
  }

  return (
    <>
      {!openEditTaskModal && !openDeleteTask && (
      <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={() => onClose()} />
      <ModalContent padding="1.5rem 1.5rem 3rem" className="DialogContent" aria-describedby={undefined}>
            <Title>
              <h3>{task.title}</h3>
              <OptionsContainer>
                <OptionsBtn
                  onClick={() => setOpenMoreOptionsModal(!openMoreOptionsModal)}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </OptionsBtn>
                {openMoreOptionsModal && (
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
                  {task.subtasks.map((subtask: SubtaskProps) => (
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
<StatusContainer>
<CustomLabel>Status</CustomLabel>
            <SelectStatusField
              className={openStatusOptionsContainer ? 'active' : ''}
              onClick={() => setOpenStatusOptionsContainer ((prev) => !prev)}
            >
              <p>{status}</p>
              <FontAwesomeIcon
                icon={openStatusOptionsContainer  ? faAngleUp : faAngleDown}
              />
            </SelectStatusField>
            {openStatusOptionsContainer && (
              <StatusSelectorContainer ref={statusRef}>
                {activeBoard?.columns?.map((column) => (
                  <StatusSelector column={column} status={status} handleChangeStatus={() => {
                    if (status) {
                      moveTaskToColumn(task, column.name, status)
                      setStatus(column.name)
                    }
                  }} />
                ))}
              </StatusSelectorContainer>
            )}
          </StatusContainer>
            </Description>
          </ModalContent>
          </Dialog.Portal>
      )}
    </>
  )
}
