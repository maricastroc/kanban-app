/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { TaskProps } from '@/@types/task'
import { SubtaskProps } from '@/@types/subtask'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { CustomLabel } from '@/components/Shared/Label'
import { SubtaskItem } from '@/components/Core/SubtaskItem'
import { StatusSelector } from '@/components/Shared/StatusSelector'
import { DeleteModal } from '../DeleteModal'
import { TaskFormModal } from '../TaskFormModal'
import { Reorder } from 'framer-motion'
import { KeyedMutator } from 'swr'
import { AxiosResponse } from 'axios'
import { BoardProps } from '@/@types/board'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import toast from 'react-hot-toast'
import { BoardColumnProps } from '@/@types/board-column'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'

interface TaskDetailsModalProps {
  task: TaskProps
  column: BoardColumnProps
  activeBoard: BoardProps
  boardId: string
  mutate: KeyedMutator<AxiosResponse<BoardProps, any>>
  onClose: () => void
}

export function TaskDetailsModal({
  task,
  activeBoard,
  column,
  boardId,
  mutate,
  onClose,
}: TaskDetailsModalProps) {
  useEscapeKeyHandler(onClose)

  const subtasksCompleted = task?.subtasks?.filter(
    (subtask: SubtaskProps) => subtask?.isCompleted,
  )

  const [isLoading, setIsLoading] = useState(false)

  const [isReordering, setIsReordering] = useState(false)

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>([])

  const { enableDarkMode } = useBoardsContext()

  const [status, setStatus] = useState(column.name)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [isEditDeleteModalOpen, setIsEditDeleteModalOpen] = useState(false)

  const [isStatusOptionsContainerOpen, setIsStatusOptionsContainerOpen] =
    useState(false)

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

      mutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsReordering(false)
    }
  }

  const moveTaskToColumn = async (
    taskId: string,
    newColumnId: string,
    newOrder: number,
  ) => {
    try {
      setIsLoading(true)

      const payload = {
        taskId,
        newColumnId,
        newOrder,
      }

      await api.put('/tasks/reorder', payload)

      mutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
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
                      reorderSubtaskInTask(task.id, newOrder)
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
                          task={task}
                          title={subtask.title}
                          isCompleted={subtask.isCompleted}
                          handleSetIsLoading={(value: boolean) =>
                            setIsLoading(value)
                          }
                          mutate={mutate}
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
                        handleChangeStatus={async () => {
                          await moveTaskToColumn(
                            task.id,
                            column.id,
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

            {isLoading && <LoadingComponent />}
          </ModalContent>
        </Dialog.Portal>
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          type="task"
          task={task}
          mutate={mutate}
          onClose={() => {
            onClose()
            closeAllModals()
          }}
        />
      )}

      {isEditModalOpen && (
        <TaskFormModal
          isEditing
          activeBoard={activeBoard}
          boardId={boardId}
          mutate={mutate}
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
