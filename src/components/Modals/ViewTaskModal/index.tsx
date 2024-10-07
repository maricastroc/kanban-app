import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'

import {
  Description, LayoutContainer, SubtasksContainer, OptionsModal, 
  OptionsContainer, OptionsBtn, EmptySubtask, ModalTitle
} from './styles'
import {
  ModalContent, ModalOverlay, SelectStatusField, StatusContainer, 
  StatusSelectorContainer
} from '@/styles/shared'

import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useTaskContext } from '@/contexts/TasksContext'
import { TaskProps } from '@/@types/task'
import { SubtaskProps } from '@/@types/subtask'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { CustomLabel } from '@/components/Shared/Label'
import { SubtaskItem } from '@/components/Core/SubtaskItem'
import { StatusSelector } from '@/components/Shared/StatusSelector'
import { DeleteModal } from '../DeleteModal'

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

  const [status, setStatus] = useState(task.status)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isMoreOptionsModalOpen, setIsMoreOptionsModalOpen] = useState(false)
  const [isStatusOptionsContainerOpen, setIsStatusOptionsContainerOpen] = useState(false)

  const statusRef = useRef<HTMLDivElement | null>(null)

  useOutsideClick(statusRef, () => closeAllModals())

  const closeAllModals = () => {
    setIsDeleteModalOpen(false)
    setIsEditModalOpen(false)
    setIsMoreOptionsModalOpen(false)
    onClose()
  }

  return (
    <>
      {!isDeleteModalOpen && !isEditModalOpen && (
        <Dialog.Portal>
          <ModalOverlay className="DialogOverlay" onClick={closeAllModals} />
          <ModalContent padding="1.5rem 1.5rem 3rem" className="DialogContent smaller">
            <LayoutContainer>
              <ModalTitle>{task.title}</ModalTitle>
              <OptionsContainer>
                <OptionsBtn onClick={() => setIsMoreOptionsModalOpen(true)}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </OptionsBtn>
                {isMoreOptionsModalOpen && (
                  <OptionsModal>
                    <button
                      className="edit"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      Edit Task
                    </button>
                    <button
                      className="delete"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      Delete Task
                    </button>
                  </OptionsModal>
                )}
              </OptionsContainer>
            </LayoutContainer>

            <Description>
              <p>{task.description || 'No description'}</p>
              <CustomLabel>{`Subtasks (${subtasksCompleted.length} of ${task.subtasks.length})`}</CustomLabel>
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
                <CustomLabel>Current Status</CustomLabel>
                <SelectStatusField
                  className={isMoreOptionsModalOpen ? 'active' : ''}
                  onClick={() => setIsStatusOptionsContainerOpen(false)}
                >
                  <p>{status}</p>
                  <FontAwesomeIcon
                    icon={isStatusOptionsContainerOpen ? faAngleUp : faAngleDown}
                  />
                </SelectStatusField>
                {isStatusOptionsContainerOpen && (
                  <StatusSelectorContainer ref={statusRef}>
                    {activeBoard?.columns?.map((column) => (
                      <StatusSelector
                        key={column.name}
                        column={column}
                        status={status}
                        handleChangeStatus={() => {
                          if (status !== column.name) {
                            moveTaskToColumn(task, column.name, status)
                            setStatus(column.name)
                          }
                        }}
                      />
                    ))}
                  </StatusSelectorContainer>
                )}
              </StatusContainer>
            </Description>
          </ModalContent>
        </Dialog.Portal>
      )}

        {isDeleteModalOpen && (
          <DeleteModal
            type="task"
            task={task}
            onClose={() => closeAllModals()}
          />
        )}
    </>
  )
}
