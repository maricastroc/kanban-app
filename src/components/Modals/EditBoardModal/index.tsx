import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Dialog from '@radix-ui/react-dialog'

import { ColumnsContainer, ColumnsContent } from './styles'
import { BoardProps } from '@/@types/board'
import { BoardColumnProps } from '@/@types/board-column'
import { InputContainer } from '@/components/Shared/InputContainer'
import { Field } from '@/components/Shared/Field'
import { FieldsContainer } from '@/components/Shared/FieldsContainer'
import { Button } from '@/components/Shared/Button'
import { FormContainer } from '@/components/Shared/FormContainer'
import { CustomLabel } from '@/components/Shared/Label'
import { CustomInput } from '@/components/Shared/Input'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { toast } from 'react-toastify'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { ModalContent, ModalOverlay, ModalTitle } from '@/styles/shared'
import { simulateDelay } from '@/utils/simulateDelay'
import {
  MAX_COLUMNS,
  MIN_BOARD_NAME_LENGTH,
  MIN_COLUMN_NAME_LENGTH,
} from '@/utils/constants'

const columnSchema = z.object({
  name: z
    .string()
    .min(MIN_COLUMN_NAME_LENGTH, { message: 'Column name is required' }),
})

const formSchema = z.object({
  name: z.string().min(MIN_BOARD_NAME_LENGTH, {
    message: 'Board name must have at least 3 characters',
  }),
  columns: z
    .array(columnSchema)
    .min(1, { message: 'At least one column is required' })
    .max(MAX_COLUMNS, {
      message: `A maximum of ${MAX_COLUMNS} columns is allowed`,
    }),
})

export type FormData = z.infer<typeof formSchema>

interface EditBoardModalProps {
  board: BoardProps
  onClose: () => void
}

export function EditBoardModal({ board, onClose }: EditBoardModalProps) {
  const { editBoard } = useBoardsContext()
  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>(
    board.columns || [],
  )

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    register,
  } = useForm<FormData>({
    defaultValues: {
      name: board.name || '',
      columns: boardColumns,
    },
    resolver: zodResolver(formSchema),
  })

  useEscapeKeyHandler(onClose)

  const updateColumnState = (updatedColumns: BoardColumnProps[]) => {
    setBoardColumns(updatedColumns)
    setValue('columns', updatedColumns)
  }

  const handleAddColumn = () => {
    const newColumn = { name: '', tasks: [] }
    updateColumnState([...boardColumns, newColumn])
  }

  const handleRemoveColumn = (indexToRemove: number) => {
    if (indexToRemove < 0 || indexToRemove >= boardColumns.length) {
      toast.error('Index out of bounds')
      return
    }
    const updatedColumns = boardColumns.filter(
      (_, index) => index !== indexToRemove,
    )
    updateColumnState(updatedColumns)
  }

  const handleChangeColumn = (index: number, newValue: string) => {
    if (index < 0 || index >= boardColumns.length) {
      toast.error('Index out of bounds')
      return
    }
    const updatedColumns = boardColumns.map((column, i) =>
      i === index ? { ...column, name: newValue } : column,
    )
    updateColumnState(updatedColumns)
  }

  const handleEditBoard = async (data: FormData) => {
    editBoard(board, data.name, boardColumns)
    await simulateDelay()
    onClose()
  }

  const renderColumnInput = (column: BoardColumnProps, index: number) => {
    const error = errors.columns?.[index]?.name?.message

    return (
      <FieldsContainer key={index}>
        <Field
          hasError={!!error}
          value={column.name}
          btnVariant={boardColumns?.length > 1 ? '' : 'disabled'}
          onChange={(e) => handleChangeColumn(index, e.target.value)}
          onClick={() => handleRemoveColumn(index)}
        />
        {<ErrorMessage message={error} />}
      </FieldsContainer>
    )
  }

  return (
    <>
      <ModalOverlay className="DialogOverlay" onClick={onClose} />
      <ModalContent
        padding="1.5rem 1.5rem 3rem"
        className="DialogContent"
        aria-describedby={undefined}
      >
        <ModalTitle className="DialogTitle">Edit Board</ModalTitle>
        <VisuallyHidden>
          <Dialog.Description>
            {`Edit the board's details here.`}
          </Dialog.Description>
        </VisuallyHidden>
        <FormContainer onSubmit={handleSubmit(handleEditBoard)}>
          <InputContainer>
            <CustomLabel>Name</CustomLabel>
            <CustomInput
              hasError={!!errors.name}
              type="text"
              {...register('name')}
            />
            {<ErrorMessage message={errors.name?.message} />}
          </InputContainer>

          <ColumnsContainer>
            <CustomLabel>Columns</CustomLabel>
            <ColumnsContent>
              {boardColumns.map((column, index) =>
                renderColumnInput(column, index),
              )}
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
            title="Save Changes"
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          />
        </FormContainer>
      </ModalContent>
    </>
  )
}
