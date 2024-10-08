import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ColumnsContainer, ColumnsContent } from './styles'
import { ModalContent, ModalOverlay, ModalTitle } from '@/styles/shared'

import { FormContainer } from '@/components/Shared/FormContainer'
import { InputContainer } from '@/components/Shared/InputContainer'
import { Button } from '@/components/Shared/Button'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { initialBoardColumns } from '@/utils/getInitialValues'
import { FieldsContainer } from '@/components/Shared/FieldsContainer'
import { Field } from '@/components/Shared/Field'
import { CustomInput } from '@/components/Shared/Input'
import { CustomLabel } from '@/components/Shared/Label'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { BoardColumnProps } from '@/@types/board-column'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { toast } from 'react-toastify'
import {
  MIN_BOARD_NAME_LENGTH,
  MIN_COLUMN_NAME_LENGTH,
  MAX_COLUMNS,
} from '@/utils/constants'
import { BoardProps } from '@/@types/board'

interface BoardModalProps {
  board?: BoardProps
  onClose: () => void
  isEditing: boolean
}

const columnSchema = z.object({
  name: z.string().min(MIN_COLUMN_NAME_LENGTH, { message: 'Column name is required' }),
})

const formSchema = z.object({
  name: z.string().min(MIN_BOARD_NAME_LENGTH, { message: 'Board title is required' }),
  columns: z
    .array(columnSchema)
    .min(1, { message: 'At least one column is required' })
    .max(MAX_COLUMNS, {
      message: `A maximum of ${MAX_COLUMNS} columns is allowed`,
    }),
})

export type FormData = z.infer<typeof formSchema>

export function BoardFormModal({ board, onClose, isEditing }: BoardModalProps) {
  const { createNewBoard, editBoard } = useBoardsContext()

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>(
    board?.columns || initialBoardColumns,
  )

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    register,
  } = useForm<FormData>({
    defaultValues: {
      name: board?.name || '',
      columns: board?.columns || [],
    },
    resolver: zodResolver(formSchema),
  })

  const handleAddColumn = () => {
    const newColumn = { name: '', tasks: [] }
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

  const onSubmit = async (data: FormData) => {
    if (isEditing && board) {
      editBoard(board, data.name, boardColumns)
    } else {
      createNewBoard(data.name, boardColumns)
    }
    onClose()
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
          onClick={() => handleRemoveColumn(index)}
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
        <ModalTitle className="DialogTitle">
          {isEditing ? 'Edit Board' : 'Add New Board'}
        </ModalTitle>
        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
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
                type="button"
                variant="secondary"
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
    </Dialog.Portal>
  )
}
