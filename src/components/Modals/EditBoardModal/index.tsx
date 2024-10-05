import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Dialog from '@radix-ui/react-dialog'

import {
  ColumnsContainer,
  ColumnsContent,
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
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { toast } from 'react-toastify'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { ModalContent, ModalOverlay, ModalTitle } from '@/styles/shared'

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
  board: BoardProps
  onClose: () => void
}

export function EditBoardModal({ board, onClose }: EditBoardModalProps) {
  const { editBoard } = useBoardsContext()

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>(
    board.columns || [],
  )

  const wait = () => new Promise((resolve) => setTimeout(resolve, 100))

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

  const handleAddColumn = () => {
    const newColumn = { name: '', tasks: [] }
    const updatedColumns = [...boardColumns, newColumn]
    setBoardColumns(updatedColumns)
    setValue('columns', updatedColumns)
  }

  const handleRemoveColumn = (indexToRemove: number) => {
    if (indexToRemove < 0 || indexToRemove >= boardColumns.length) {
      toast.error('Index out of bounds');
      return;
    }
  
    const updatedColumns = boardColumns.filter((_, index) => index !== indexToRemove);
    setBoardColumns(updatedColumns);
    setValue('columns', updatedColumns);
  };

  const handleChangeColumn = (index: number, newValue: string) => {
    if (index < 0 || index >= boardColumns.length) {
      toast.error('Index out of bounds')
      return;
    }
  
    const updatedColumns = boardColumns.map((column, i) =>
      i === index ? { ...column, name: newValue } : column
    );
  
    setBoardColumns(updatedColumns);
  
    setValue('columns', updatedColumns);
  };

  const handleEditBoard = async (data: FormData) => {
    editBoard(board, data.name, boardColumns)
    await wait()
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
          onChange={(e) => handleChangeColumn(index, e.target.value)}
          onClick={() => handleRemoveColumn(index)}
        />
        {<ErrorMessage message={error} />}
      </FieldsContainer>
    )
  }

  return (
    <>
      <ModalOverlay className="DialogOverlay" onClick={() => onClose()} />
      <ModalContent padding="1.5rem 1.5rem 3rem" className="DialogContent" aria-describedby={undefined}>
        <ModalTitle className="DialogTitle">Edit Board</ModalTitle>
        <VisuallyHidden>
          <Dialog.Description />
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
            {boardColumns.length < 6 && (
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
