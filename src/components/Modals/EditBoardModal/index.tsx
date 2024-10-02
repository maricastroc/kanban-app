import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Dialog from '@radix-ui/react-dialog'

import {
  ColumnsContainer,
  ColumnsContent,
  ModalContent,
  ModalOverlay,
  ModalTitle,
} from './styles'
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

const columnSchema = z.object({
  name: z.string().min(1, { message: 'Column name is required' }),
})

const formSchema = z.object({
  name: z.string().min(3, { message: 'Board name is required' }),
  columns: z
    .array(columnSchema)
    .min(1, { message: 'At least one column is required' })
    .max(6, { message: 'A maximum of 6 columns is allowed' }),
})

export type FormData = z.infer<typeof formSchema>

interface EditBoardModalProps {
  board: BoardProps | null
  onClose: () => void
}

export function EditBoardModal({ board, onClose }: EditBoardModalProps) {
  const { editBoard } = useBoardsContext()

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>(
    board?.columns || [],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: board?.name || '',
      columns: boardColumns,
    },
    resolver: zodResolver(formSchema),
  })

  const handleAddColumn = () => {
    const newColumn = { name: '', tasks: [] }
    const updatedColumns = [...boardColumns, newColumn]
    setBoardColumns(updatedColumns)
    setValue('columns', updatedColumns)
  }

  const handleRemoveColumn = (indexToRemove: number) => {
    const updatedColumns = boardColumns.filter(
      (_, index) => index !== indexToRemove,
    )
    setBoardColumns(updatedColumns)
    setValue('columns', updatedColumns)
  }

  const handleColumnChange = (index: number, newValue: string) => {
    const updatedColumns = [...boardColumns]
    updatedColumns[index].name = newValue
    setBoardColumns(updatedColumns)
    setValue('columns', updatedColumns)
  }

  const handleEditBoard = (data: FormData) => {
    if (board) {
      editBoard(board, data.name, boardColumns)
    }
    onClose()
  }

  const renderColumnInput = (column: BoardColumnProps, index: number) => {
    const error = errors.columns?.[index]?.name?.message

    return (
      <FieldsContainer key={index}>
        <Field
          key={index}
          hasError={!!error}
          isDisabled={false}
          btnVariant={''}
          value={column.name}
          onChange={(e) => handleColumnChange(index, e.target.value)}
          onClick={() => handleRemoveColumn(index)}
        />
        {error && <span>{error}</span>}
      </FieldsContainer>
    )
  }

  return (
    <>
      <ModalOverlay className="DialogOverlay" onClick={() => onClose()} />
      <ModalContent className="DialogContent" aria-describedby={undefined}>
        <ModalTitle className="DialogTitle">Edit Board</ModalTitle>
        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>
        <FormContainer onSubmit={handleSubmit(handleEditBoard)}>
          <InputContainer>
            <CustomLabel>Name</CustomLabel>
            <CustomInput type="text" {...register('name')} />
            {errors.name && <span>{errors.name.message}</span>}
          </InputContainer>

          <ColumnsContainer>
            <CustomLabel>Columns</CustomLabel>
            <ColumnsContent>
              {boardColumns.map((column, index) =>
                renderColumnInput(column, index),
              )}
            </ColumnsContent>
            {boardColumns.length < 6 && (
              <Button
                type="button"
                title="+ Add New Column"
                onClick={handleAddColumn}
              />
            )}
          </ColumnsContainer>

          <Button
            title="Save Changes"
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
          />
        </FormContainer>
      </ModalContent>
    </>
  )
}
