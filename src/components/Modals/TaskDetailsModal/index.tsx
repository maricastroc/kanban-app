/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect, useRef, useState } from 'react'
import { api } from '@/lib/axios'

import { TaskProps } from '@/@types/task'
import { SubtaskProps } from '@/@types/subtask'
import { BoardColumnProps } from '@/@types/board-column'
import { TagProps } from '@/@types/tag'

import { Description } from './styles'

import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { handleApiError } from '@/utils/handleApiError'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useTheme } from '@/contexts/ThemeContext'

import { DeleteModal } from '../DeleteModal'
import { TaskFormModal } from '../TaskFormModal'
import { TagsSection } from '@/components/Shared/TagsSection'
import { CustomLabel } from '@/components/Core/Label'
import { BaseModal } from '../BaseModal'
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
  useEscapeKeyHandler(onClose)

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

  useOutsideClick(statusRef as RefObject<HTMLElement>, () => closeAllModals())

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
        <BaseModal
          hasHeader={false}
          isLoading={isLoading}
          padding="1.5rem 1.5rem 3rem"
          onClose={onClose}
          title={task.name}
        >
          <Header
            enableDarkMode={enableDarkMode}
            taskName={task.name}
            isActionsModalOpen={isActionsModalOpen}
            onToggleEditModal={(value) => setIsEditModalOpen(value)}
            onToggleDeleteModal={(value) => setIsDeleteModalOpen(value)}
            onToggleActionsModal={(value) => setIsActionsModalOpen(value)}
          />

          <Description>
            <p>{task.description || 'No description'}</p>
            <CustomLabel>
              {`Subtasks (${completedCount} of ${task?.subtasks?.length})`}
            </CustomLabel>

            <SubtasksSection
              taskId={task.id}
              handleSetIsLoading={(value) => setIsLoading(value)}
              reorderSubtaskInTask={reorderSubtaskInTask}
              isReordering={isReordering}
              subtasks={subtasks}
              handleSetSubtasks={(value) => setSubtasks(value)}
            />

            <TagsSection
              taskTags={task.tags}
              onCheckedClick={(item) => handleToggleTagStatus(item, true)}
              onUncheckedClick={(item) => handleToggleTagStatus(item, false)}
            />

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
          </Description>
        </BaseModal>
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
          column={column}
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
