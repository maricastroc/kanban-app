import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { LayoutContainer, ColumnContent } from './styles'
import * as Dialog from '@radix-ui/react-dialog'

import { Button } from '@/components/Shared/Button'
import { FieldsContainer } from '@/components/Shared/FieldsContainer'
import { Field } from '@/components/Shared/Field'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { ModalContent, ModalOverlay, ModalTitle } from '@/styles/shared'
import { CustomLabel } from '@/components/Shared/Label'
import { BoardColumnProps } from '@/@types/board-column'
import { useTaskContext } from '@/contexts/TasksContext'
import { CustomInput } from '@/components/Shared/Input'
import { InputContainer } from '@/components/Shared/InputContainer'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { FormContainer } from '@/components/Shared/FormContainer'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { simulateDelay } from '@/utils/simulateDelay'
import {
  MIN_BOARD_NAME_LENGTH,
  MIN_COLUMN_NAME_LENGTH,
} from '@/utils/constants'

interface ColumnFormModalProps {
  onClose: () => void
}

const columnSchema = z.object({
  id: z.string(),
  name: z.string().min(MIN_COLUMN_NAME_LENGTH, {
    message: 'Column Name must have at least three characters',
  }),
})

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(MIN_BOARD_NAME_LENGTH, { message: 'Title is required' }),
  columns: z
    .array(columnSchema)
    .min(1, { message: 'At least one column is required' }),
})

export type FormData = z.infer<typeof formSchema>

export function ColumnFormModal({ onClose }: ColumnFormModalProps) {
  useEscapeKeyHandler(onClose)

  const { activeBoard } = useBoardsContext()

  const { updateBoardColumns } = useTaskContext()

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>(
    activeBoard?.columns ?? [],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      id: activeBoard?.id,
      name: activeBoard?.name,
      columns: activeBoard?.columns,
    },
    resolver: zodResolver(formSchema),
  })

  useEscapeKeyHandler(onClose)

  const handleAddColumn = () => {
    const newColumn = { id: uuidv4(), name: '', tasks: [] }
    const updatedColumns = [...boardColumns, newColumn]

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

  const handleUpdateBoardColumns = async () => {
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

    updateBoardColumns(updatedColumns)
    await simulateDelay()
    onClose()
  }

  const renderColumnInput = (column: BoardColumnProps, index: number) => {
    const error = errors.columns?.[index]?.name?.message

    const isDisabled = activeBoard?.columns.some(
      (existingColumn) => existingColumn.name === column.name,
    )

    return (
      <FieldsContainer key={index}>
        <Field
          key={index}
          hasError={!!error}
          isDisabled={isDisabled}
          btnVariant={isDisabled ? 'disabled' : ''}
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
      <ModalOverlay className="DialogOverlay" onClick={() => onClose()} />
      <ModalContent className="DialogContent">
        <ModalTitle className="DialogTitle">Add New Column</ModalTitle>
        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>
        <FormContainer onSubmit={handleSubmit(handleUpdateBoardColumns)}>
          <InputContainer>
            <CustomLabel>Name</CustomLabel>
            <CustomInput
              className="disabled"
              type="text"
              value={activeBoard?.name}
              {...register('name')}
            />
          </InputContainer>
          <LayoutContainer>
            <CustomLabel>Columns</CustomLabel>
            <ColumnContent>
              {boardColumns.map((column, index) => (
                <div key={`${column.name}-${index}`}>
                  {renderColumnInput(column, index)}
                </div>
              ))}
            </ColumnContent>
            {boardColumns.length < 6 && (
              <Button
                variant="secondary"
                title="+ Add New Column"
                onClick={handleAddColumn}
              />
            )}
          </LayoutContainer>
          <Button
            disabled={isSubmitting}
            title="Create Column"
            type="submit"
            variant="primary"
          />
        </FormContainer>
      </ModalContent>
    </Dialog.Portal>
  )
}
