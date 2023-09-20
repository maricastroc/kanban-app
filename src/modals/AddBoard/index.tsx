import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'

import { ColumnsContainer, ColumnsContent } from './styles'

import {
  Content,
  FormContainer,
  FormError,
  Input,
  InputContainer,
  InputVariantsContainer,
  Label,
  Overlay,
  Title,
} from '../sharedStyles'

import { Button } from '@/components/Button'
import { InputVariant } from '@/components/InputVariant'
import { ColumnDTO } from '@/dtos/columnDTO'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { initialBoardColumns } from '@/utils/initialValues'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface AddBoardProps {
  onClose: () => void
}

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
})

export type FormData = z.infer<typeof formSchema>

export function AddBoard({ onClose }: AddBoardProps) {
  useEscapeKeyHandler(onClose)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const { createNewBoard } = useBoardsContext()

  const [boardColumns, setBoardColumns] =
    useState<ColumnDTO[]>(initialBoardColumns)

  const [columnErrors, setColumnErrors] = useState<string[]>([])

  function handleAddColumn() {
    const newColumn = {
      name: '',
      tasks: [],
    }
    setBoardColumns([...boardColumns, newColumn])
  }

  function handleRemoveColumn(indexToRemove: number) {
    const updatedColumns = boardColumns.filter(
      (_, index) => index !== indexToRemove,
    )
    setBoardColumns(updatedColumns)
  }

  function handleColumnChange(index: number, newValue: string) {
    const updatedColumns = [...boardColumns]
    updatedColumns[index].name = newValue

    const newColumnErrors = [...columnErrors]
    if (newValue.length === 0) {
      newColumnErrors[index] = 'Required'
    } else {
      newColumnErrors[index] = ''
    }

    setBoardColumns(updatedColumns)
  }

  function renderColumnInput(column: ColumnDTO, index: number) {
    return (
      <InputVariantsContainer key={column.name}>
        {boardColumns.length !== 1 ? (
          <>
            <InputVariant
              inputClassName={`${column.tasks.length > 0 ? 'disabled' : ''} ${
                columnErrors[index] ? 'error' : ''
              }`}
              btnClassName={
                boardColumns[index].tasks.length > 0 ? 'disabled' : ''
              }
              defaultValue={boardColumns[index].name}
              placeholder="e.g. Todo"
              onChange={(e) => handleColumnChange(index, e.target.value)}
              onClick={() => handleRemoveColumn(index)}
            />
            {columnErrors[index] && <span>{columnErrors[index]}</span>}
          </>
        ) : (
          <>
            <Input
              type="text"
              defaultValue={boardColumns[index].name}
              placeholder="e.g. Todo"
              className={`${column.tasks.length > 0 ? 'disabled' : ''} ${
                columnErrors[index] ? 'error' : ''
              }`}
              onChange={(e) => handleColumnChange(index, e.target.value)}
            />
            {columnErrors[index] && <span>{columnErrors[index]}</span>}
          </>
        )}
      </InputVariantsContainer>
    )
  }

  function handleCreateNewBoard(data: FormData) {
    const columnErrors = boardColumns.map((column) =>
      column.name === '' ? 'Required' : '',
    )

    const hasErrors = columnErrors.some((error) => error !== '')

    if (hasErrors) {
      setColumnErrors(columnErrors)
      return
    }

    createNewBoard(data.name, boardColumns)
    onClose()
  }

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content className="bigger">
        <Title>Add New Board</Title>
        <FormContainer onSubmit={handleSubmit(handleCreateNewBoard)}>
          <InputContainer>
            <Label>Name</Label>
            <Input placeholder="e.g. Web Design" {...register('name')} />
            {errors?.name && <FormError>{errors.name.message}</FormError>}
          </InputContainer>

          <ColumnsContainer>
            <Label>Columns</Label>
            <ColumnsContent>
              {boardColumns.map((column, index) =>
                renderColumnInput(column, index),
              )}
            </ColumnsContent>
            {boardColumns.length !== 6 && (
              <Button
                type="button"
                title="+ Add New Column"
                onClick={() => handleAddColumn()}
              />
            )}
          </ColumnsContainer>

          <Button
            type="submit"
            title="Save Changes"
            variant="secondary"
            disabled={isSubmitting}
          />
        </FormContainer>
      </Content>
    </>
  )
}
