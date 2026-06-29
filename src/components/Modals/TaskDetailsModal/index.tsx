/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect, useRef, useState } from 'react'
import { api } from '@/lib/axios'

import { TaskProps } from '@/@types/task'
import { SubtaskProps } from '@/@types/subtask'
import { BoardColumnProps } from '@/@types/board-column'
import { TagProps } from '@/@types/tag'

import { TaskDescription } from './styles'

import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import { useEscapeKey } from '@/utils/useEscapeKey'
import { useClickOutside } from '@/utils/useClickOutside'
import { handleApiError } from '@/utils/handleApiError'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useTheme } from '@/contexts/ThemeContext'

import { DeleteModal } from '../DeleteModal'
import { TaskFormModal } from '../TaskFormModal'
import { TagsSection } from '@/components/Shared/TagsSection'
import { Label } from '@/components/Core/Label'
import { Sheet } from '../Sheet'
import { Header } from './partials/Header'
import { SubtasksSection } from './partials/SubtasksSection'
import { StatusSection } from './partials/StatusSection'

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
  useEscapeKey(onClose)

  const [isLoading, setIsLoading] = useState(false)

  const [isReordering, setIsReordering] = useState(false)

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>([])

  const [status, setStatus] = useState(column.name)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false)

  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  const completedCount = task?.subtasks?.reduce((acc, subtask) => {
    return subtask?.is_completed ? acc + 1 : acc
  }, 0)

  const { activeBoard, activeBoardMutate } = useBoardsContext()

  const { enableDarkMode } = useTheme()

  const statusRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(statusRef as RefObject<HTMLElement>, () => closeAllModals())

  const closeAllModals = () => {
    setIsDeleteModalOpen(false)
    setIsEditModalOpen(false)
    setIsActionsModalOpen(false)
    setIsOptionsOpen(false)
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

      await api.patch('/subtasks/reorder', payload)

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

      await api.patch(`tasks/${task?.id}/move`, payload)

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
      } else {
        await api.post(`/tasks/${taskId}/tags/${tagId}`)
      }

      await activeBoardMutate()
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
        <Sheet isLoading={isLoading} onClose={onClose}>
          <Header
            enableDarkMode={enableDarkMode}
            taskName={task.name}
            isActionsModalOpen={isActionsModalOpen}
            onToggleEditModal={(value) => setIsEditModalOpen(value)}
            onToggleDeleteModal={(value) => setIsDeleteModalOpen(value)}
            onToggleActionsModal={(value) => setIsActionsModalOpen(value)}
          />

          <Sheet.Body>
            <TaskDescription>
              {task.description || 'No description'}
            </TaskDescription>
            <Label>
              <FontAwesomeIcon icon={faListCheck} />
              {`Subtasks (${completedCount} of ${task?.subtasks?.length})`}
            </Label>

            <SubtasksSection
              taskId={task.id}
              handleSetIsLoading={(value) => setIsLoading(value)}
              reorderSubtaskInTask={reorderSubtaskInTask}
              isReordering={isReordering}
              subtasks={subtasks}
              handleSetSubtasks={(value) => setSubtasks(value)}
            />

            <Sheet.Divider />

            <TagsSection
              taskTags={task.tags}
              onCheckedClick={(item) => handleToggleTagStatus(item, true)}
              onUncheckedClick={(item) => handleToggleTagStatus(item, false)}
            />

            <Sheet.Divider />

            <StatusSection
              activeBoard={activeBoard}
              statusRef={statusRef}
              handleChangeStatus={async (column: BoardColumnProps) => {
                await moveTaskToColumn(
                  task,
                  column.id as string,
                  column?.tasks?.length,
                )

                setStatus(column.name)
              }}
              isOpen={isOptionsOpen}
              isActive={isActionsModalOpen}
              status={status}
              onToggleOpen={() => setIsOptionsOpen(true)}
            />
          </Sheet.Body>
        </Sheet>
      )}

      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DeleteModal
          type="task"
          task={task}
          onClose={() => {
            onClose()
            closeAllModals()
          }}
        />
      </Dialog.Root>

      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <TaskFormModal
          isEditing
          column={column}
          task={task}
          onClose={() => {
            onClose()
            closeAllModals()
          }}
        />
      </Dialog.Root>
    </>
  )
}
