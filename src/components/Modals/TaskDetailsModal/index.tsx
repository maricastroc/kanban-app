import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faAngleUp,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Description,
  LayoutContainer,
  SubtasksContainer,
  OptionsModal,
  OptionsContainer,
  OptionsBtn,
  EmptySubtask,
  ModalTitle,
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
import { DeleteModal } from '../DeleteModal'
import { TaskFormModal } from '../TaskFormModal'
import { Reorder } from 'framer-motion'

interface TaskDetailsModalProps {
  task: TaskProps
  onClose: () => void
}

export function TaskDetailsModal({ task, onClose }: TaskDetailsModalProps) {
  useEscapeKeyHandler(onClose)

  const subtasksCompleted = task.subtasks.filter(
    (subtask: SubtaskProps) => subtask.isCompleted,
  )

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>([])

  const { activeBoard, enableDarkMode } = useBoardsContext()

  const { moveTaskToColumn, reorderSubtasks } = useTaskContext()

  const [status, setStatus] = useState(task.status)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [isEditDeleteModalOpen, setIsEditDeleteModalOpen] = useState(false)

  const [isStatusOptionsContainerOpen, setIsStatusOptionsContainerOpen] =
    useState(false)

  const statusRef = useRef<HTMLDivElement | null>(null)

  useOutsideClick(statusRef, () => closeAllModals())

  const closeAllModals = () => {
    setIsDeleteModalOpen(false)
    setIsEditModalOpen(false)
    setIsEditDeleteModalOpen(false)
    setIsStatusOptionsContainerOpen(false)
  }

  useEffect(() => {
    if (task?.subtasks.length) {
      setSubtasks(task.subtasks)
    }
  }, [task.subtasks])

  return (
    <>
      {!isDeleteModalOpen && !isEditModalOpen && (
        <Dialog.Portal>
          <ModalOverlay
            className="DialogOverlay"
            onClick={() => {
              closeAllModals()
              onClose()
            }}
          />
          <ModalContent
            padding="1.5rem 1.5rem 3rem"
            className="DialogContent smaller"
          >
            <LayoutContainer>
              <ModalTitle>{task.title}</ModalTitle>
              <OptionsContainer>
                <OptionsBtn
                  onClick={() =>
                    setIsEditDeleteModalOpen(!isEditDeleteModalOpen)
                  }
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </OptionsBtn>
                {isEditDeleteModalOpen && (
                  <OptionsModal className={enableDarkMode ? 'dark' : 'light'}>
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
            
              {subtasks.length > 0 ? (
                <SubtasksContainer>
                  <Reorder.Group axis="y" values={subtasks} onReorder={(newOrder) => {
                    setSubtasks(newOrder)
                    reorderSubtasks(task.id, newOrder)
                  }}>
                    {subtasks.map((subtask: SubtaskProps) => (
                      <Reorder.Item
                        as="div"
                        key={subtask.id}
                        value={subtask}
                        style={{ cursor: "grab" }}
                        whileDrag={{ cursor: "grabbing" }}
                      >
                        <SubtaskItem
                          id={subtask.id}
                          task={task}
                          title={subtask.title}
                          isCompleted={subtask.isCompleted}
                        />
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </SubtasksContainer>
              ) : (
                <EmptySubtask>No subtasks.</EmptySubtask>
              )}

              <StatusContainer>
                <CustomLabel>Current Status</CustomLabel>
                <SelectStatusField
                  className={isEditDeleteModalOpen ? 'active' : ''}
                  onClick={() => setIsStatusOptionsContainerOpen(true)}
                >
                  <p>{status}</p>
                  <FontAwesomeIcon
                    icon={
                      isStatusOptionsContainerOpen ? faAngleUp : faAngleDown
                    }
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
                          moveTaskToColumn(task, column.name, status)
                          setStatus(column.name)
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
          onClose={() => {
            onClose()
            closeAllModals()
          }}
        />
      )}

      {isEditModalOpen && (
        <TaskFormModal
          isEditing
          task={task}
          onClose={() => {
            onClose()
            closeAllModals()
          }}
        />
      )}
    </>
  )
}
