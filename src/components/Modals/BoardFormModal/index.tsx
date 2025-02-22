/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as Dialog from '@radix-ui/react-dialog'
import { ColumnsContainer, ColumnsContent } from './styles'
import {
  Loader,
  ModalContent,
  ModalLoading,
  ModalOverlay,
  ModalTitle,
} from '@/styles/shared'

import { FormContainer } from '@/components/Shared/FormContainer'
import { InputContainer } from '@/components/Shared/InputContainer'
import { Button } from '@/components/Shared/Button'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { initialBoardColumns } from '@/utils/getInitialValues'
import { FieldsContainer } from '@/components/Shared/FieldsContainer'
import { Field } from '@/components/Shared/Field'
import { CustomInput } from '@/components/Shared/Input'
import { CustomLabel } from '@/components/Shared/Label'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { BoardColumnProps } from '@/@types/board-column'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { MIN_BOARD_NAME_LENGTH, MAX_COLUMNS } from '@/utils/constants'
import { BoardProps } from '@/@types/board'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { Circles } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { KeyedMutator } from 'swr'
import { AxiosResponse } from 'axios'

interface BoardModalProps {
  board?: BoardProps
  onClose: () => void
  isEditing: boolean
  mutate: KeyedMutator<AxiosResponse<BoardProps, any>>
  boardsMutate: KeyedMutator<AxiosResponse<BoardProps[], any>>
}

const columnSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: 'Column name is required' }),
})

const formSchema = z.object({
  id: z.string(),
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

export function BoardFormModal({
  board,
  onClose,
  isEditing,
  mutate,
  boardsMutate,
}: BoardModalProps) {
  const [boardColumns, setBoardColumns] = useState<BoardColumnProps[]>(
    board?.columns || [
      { id: uuidv4(), name: 'Todo', tasks: [] },
      { id: uuidv4(), name: 'Doing', tasks: [] },
    ],
  )

  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    register,
  } = useForm<FormData>({
    defaultValues: {
      id: uuidv4(),
      name: board?.name || '',
      columns: isEditing ? board?.columns : initialBoardColumns,
    },
    resolver: zodResolver(formSchema),
  })

  const handleCreateBoard = async (data: FormData) => {
    setIsLoading(true)

    try {
      const payload = {
        name: data.name,
        columns: boardColumns,
      }

      const response = await api.post('/board/create', payload)

      toast?.success(response.data.message)

      mutate()
      boardsMutate()
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

  const handleEditBoard = async (data: FormData) => {
    setIsLoading(true)

    try {
      const payload = {
        boardId: board?.id,
        name: data.name,
        columns: boardColumns,
      }

      const response = await api.put('/board/edit', payload)

      toast?.success(response.data.message)

      mutate()
      boardsMutate()
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
    const newColumn = { id: uuidv4(), name: '', tasks: [] }
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
        <FormContainer
          onSubmit={
            isEditing
              ? handleSubmit(handleEditBoard)
              : handleSubmit(handleCreateBoard)
          }
        >
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

        {isLoading && (
          <ModalLoading>
            <Loader>
              <Circles color="#635FC7" height={80} width={80} />
            </Loader>
          </ModalLoading>
        )}
      </ModalContent>
    </Dialog.Portal>
  )
}
