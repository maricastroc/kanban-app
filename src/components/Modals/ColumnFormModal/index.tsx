import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { LayoutContainer, ColumnContent } from './styles'
import * as Dialog from '@radix-ui/react-dialog'

import { Button } from '@/components/Shared/Button'
import { FieldsContainer } from '@/components/Shared/FieldsContainer'
import { Field } from '@/components/Shared/Field'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { ModalContent, ModalOverlay, ModalTitle } from '@/styles/shared'
import { CustomLabel } from '@/components/Shared/Label'
import { BoardColumnProps } from '@/@types/board-column'
import { CustomInput } from '@/components/Shared/Input'
import { InputContainer } from '@/components/Shared/InputContainer'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormContainer } from '@/components/Shared/FormContainer'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import toast from 'react-hot-toast'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { useBoardsContext } from '@/contexts/BoardsContext'

interface ColumnFormModalProps {
  onClose: () => void
}

const columnSchema = z.object({
  id: z.string(),
  name: z.string().min(3, {
    message: 'Column Name must have at least three characters',
  }),
})

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: 'Title is required' }),
  columns: z
    .array(columnSchema)
    .min(1, { message: 'At least one column is required' }),
})

export type FormData = z.infer<typeof formSchema>

export function ColumnFormModal({ onClose }: ColumnFormModalProps) {
  useEscapeKeyHandler(onClose)

  const { activeBoard, mutate } = useBoardsContext()

  const [isLoading, setIsLoading] = useState(false)

  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>(
    activeBoard?.columns ?? [],
  )

  const {
    register,
    reset,
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

  const handleEditColumns = async () => {
    try {
      setIsLoading(true)

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

      const payload = {
        columns: updatedColumns,
        boardId: activeBoard?.id,
      }

      const response = await api.put('/columns/edit', payload)

      toast?.success(response.data.message)

      mutate()
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
        <FormContainer onSubmit={handleSubmit(handleEditColumns)}>
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

        {isLoading && <LoadingComponent />}
      </ModalContent>
    </Dialog.Portal>
  )
}
