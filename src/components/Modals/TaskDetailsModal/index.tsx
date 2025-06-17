/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect, useRef, useState } from 'react'
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
import { useTheme } from '@/contexts/ThemeContext'
import { TaskProps } from '@/@types/task'
import { SubtaskProps } from '@/@types/subtask'
import { BoardColumnProps } from '@/@types/board-column'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { CustomLabel } from '@/components/Shared/Label'
import { SubtaskItem } from '@/components/Core/SubtaskItem'
import { StatusSelector } from '@/components/Shared/StatusSelector'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { DeleteModal } from '../DeleteModal'
import { TaskFormModal } from '../TaskFormModal'
import { Reorder } from 'framer-motion'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import toast from 'react-hot-toast'
import { TagProps } from '@/@types/tag'
import { TagsSection } from '@/components/Shared/TagsSection'

interface TaskDetailsModalProps {
  task: TaskProps
  column: BoardColumnProps
  onClose: () => void
}

export function TaskDetailsModal({
  task,
  column,
  onClose,
}: TaskDetailsModalProps) {
  useEscapeKeyHandler(onClose)

  const [isLoading, setIsLoading] = useState(false)

  const [isReordering, setIsReordering] = useState(false)

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>([])

  const [status, setStatus] = useState(column.name)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [isEditDeleteModalOpen, setIsEditDeleteModalOpen] = useState(false)

  const [isStatusOptionsContainerOpen, setIsStatusOptionsContainerOpen] =
    useState(false)

  const subtasksCompleted = task?.subtasks?.filter(
    (subtask: SubtaskProps) => subtask?.is_completed,
  )

  const { activeBoard, activeBoardMutate } = useBoardsContext()

  const { enableDarkMode } = useTheme()

  const statusRef = useRef<HTMLDivElement | null>(null)

  useOutsideClick(statusRef as RefObject<HTMLElement>, () => closeAllModals())

  const closeAllModals = () => {
    setIsDeleteModalOpen(false)
    setIsEditModalOpen(false)
    setIsEditDeleteModalOpen(false)
    setIsStatusOptionsContainerOpen(false)
  }

  const reorderSubtaskInTask = async (
    taskId: string,
    subtasks: SubtaskProps[],
  ) => {
    try {
      setIsReordering(true)

      const updatedSubtasks = subtasks.map((subtask, index) => ({
        ...subtask,
        order: index + 1,
      }))

      const payload = {
        taskId,
        subtasks: updatedSubtasks,
      }

      await api.put('/subtasks/reorder', payload)

      await activeBoardMutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsReordering(false)
    }
  }

  const moveTaskToColumn = async (
    task: TaskProps,
    newColumnId: string,
    newOrder: number,
  ) => {
    try {
      setIsLoading(true)

      const payload = {
        new_column_id: Number(newColumnId),
        new_order: Number(newOrder),
      }

      await api.put(`tasks/${task?.id}/move`, payload)

      await activeBoardMutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleTagStatus = async (
    tagToUpdate: TagProps,
    isChecked: boolean,
  ) => {
    try {
      setIsLoading(true)

      const { id: taskId } = task
      const { id: tagId } = tagToUpdate

      if (isChecked) {
        await api.delete(`/tasks/${taskId}/tags/${tagId}`)

        await activeBoardMutate()
      } else {
        await api.post(`/tasks/${taskId}/tags/${tagId}`)

        await activeBoardMutate()
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (task?.subtasks && task?.subtasks?.length) {
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
              <ModalTitle>{task.name}</ModalTitle>
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
              <CustomLabel>{`Subtasks (${subtasksCompleted?.length} of ${task?.subtasks?.length})`}</CustomLabel>

              {subtasks.length > 0 ? (
                <SubtasksContainer>
                  <Reorder.Group
                    axis="y"
                    values={subtasks}
                    onReorder={(newOrder) => {
                      if (isReordering) {
                        toast.error(
                          'Please wait until the current request is completed.',
                        )
                        return
                      }

                      setSubtasks(newOrder)
                      reorderSubtaskInTask(task.id as string, newOrder)
                    }}
                  >
                    {subtasks.map((subtask: SubtaskProps) => (
                      <Reorder.Item
                        as="div"
                        key={subtask.id}
                        value={subtask}
                        style={{ cursor: 'grab' }}
                        whileDrag={{ cursor: 'grabbing' }}
                      >
                        <SubtaskItem
                          id={subtask.id}
                          name={subtask.name}
                          isCompleted={subtask.is_completed}
                          handleSetIsLoading={(value: boolean) =>
                            setIsLoading(value)
                          }
                        />
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </SubtasksContainer>
              ) : (
                <EmptySubtask>No subtasks.</EmptySubtask>
              )}

              <TagsSection
                taskTags={task.tags}
                onCheckedClick={(item) => handleToggleTagStatus(item, true)}
                onUncheckedClick={(item) => handleToggleTagStatus(item, false)}
              />

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
                        handleChangeStatus={async () => {
                          await moveTaskToColumn(
                            task,
                            column.id as string,
                            column?.tasks?.length + 1,
                          )

                          setStatus(column.name)
                        }}
                      />
                    ))}
                  </StatusSelectorContainer>
                )}
              </StatusContainer>
            </Description>
          </ModalContent>

          {isLoading && <LoadingComponent />}
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
