import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faHeading, faTableColumns } from '@fortawesome/free-solid-svg-icons'
import { MAX_COLUMNS } from '@/utils/constants'
import { FormContainer } from '@/components/Core/FormContainer'
import { Button } from '@/components/Core/Button'
import { CustomInput } from '@/components/Core/Input'
import { Label } from '@/components/Core/Label'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { AddColumnBtn, ColumnsWrapper } from './styles'
import { Sheet } from '../Sheet'
import { ColumnRowField } from './partials/ColumnRowField'
import { useBoardForm } from '@/hooks/useBoardForm'

interface BoardModalProps {
  onClose: () => void
  isEditing: boolean
}

export function BoardFormModal({ onClose, isEditing }: BoardModalProps) {
  const {
    errors,
    boardColumns,
    isLoading,
    isSubmitting,
    register,
    handleAddColumn,
    handleChangeColumn,
    handleRemoveColumn,
    handleSubmit,
    handleSubmitBoard,
  } = useBoardForm({ isEditing, onClose })

  const submitForm = handleSubmit(handleSubmitBoard)

  return (
    <Sheet isLoading={isLoading} onClose={onClose}>
      <Sheet.Header
        icon={faTableColumns}
        title={isEditing ? 'Edit board' : 'Create board'}
        subtitle="Rename the board and customize its workflow columns."
        onClose={onClose}
      />

      <Sheet.Body>
        <FormContainer
          id="board-form"
          onSubmit={submitForm}
          style={{ marginTop: 0, gap: 0 }}
        >
          <Sheet.Section>
            <Sheet.FieldGroup>
              <Label htmlFor="name">
                <FontAwesomeIcon icon={faHeading} />
                Board name
              </Label>
              <CustomInput
                hasError={!!errors.name}
                placeholder="e.g. Backend Tasks"
                {...register('name')}
              />
              <ErrorMessage message={errors.name?.message} />
            </Sheet.FieldGroup>
          </Sheet.Section>

          <Sheet.Divider />

          <Sheet.Section>
            <Sheet.SectionLabel>
              <FontAwesomeIcon icon={faTableColumns} />
              Workflow columns
            </Sheet.SectionLabel>
            <Sheet.SectionHint>
              These stages define how work moves across your board.
            </Sheet.SectionHint>
            <ColumnsWrapper>
              {boardColumns.map((column, index) => (
                <ColumnRowField
                  key={`${column.name}-${index}`}
                  name={column.name}
                  error={errors.columns?.[index]?.name?.message}
                  canRemove={boardColumns.length > 1}
                  onChangeName={(value) => handleChangeColumn(index, value)}
                  onRemove={() => handleRemoveColumn(index)}
                />
              ))}
            </ColumnsWrapper>
            {boardColumns.length < MAX_COLUMNS && (
              <AddColumnBtn type="button" onClick={handleAddColumn}>
                <FontAwesomeIcon icon={faPlus} />
                Add column
              </AddColumnBtn>
            )}
          </Sheet.Section>
        </FormContainer>
      </Sheet.Body>

      <Sheet.Footer>
        <Button
          variant="secondary"
          fullWidth={false}
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          fullWidth={false}
          type="submit"
          form="board-form"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isEditing ? 'Save changes' : 'Create board'}
        </Button>
      </Sheet.Footer>
    </Sheet>
  )
}
