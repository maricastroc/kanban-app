import { v4 as uuidv4 } from 'uuid'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleApiError } from '@/utils/handleApiError'
import { SubtaskProps } from '@/@types/subtask'
import { MIN_SUBTASKS, MIN_TITLE_LENGTH } from '@/utils/constants'
import { z } from 'zod'
import { api } from '@/lib/axios'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { TaskProps } from '@/@types/task'
import { TaskTagProps } from '@/@types/task-tag'

interface AddTaskModalProps {
  isEditing?: boolean
  task?: TaskProps
  onClose: () => void
}

const initialSubtasks = [
  { id: uuidv4(), name: '', is_completed: false },
  { id: uuidv4(), name: '', is_completed: false },
]

const subtaskSchema = z.object({
  id: z.number().or(z.string()),
  name: z.string().min(1, { message: 'Subtask title is required' }),
  is_completed: z.boolean(),
})

export const useTaskForm = ({
  isEditing = false,
  task,
  onClose,
}: AddTaskModalProps) => {
  const { activeBoard, activeBoardMutate, handleSetIsLoading } =
    useBoardsContext()

  const [columnId, setColumnId] = useState<string | number | undefined>()

  const [taskTags, setTaskTags] = useState<TaskTagProps[]>([])

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>(
    isEditing && task?.subtasks ? task.subtasks : initialSubtasks,
  )
  const [status, setStatus] = useState(
    isEditing && task?.status ? task.status : '',
  )

  const formSchema = z
    .object({
      id: z.number().or(z.string()),
      name: z.string().min(MIN_TITLE_LENGTH, { message: 'Title is required' }),
      description: z.string().optional(),
      subtasks: z
        .array(subtaskSchema)
        .min(MIN_SUBTASKS, { message: 'At least one subtask is required' }),
      status: z.string(),
      due_date: z.date().optional(),
    })
    .refine(
      (data) => {
        const names = data.subtasks.map((s) => s.name.trim().toLowerCase())
        const uniqueNames = new Set(names)
        return uniqueNames.size === names.length
      },
      {
        message: 'Subtask names must be unique',
        path: ['subtasks'],
      },
    )
    .refine(
      (data) => {
        if (!activeBoard) return true

        const column = activeBoard.columns.find(
          (col) => col.name === data.status,
        )
        if (!column) return true

        const taskAlreadyExists = column.tasks?.some((t) => {
          const isSameName =
            t.name.trim().toLowerCase() === data.name.trim().toLowerCase()
          const isSameTask = isEditing && t.uuid === task?.uuid
          return isSameName && !isSameTask
        })

        return !taskAlreadyExists
      },
      {
        message: 'A task with this name already exists in this column',
        path: ['name'],
      },
    )

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

  const resetForm = useCallback(() => {
    setSubtasks(initialSubtasks)
    setTaskTags([])
    reset()
  }, [reset])

  const handleAddSubtask = useCallback(() => {
    const newSubtask: SubtaskProps = {
      id: uuidv4(),
      name: '',
      is_completed: false,
    }
    const updatedSubtasks = [...subtasks, newSubtask]
    setSubtasks(updatedSubtasks)
    setValue('subtasks', updatedSubtasks)
  }, [subtasks, setValue])

  const handleChangeSubtask = useCallback(
    (index: number, newValue: string) => {
      const updatedSubtasks = subtasksValues.map((task, i) =>
        i === index ? { ...task, name: newValue } : task,
      )
      setSubtasks(updatedSubtasks)
      setValue('subtasks', updatedSubtasks)
    },
    [subtasksValues, setValue],
  )

  const handleRemoveSubtask = useCallback(
    (indexToRemove: number) => {
      const updatedSubtasks = getValues('subtasks').filter(
        (_, index) => index !== indexToRemove,
      )
      setSubtasks(updatedSubtasks)
      setValue('subtasks', updatedSubtasks)
    },
    [getValues, setValue],
  )

  const handleChangeStatus = useCallback(
    (newStatus: string, columnId?: string | number) => {
      setStatus(newStatus)
      setValue('status', newStatus)
      if (columnId) setColumnId(columnId)
    },
    [setValue],
  )

  const handleSubmitTask = async (data: TaskFormData) => {
    try {
      handleSetIsLoading(true)
      onClose()

      if (!activeBoard) return

      const payload = {
        name: data.name,
        description: data.description || '',
        due_date: data.due_date,
        column_id: columnId,
        status,
        subtasks: subtasks.map((subtask, index) => ({
          ...subtask,
          order: index,
        })),
        tags: taskTags,
      }

      await (isEditing
        ? api.put(`/tasks/${task?.uuid}`, payload)
        : api.post('/tasks', payload))

      await activeBoardMutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      handleSetIsLoading(false)
      resetForm()
    }
  }

  useEffect(() => {
    if (activeBoard && !isEditing) {
      const initialColumn = activeBoard.columns[0]
      if (initialColumn) {
        setStatus(initialColumn.name)
        setValue('status', initialColumn.name)
        setColumnId(initialColumn.id as string)
      }
    }
  }, [activeBoard, isEditing, setValue])

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
    handleChangeStatus,
    handleSubmitTask,
    setTaskTags,
    watch,
  }
}
