import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { initialBoardColumns } from '@/utils/getInitialValues'
import { handleApiError } from '@/utils/handleApiError'
import { MIN_BOARD_NAME_LENGTH, MAX_COLUMNS } from '@/utils/constants'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { BoardColumnProps } from '@/@types/board-column'
import { FormContainer } from '@/components/Shared/FormContainer'
import { InputContainer } from '@/components/Shared/InputContainer'
import { Button } from '@/components/Shared/Button'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { FieldsContainer } from '@/components/Shared/FieldsContainer'
import { Field } from '@/components/Shared/Field'
import { CustomInput } from '@/components/Shared/Input'
import { CustomLabel } from '@/components/Shared/Label'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { ColumnsContainer, ColumnsContent } from './styles'
import {
  CloseButton,
  HeaderContent,
  ModalContent,
  ModalOverlay,
  ModalTitle,
} from '@/styles/shared'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

interface BoardModalProps {
  onClose: () => void
  isEditing: boolean
}

const columnSchema = z.object({
  id: z.number().or(z.string()).nullable(),
  name: z.string().min(3, { message: 'Column name is required' }),
})

const formSchema = z.object({
  id: z.number().or(z.string()).nullable(),
  name: z
    .string()
    .min(MIN_BOARD_NAME_LENGTH, { message: 'Board title is required' }),
  columns: z
    .array(columnSchema)
    .min(1, { message: 'At least one column is required' })
    .max(MAX_COLUMNS, {
      message: `A maximum of ${MAX_COLUMNS} columns is allowed`,
    }),
})

export type FormData = z.infer<typeof formSchema>

export function BoardFormModal({ onClose, isEditing }: BoardModalProps) {
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
        ? await api.put(`boards/${activeBoard?.uuid}`, payload)
        : await api.post('/boards', payload)

      toast?.success(response.data.message)

      handleChangeActiveBoard(response.data.data.board)

      await boardsMutate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
      reset()

      setTimeout(() => {
        onClose()
      }, 500)
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

  const renderColumnInput = (column: BoardColumnProps, index: number) => {
    const error = errors.columns?.[index]?.name?.message

    return (
      <FieldsContainer key={index}>
        <Field
          hasError={!!error}
          isDisabled={false}
          btnVariant={boardColumns?.length > 1 ? '' : 'disabled'}
          defaultValue={column.name}
          placeholder="e.g. New Column"
          onChange={(e) => handleChangeColumn(index, e.target.value)}
          onClick={() => {
            if (boardColumns?.length > 1) {
              handleRemoveColumn(index)
            } else {
              toast.error('Board needs to have at least one column.')
            }
          }}
        />
        {<ErrorMessage message={error} />}
      </FieldsContainer>
    )
  }

  return (
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={onClose} />
      <ModalContent
        padding="1.5rem 1.5rem 3rem"
        className="DialogContent"
        aria-describedby={undefined}
      >
        <HeaderContent>
          <ModalTitle className="DialogTitle">
            {isEditing ? 'Edit Board' : 'Add New Board'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FontAwesomeIcon icon={faX} />
          </CloseButton>
        </HeaderContent>
        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>
        <FormContainer onSubmit={handleSubmit(handleSubmitBoard)}>
          <InputContainer>
            <CustomLabel htmlFor="name">Board Name</CustomLabel>
            <CustomInput
              hasError={!!errors.name}
              placeholder="e.g. Backend Tasks"
              {...register('name')}
            />
            {<ErrorMessage message={errors.name?.message} />}
          </InputContainer>

          <ColumnsContainer>
            <CustomLabel>Columns</CustomLabel>
            <ColumnsContent>
              {boardColumns.map((column, index) => (
                <div key={`${column.name}-${index}`}>
                  {renderColumnInput(column, index)}
                </div>
              ))}
            </ColumnsContent>
            {boardColumns.length < MAX_COLUMNS && (
              <Button
                variant="secondary"
                type="button"
                title="+ Add New Column"
                onClick={handleAddColumn}
              />
            )}
          </ColumnsContainer>

          <Button
            disabled={isSubmitting}
            title={isEditing ? 'Save Changes' : 'Create Board'}
            type="submit"
            variant="primary"
          />
        </FormContainer>
      </ModalContent>

      {isLoading && <LoadingComponent />}
    </Dialog.Portal>
  )
}
