import { api } from '@/lib/axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { initialBoardColumns } from '@/utils/getInitialValues'
import { handleApiError } from '@/utils/handleApiError'
import { MIN_BOARD_NAME_LENGTH, MAX_COLUMNS } from '@/utils/constants'
import { BoardColumnProps } from '@/@types/board-column'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useEffect, useState } from 'react'

interface Props {
  isEditing: boolean
  onClose: () => void
}

const columnSchema = z.object({
  id: z.number().or(z.string()).nullable(),
  name: z
    .string()
    .min(3, { message: 'Column name must have at least 3 characters.' }),
})

const formSchema = z.object({
  id: z.number().or(z.string()).nullable(),
  name: z.string().min(MIN_BOARD_NAME_LENGTH, {
    message: 'Board title must have at least 3 characters.',
  }),
  columns: z
    .array(columnSchema)
    .min(1, { message: 'At least one column is required' })
    .max(MAX_COLUMNS, {
      message: `A maximum of ${MAX_COLUMNS} columns is allowed`,
    }),
})

export type FormData = z.infer<typeof formSchema>

export const useBoardForm = ({ isEditing, onClose }: Props) => {
  const { activeBoard, boardsMutate, handleChangeActiveBoard } =
    useBoardsContext()

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>(
    activeBoard?.columns || [
      { id: null, name: 'Todo', tasks: [] },
      { id: null, name: 'Doing', tasks: [] },
    ],
  )

  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
    register,
  } = useForm<FormData>({
    defaultValues: {
      id: isEditing ? activeBoard?.id : null,
      name: isEditing ? activeBoard?.name : '',
      columns: isEditing ? activeBoard?.columns : initialBoardColumns,
    },
    resolver: zodResolver(formSchema),
  })

  const handleSubmitBoard: (data: FormData) => Promise<void> = async (
    data: FormData,
  ) => {
    setIsLoading(true)

    try {
      let payload

      if (isEditing) {
        const formValues = watch()

        const updatedColumns: BoardColumnProps[] = formValues.columns.map(
          (column, index) => {
            const existingColumn = boardColumns[index]

            return {
              id: column.id,
              name: column.name,
              tasks: existingColumn?.tasks || [],
            }
          },
        )

        payload = {
          boardId: activeBoard?.id,
          name: data.name,
          columns: updatedColumns,
        }
      } else {
        payload = {
          name: data.name,
          columns: boardColumns,
        }
      }

      const response = isEditing
        ? await api.put(`boards/${activeBoard?.id}`, payload)
        : await api.post('/boards', payload)

      toast?.success(response.data.message)

      handleChangeActiveBoard(response.data.data.board)

      await boardsMutate()

      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
      reset()
    }
  }

  const handleAddColumn = () => {
    const newColumn = { id: null, name: '', tasks: [] }
    const updatedColumns = [...boardColumns, newColumn]
    setBoardColumns(updatedColumns)
    setValue('columns', updatedColumns)
  }

  const handleChangeColumn = (index: number, newValue: string) => {
    if (index < 0 || index >= boardColumns.length) {
      toast.error('Index out of bounds')
      return
    }

    const updatedColumns = boardColumns.map((column, i) =>
      i === index ? { ...column, name: newValue } : column,
    )

    setBoardColumns(updatedColumns)
    setValue('columns', updatedColumns)
  }

  const handleRemoveColumn = (indexToRemove: number) => {
    if (indexToRemove < 0 || indexToRemove >= boardColumns.length) {
      toast.error('Index out of bounds')
      return
    }

    const updatedColumns = boardColumns.filter(
      (_, index) => index !== indexToRemove,
    )
    setBoardColumns(updatedColumns)
    setValue('columns', updatedColumns)
  }

  const resetColumns = () => {
    if (isEditing) {
      const cols = activeBoard?.columns || []
      setBoardColumns(cols)

      reset({
        id: activeBoard?.id,
        name: activeBoard?.name || '',
        columns: cols,
      })
    } else {
      setBoardColumns(initialBoardColumns)

      reset({
        id: null,
        name: '',
        columns: initialBoardColumns,
      })
    }
  }

  useEffect(() => {
    if (isEditing) {
      const cols = activeBoard?.columns || []
      setBoardColumns(cols)

      reset({
        id: activeBoard?.id,
        name: activeBoard?.name || '',
        columns: cols,
      })
    } else {
      setBoardColumns(initialBoardColumns)

      reset({
        id: null,
        name: '',
        columns: initialBoardColumns,
      })
    }
  }, [activeBoard, isEditing, reset])

  return {
    handleAddColumn,
    handleRemoveColumn,
    handleSubmitBoard,
    handleSubmit,
    handleChangeColumn,
    register,
    resetColumns,
    isSubmitting,
    boardColumns,
    errors,
    activeBoard,
    isLoading,
  }
}
