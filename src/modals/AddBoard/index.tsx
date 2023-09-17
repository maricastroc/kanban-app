import { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import {
  Overlay,
  Description,
  Title,
  Content,
  FormContainer,
  RemoveColumnButton,
  ColumnsContainer,
  ColumnsContent,
  Label,
  InputColumn,
  InputColumnsContainer,
  Input,
  InputContainer,
  FormError,
  InputColumnContent,
} from './styles'
import { Button } from '@/components/Button'
import { ColumnDTO } from '@/dtos/columnDTO'
import { BoardsContext } from '@/contexts/BoardsContext'

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

const initialBoardColumns = [
  {
    name: 'Todo',
    tasks: [],
  },
  {
    name: 'Doing',
    tasks: [],
  },
]

export function AddBoard({ onClose }: AddBoardProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const { createNewBoard } = useContext(BoardsContext)

  const [boardColumns, setBoardColumns] =
    useState<ColumnDTO[]>(initialBoardColumns)

  const [showColumnError, setShowColumnError] = useState(false)

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
    if (newValue.length > 0) {
      setShowColumnError(false)
    }
  }

  function renderColumnInput(index: number) {
    return (
      <InputColumnsContainer key={boardColumns[index].name}>
        {boardColumns.length !== 1 ? (
          <>
            <InputColumnContent>
              <InputColumn
                type="text"
                placeholder="e.g. Todo"
                defaultValue={boardColumns[index].name}
                className={showColumnError ? 'error' : ''}
                onChange={(e) => handleColumnChange(index, e.target.value)}
              />
              <RemoveColumnButton
                className={
                  boardColumns[index].tasks.length > 0 ? 'disabled' : ''
                }
                onClick={() => handleRemoveColumn(index)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </RemoveColumnButton>
            </InputColumnContent>
            {showColumnError && <span>Required</span>}
          </>
        ) : (
          <>
            <Input
              type="text"
              defaultValue={boardColumns[index].name}
              placeholder="e.g. Todo"
              className={showColumnError ? 'error' : ''}
              onChange={(e) => handleColumnChange(index, e.target.value)}
            />
            {showColumnError && <span>Required</span>}
          </>
        )}
      </InputColumnsContainer>
    )
  }

  function handleCreateNewBoard(data: FormData) {
    const blankedColumns = boardColumns.filter((column) => column.name === '')

    if (blankedColumns.length > 0) {
      setShowColumnError(true)
      return
    }

    createNewBoard(data.name, boardColumns)
    onClose()
  }

  return (
    <>
      <Overlay onClick={() => onClose()} />
      <Content>
        <Title>
          <h3>Add New Board</h3>
        </Title>
        <Description>
          <FormContainer onSubmit={handleSubmit(handleCreateNewBoard)}>
            <InputContainer>
              <Label>Board Name</Label>
              <Input placeholder="e.g. Web Design" {...register('name')} />
              {errors?.name && <FormError>{errors.name.message}</FormError>}
            </InputContainer>

            <ColumnsContainer>
              <Label>Board Columns</Label>
              <ColumnsContent>
                {boardColumns.map((_, index) => renderColumnInput(index))}
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
        </Description>
      </Content>
    </>
  )
}
