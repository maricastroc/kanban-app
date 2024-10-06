import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faAngleUp,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'

import {
  Description,
  Title,
  SubtasksContainer,
  OptionsModal,
  OptionsContainer,
  OptionsBtn,
  EmptySubtask,
} from './styles'
import {
  ModalContent,
  ModalOverlay,
  SelectStatusField,
  StatusContainer,
  StatusSelectorContainer,
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

interface ViewTaskModalProps {
  task: TaskProps
  onClose: () => void
}

type ModalType = 'edit' | 'delete' | 'options' | 'status' | null

export function ViewTaskModal({ task, onClose }: ViewTaskModalProps) {
  useEscapeKeyHandler(onClose)

  const subtasksCompleted = task.subtasks.filter(
    (subtask: SubtaskProps) => subtask.isCompleted,
  )

  const { activeBoard } = useBoardsContext()

  const { moveTaskToColumn } = useTaskContext()

  const [status, setStatus] = useState(task.status)

  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const statusRef = useRef<HTMLDivElement | null>(null)

  useOutsideClick(statusRef, () => setActiveModal(null))

  const toggleModal = (modal: ModalType) => {
    setActiveModal(activeModal === modal ? null : modal)
  }

  const closeAllModals = () => {
    setActiveModal(null)
    onClose()
  }

  return (
    <>
      {activeModal !== 'edit' && activeModal !== 'delete' && (
        <Dialog.Portal>
          <ModalOverlay className="DialogOverlay" onClick={closeAllModals} />
          <ModalContent
            padding="1.5rem 1.5rem 3rem"
            className="DialogContent smaller"
          >
            <Title>
              <h3>{task.title}</h3>
              <OptionsContainer>
                <OptionsBtn onClick={() => toggleModal('options')}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </OptionsBtn>
                {activeModal === 'options' && (
                  <OptionsModal>
                    <button
                      className="edit"
                      onClick={() => toggleModal('edit')}
                    >
                      Edit Task
                    </button>
                    <button
                      className="delete"
                      onClick={() => toggleModal('delete')}
                    >
                      Delete Task
                    </button>
                  </OptionsModal>
                )}
              </OptionsContainer>
            </Title>
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
                  className={activeModal === 'status' ? 'active' : ''}
                  onClick={() => toggleModal('status')}
                >
                  <p>{status}</p>
                  <FontAwesomeIcon
                    icon={activeModal === 'status' ? faAngleUp : faAngleDown}
                  />
                </SelectStatusField>
                {activeModal === 'status' && (
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
                          setActiveModal(null)
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
    </>
  )
}
