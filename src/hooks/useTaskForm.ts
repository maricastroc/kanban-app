import { v4 as uuidv4 } from 'uuid'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleApiError } from '@/utils/handleApiError'
import { toast } from 'react-toastify'
import { TagProps } from '@/@types/tag'
import { SubtaskProps } from '@/@types/subtask'
import { MIN_SUBTASKS, MIN_TITLE_LENGTH } from '@/utils/constants'
import { z } from 'zod'
import { api } from '@/lib/axios'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { TaskProps } from '@/@types/task'
import { BoardProps } from '@/@types/board'
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

export const useTaskForm = ({ isEditing = false, task, onClose }: AddTaskModalProps) => {
  const { activeBoard, activeBoardMutate, handleChangeActiveBoard } = useBoardsContext()
  
  const [isLoading, setIsLoading] = useState(false)

  const [columnId, setColumnId] = useState<string | number | undefined>()

  const [taskTags, setTaskTags] = useState<TaskTagProps[]>([])

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>(
    isEditing && task?.subtasks ? task.subtasks : initialSubtasks
  )
  const [status, setStatus] = useState(isEditing && task?.status ? task.status : '')

const formSchema = z
  .object({
    id: z.number().or(z.string()),
    name: z.string().min(MIN_TITLE_LENGTH, { message: 'Title is required' }),
    description: z.string().optional(),
    subtasks: z
      .array(subtaskSchema)
      .min(MIN_SUBTASKS, { message: 'At least one subtask is required' }),
    status: z.string(),
    dueDate: z.date().optional(),
  })
  // Validação de nomes únicos das subtasks aplicada no objeto inteiro:
  .refine((data) => {
    const names = data.subtasks.map(s => s.name.trim().toLowerCase())
    const uniqueNames = new Set(names)
    return uniqueNames.size === names.length
  }, {
    message: 'Subtask names must be unique',
    path: ['subtasks'], // aqui o erro vai para errors.subtasks.message mesmo
  })
  .refine((data) => {
    if (!activeBoard) return true

    const column = activeBoard.columns.find((col) => col.name === data.status)
    if (!column) return true

    const taskAlreadyExists = column.tasks?.some((t) => {
      const isSameName = t.name.trim().toLowerCase() === data.name.trim().toLowerCase()
      const isSameTask = isEditing && t.uuid === task?.uuid
      return isSameName && !isSameTask
    })

    return !taskAlreadyExists
  }, {
    message: 'A task with this name already exists in this column',
    path: ['name'],
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
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
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

  const handleChangeSubtask = useCallback((index: number, newValue: string) => {
    const updatedSubtasks = subtasksValues.map((task, i) =>
      i === index ? { ...task, name: newValue } : task
    )
    setSubtasks(updatedSubtasks)
    setValue('subtasks', updatedSubtasks)
  }, [subtasksValues, setValue])

  const handleRemoveSubtask = useCallback((indexToRemove: number) => {
    const updatedSubtasks = getValues('subtasks').filter(
      (_, index) => index !== indexToRemove
    )
    setSubtasks(updatedSubtasks)
    setValue('subtasks', updatedSubtasks)
  }, [getValues, setValue])

  const handleChangeStatus = useCallback((newStatus: string, columnId?: string | number) => {
    setStatus(newStatus)
    setValue('status', newStatus)
    if (columnId) setColumnId(columnId)
  }, [setValue])

  const handleSubmitTask = async (data: TaskFormData) => {
    let fakeTaskId = uuidv4()

    try {
      setIsLoading(true)
      onClose()

      if (!activeBoard) return

      const updatedBoard = isEditing && task 
        ? handleEditTaskOptimistic(data, fakeTaskId)
        : handleCreateTaskOptimistic(data, fakeTaskId)

      handleChangeActiveBoard(updatedBoard as BoardProps)

      const payload = {
        name: data.name,
        description: data.description || '',
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

      activeBoardMutate()
    } catch (error) {
      if (activeBoard) {
        const cleanedBoard = isEditing && task
          ? activeBoard
          : handleCleanupFailedCreation(fakeTaskId)
        handleChangeActiveBoard(cleanedBoard as BoardProps)
      }
      handleApiError(error)
      toast.error(isEditing ? 'Erro ao atualizar task' : 'Erro ao criar task')
    } finally {
      setIsLoading(false)
      resetForm()
    }
  }

  const handleEditTaskOptimistic = (data: TaskFormData, fakeTaskId: string) => {
    if (!task) return activeBoard
    
    return {
      ...activeBoard,
      columns: activeBoard?.columns.map((column) => {
        const filteredTasks = column.tasks?.filter(t => t.uuid !== task.uuid) || []

        if (column.name === task.status && column.name === status) {
          const originalIndex = column.tasks?.findIndex(t => t.uuid === task.uuid)
          const updatedTask = createOptimisticTask(data, task.uuid as string)
          
          if (originalIndex !== undefined && originalIndex >= 0) {
            filteredTasks.splice(originalIndex, 0, updatedTask)
          } else {
            filteredTasks.push(updatedTask)
          }

          return { ...column, tasks: filteredTasks }
        }

        if (column.name === status && task.status !== status) {
          return {
            ...column,
            tasks: [createOptimisticTask(data, task?.uuid as string), ...(column.tasks || [])],
          }
        }

        return { ...column, tasks: filteredTasks }
      }),
    }
  }

  const handleCreateTaskOptimistic = (data: TaskFormData, fakeTaskId: string) => {
    return {
      ...activeBoard,
      columns: activeBoard?.columns.map(column => {
        if (column.name === status) {
          return {
            ...column,
            tasks: [...(column.tasks || []), createOptimisticTask(data, fakeTaskId)],
          }
        }
        return column
      }),
    }
  }

  const createOptimisticTask = (data: TaskFormData, taskId: string) => ({
    id: taskId,
    uuid: taskId,
    name: data.name,
    description: data.description,
    status,
    isOptimistic: true,
    subtasks: subtasks.map(subtask => ({ ...subtask })),
    tags: taskTags,
  })

  const handleCleanupFailedCreation = (fakeTaskId: string) => {
    return {
      ...activeBoard,
      columns: activeBoard?.columns.map(column => ({
        ...column,
        tasks: column.tasks?.filter(t => t.uuid !== fakeTaskId) || [],
      })),
    }
  }

  useEffect(() => {
    if (activeBoard && !isEditing) {
      const initialColumn = activeBoard.columns[0]
      if (initialColumn) {
        setStatus(initialColumn.name)
        setValue('status', initialColumn.name)
        setColumnId(initialColumn.id)
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
    isLoading,
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