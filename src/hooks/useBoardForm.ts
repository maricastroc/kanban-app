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
import { useCallback, useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent } from '@dnd-kit/core'

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

// A board column plus a stable client-side key, so the drag-and-drop list keeps
// a consistent identity even for not-yet-saved columns (id === null) or columns
// that share a name. The clientId is never sent to the API.
type DraftColumn = BoardColumnProps & { clientId: string }

let columnKeySeq = 0

const attachClientIds = (columns: BoardColumnProps[]): DraftColumn[] =>
  columns.map((column) => ({
    ...column,
    clientId:
      (column as DraftColumn).clientId ??
      (column.id != null ? `col-${column.id}` : `new-${++columnKeySeq}`),
  }))

export const useBoardForm = ({ isEditing, onClose }: Props) => {
  const { activeBoard, boardsMutate, handleChangeActiveBoard } =
    useBoardsContext()

  const [boardColumns, setBoardColumns] = useState<DraftColumn[]>(
    attachClientIds(
      activeBoard?.columns || [
        { id: null, name: 'Todo', tasks: [] },
        { id: null, name: 'Doing', tasks: [] },
      ],
    ),
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
    const newColumn: DraftColumn = {
      id: null,
      name: '',
      tasks: [],
      clientId: `new-${++columnKeySeq}`,
    }
    const updatedColumns = [...boardColumns, newColumn]
    setBoardColumns(updatedColumns)
    setValue('columns', updatedColumns)
  }

  const handleReorderColumns = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = boardColumns.findIndex((c) => c.clientId === active.id)
    const newIndex = boardColumns.findIndex((c) => c.clientId === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(boardColumns, oldIndex, newIndex)
    setBoardColumns(reordered)
    setValue('columns', reordered)
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

  const resetColumns = useCallback(() => {
    if (isEditing) {
      const cols = attachClientIds(activeBoard?.columns || [])
      setBoardColumns(cols)

      reset({
        id: activeBoard?.id,
        name: activeBoard?.name || '',
        columns: cols,
      })
    } else {
      const cols = attachClientIds(initialBoardColumns)
      setBoardColumns(cols)

      reset({
        id: null,
        name: '',
        columns: cols,
      })
    }
  }, [activeBoard, isEditing, reset])

  useEffect(() => {
    resetColumns()
  }, [resetColumns])

  return {
    handleAddColumn,
    handleRemoveColumn,
    handleReorderColumns,
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
