import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent } from '@dnd-kit/core'

import { api } from '@/lib/axios'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { handleApiError } from '@/utils/handleApiError'
import { MIN_TITLE_LENGTH } from '@/utils/constants'
import { SubtaskProps } from '@/@types/subtask'
import { TaskProps } from '@/@types/task'
import { TaskTagProps } from '@/@types/task-tag'
import { BoardColumnProps } from '@/@types/board-column'

interface AddTaskModalProps {
  isEditing?: boolean
  task?: TaskProps
  column?: BoardColumnProps
  onClose: () => void
}

// Subtasks are optional, so a new task starts with none — the user adds them
// on demand via "Add subtask".
const initialSubtasks: SubtaskProps[] = []

const subtaskSchema = z.object({
  id: z.number().or(z.string()),
  name: z
    .string()
    .min(3, { message: 'Subtask title must have at least 3 characters' }),
  is_completed: z.boolean(),
})

export const useTaskForm = ({
  isEditing = false,
  task,
  column,
  onClose,
}: AddTaskModalProps) => {
  const { activeBoard, activeBoardMutate } = useBoardsContext()

  const [columnId, setColumnId] = useState<string | number | undefined>(
    column?.id || undefined,
  )

  const [taskTags, setTaskTags] = useState<TaskTagProps[]>(task?.tags || [])

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>(
    isEditing && task?.subtasks ? task.subtasks : initialSubtasks,
  )

  const [status, setStatus] = useState(column?.name || '')

  const formSchema = z.object({
    id: z.number().or(z.string()),
    name: z.string().min(MIN_TITLE_LENGTH, {
      message: 'Title must have at least 3 characters.',
    }),
    description: z.string().optional(),
    subtasks: z.array(subtaskSchema),
    status: z.string(),
    due_date: z.date().optional(),
  })

  type TaskFormData = z.infer<typeof formSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      name: task?.name ?? '',
      description: task?.description ?? '',
      due_date: task?.due_date ? new Date(task.due_date) : undefined,
      status,
      subtasks,
    },
  })

  const subtasksValues = watch('subtasks')

  const handleAddSubtask = useCallback(() => {
    const newSubtask: SubtaskProps = {
      id: uuidv4(),
      name: '',
      is_completed: false,
    }

    const updated = [...subtasks, newSubtask]

    setSubtasks(updated)
    setValue('subtasks', updated)
  }, [subtasks, setValue])

  const handleChangeSubtask = useCallback(
    (index: number, newValue: string) => {
      const updated = subtasksValues.map((s, i) =>
        i === index ? { ...s, name: newValue } : s,
      )

      setSubtasks(updated)
      setValue('subtasks', updated)
    },
    [subtasksValues, setValue],
  )

  const handleRemoveSubtask = useCallback(
    (indexToRemove: number) => {
      const updated = getValues('subtasks').filter(
        (_, i) => i !== indexToRemove,
      )

      setSubtasks(updated)
      setValue('subtasks', updated)
    },
    [getValues, setValue],
  )

  const handleReorderSubtask = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = subtasks.findIndex(
      (s) => String(s.id) === String(active.id),
    )
    const newIndex = subtasks.findIndex((s) => String(s.id) === String(over.id))
    if (oldIndex === -1 || newIndex === -1) return

    // The submit payload derives each subtask's `order` from its array index,
    // so reordering here persists on save (no extra request needed).
    const reordered = arrayMove(subtasks, oldIndex, newIndex)
    setSubtasks(reordered)
    setValue('subtasks', reordered)
  }

  const handleChangeStatus = (
    newStatus: string,
    columnToEditId?: string | number,
  ) => {
    setStatus(newStatus)
    setValue('status', newStatus)

    if (columnToEditId) setColumnId(columnToEditId)
  }

  const handleSubmitTask = async (data: TaskFormData) => {
    try {
      if (!activeBoard) return

      const payload = {
        name: data.name,
        description: data.description || '',
        due_date: data.due_date,
        column_id: columnId,
        subtasks: subtasks
          .filter((subtask) => subtask.name.trim() !== '')
          .map((subtask, index) => ({
            ...subtask,
            order: index,
          })),
        tags: taskTags.map((tag) => Number(tag.id)),
      }

      await (isEditing
        ? api.put(`/tasks/${task?.id}`, payload)
        : api.post('/tasks', payload))

      await activeBoardMutate()
      resetForm()
      onClose()
    } catch (error) {
      handleApiError(error)
    }
  }

  useEffect(() => {
    if (activeBoard && !isEditing) {
      const initialColumn = activeBoard.columns?.[0]
      if (initialColumn) {
        setStatus(initialColumn.name)
        setValue('status', initialColumn.name)
        setColumnId(initialColumn.id as string)
      }
    }
  }, [activeBoard, isEditing, setValue])

  const resetForm = useCallback(() => {
    setSubtasks(initialSubtasks)
    setTaskTags([])
    reset()
  }, [reset])

  return {
    register,
    handleSubmit,
    errors,
    status,
    subtasks,
    taskTags,
    activeBoard,
    setValue,
    resetForm,
    handleAddSubtask,
    handleChangeSubtask,
    handleRemoveSubtask,
    handleReorderSubtask,
    handleChangeStatus,
    handleSubmitTask,
    setTaskTags,
    watch,
  }
}
