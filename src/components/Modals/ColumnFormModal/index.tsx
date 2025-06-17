import { useState } from 'react'

import { LayoutContainer, ColumnContent } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import toast from 'react-hot-toast'

import {
  CloseButton,
  HeaderContent,
  ModalContent,
  ModalOverlay,
  ModalTitle,
} from '@/styles/shared'

import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { handleApiError } from '@/utils/handleApiError'
import { BoardColumnProps } from '@/@types/board-column'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { api } from '@/lib/axios'

import { Button } from '@/components/Shared/Button'
import { FieldsContainer } from '@/components/Shared/FieldsContainer'
import { Field } from '@/components/Shared/Field'
import { CustomLabel } from '@/components/Shared/Label'
import { CustomInput } from '@/components/Shared/Input'
import { InputContainer } from '@/components/Shared/InputContainer'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { FormContainer } from '@/components/Shared/FormContainer'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'

interface ColumnFormModalProps {
  onClose: () => void
}

const columnSchema = z.object({
  id: z.number().or(z.string()).nullable(),
  name: z.string().min(3, {
    message: 'Column Name must have at least three characters',
  }),
})

const formSchema = z.object({
  id: z.number().or(z.string()).nullable(),
  name: z
    .string()
    .min(3, { message: 'Title must have at least three characters' }),
  columns: z
    .array(columnSchema)
    .min(1, { message: 'At least one column is required' }),
})

export type FormData = z.infer<typeof formSchema>

export function ColumnFormModal({ onClose }: ColumnFormModalProps) {
  useEscapeKeyHandler(onClose)

  const { activeBoard, activeBoardMutate } = useBoardsContext()

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
      id: activeBoard?.id || null,
      name: activeBoard?.name,
      columns: activeBoard?.columns,
    },
    resolver: zodResolver(formSchema),
  })

  useEscapeKeyHandler(onClose)

  const handleAddColumn = () => {
    const newColumn = { id: null, name: '', tasks: [] }
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
      }

      const response = await api.put(`boards/${activeBoard?.id}`, payload)

      toast?.success(response.data.message)

      await activeBoardMutate()
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
          onClick={() => {
            const existingColumn = activeBoard?.columns?.some(
              (boardColumn) => boardColumn.id === column.id,
            )

            if (!existingColumn) {
              handleRemoveColumn(index)
            }
          }}
        />
        {<ErrorMessage message={error} />}
      </FieldsContainer>
    )
  }

  return (
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={() => onClose()} />
      <ModalContent className="DialogContent">
        <HeaderContent>
          <ModalTitle className="DialogTitle">{'Add New Column'}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FontAwesomeIcon icon={faX} />
          </CloseButton>
        </HeaderContent>
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
                type="button"
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

      {isLoading && <LoadingComponent />}
    </Dialog.Portal>
  )
}
