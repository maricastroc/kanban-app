import { useState } from 'react'
import { useBoardsContext } from '@/contexts/BoardsContext'

import { Button } from '@/components/Button'
import { InputVariant } from '@/components/InputVariant'
import { ColumnDTO } from '@/dtos/columnDTO'
import { BoardDTO } from '@/dtos/boardDTO'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'

interface EditBoardProps {
  board: BoardDTO
  onClose: () => void
}

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
})

export type FormData = z.infer<typeof formSchema>

export function EditBoard({ board, onClose }: EditBoardProps) {
  useEscapeKeyHandler(onClose)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      name: board.name,
    },
    resolver: zodResolver(formSchema),
  })

  const { editBoard } = useBoardsContext()

  const [boardColumns, setBoardColumns] = useState<ColumnDTO[]>(board.columns)

  const [columnErrors, setColumnErrors] = useState<string[]>([])

  const handleAddColumn = () => {
    const newColumn = {
      name: '',
      tasks: [],
    }
    setBoardColumns([...boardColumns, newColumn])
  }

  const handleRemoveColumn = (indexToRemove: number) => {
    const updatedColumns = boardColumns.filter(
      (_, index) => index !== indexToRemove,
    )
    setBoardColumns(updatedColumns)
  }

  const handleColumnChange = (index: number, newValue: string) => {
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

  function handleEditBoard(data: FormData) {
    const columnErrors = boardColumns.map((column) =>
      column.name === '' ? 'Required' : '',
    )

    const hasErrors = columnErrors.some((error) => error !== '')

    if (hasErrors) {
      setColumnErrors(columnErrors)
      return
    }

    editBoard(board, data.name, boardColumns)
    onClose()
  }

  const renderColumnInput = (column: ColumnDTO, index: number) => {
    return (
      <InputVariantsContainer>
        <InputVariant
          inputClassName={`${column.tasks.length > 0 ? 'disabled' : ''} ${
            columnErrors[index] ? 'error' : ''
          }`}
          btnClassName={column.tasks.length > 0 ? 'disabled' : ''}
          defaultValue={column.name}
          onChange={(e) => handleColumnChange(index, e.target.value)}
          onClick={() => handleRemoveColumn(index)}
        />
        {columnErrors[index] && <span>{columnErrors[index]}</span>}
      </InputVariantsContainer>
    )
  }

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content className="bigger">
        <Title>Edit Board</Title>
        <FormContainer onSubmit={handleSubmit(handleEditBoard)}>
          <InputContainer>
            <Label>Name</Label>
            <Input type="text" {...register('name')} className="disabled" />
            {errors?.name && <FormError>{errors.name.message}</FormError>}
          </InputContainer>

          <ColumnsContainer>
            <Label>Columns</Label>
            <ColumnsContent>
              {boardColumns.map((column, index) => (
                <div key={`${column.name}-${index}`}>
                  {renderColumnInput(column, index)}
                </div>
              ))}
            </ColumnsContent>
            {boardColumns.length !== 6 && (
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
      </Content>
    </>
  )
}
