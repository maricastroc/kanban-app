import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTableColumns } from '@fortawesome/free-solid-svg-icons'
import { MAX_COLUMNS } from '@/utils/constants'
import { Button } from '@/components/Core/Button'
import { FormContainer } from '@/components/Core/FormContainer'
import { Sheet } from '../Sheet'
import { AddColumnBtn, ColumnsWrapper } from '../BoardFormModal/styles'
import { ColumnRowField } from '../BoardFormModal/partials/ColumnRowField'
import { useBoardForm } from '@/hooks/useBoardForm'

interface ColumnFormModalProps {
  onClose: () => void
}

export function ColumnFormModal({ onClose }: ColumnFormModalProps) {
  const {
    activeBoard,
    errors,
    isLoading,
    isSubmitting,
    boardColumns,
    handleSubmitBoard,
    handleAddColumn,
    handleChangeColumn,
    handleRemoveColumn,
    handleSubmit,
    resetColumns,
  } = useBoardForm({ isEditing: true, onClose })

  // only allow saving when there's at least one column not already on the board
  const hasNewColumns = () => {
    if (!activeBoard?.columns) return boardColumns.length > 0

    return boardColumns.some(
      (boardColumn) =>
        !activeBoard.columns.some(
          (activeColumn) =>
            activeColumn.id === boardColumn.id ||
            activeColumn.name === boardColumn.name,
        ),
    )
  }

  const handleClose = () => {
    resetColumns()
    onClose()
  }

  return (
    <Sheet isLoading={isLoading} onClose={handleClose}>
      <Sheet.Header
        icon={faTableColumns}
        title="Add column"
        subtitle={`Add a new column to ${activeBoard?.name || 'this board'}.`}
        onClose={handleClose}
      />

      <Sheet.Body>
        <FormContainer
          id="column-form"
          onSubmit={handleSubmit(handleSubmitBoard)}
          style={{ marginTop: 0, gap: 0 }}
        >
          <Sheet.Section>
            <Sheet.SectionLabel>
              <FontAwesomeIcon icon={faTableColumns} />
              Workflow columns
            </Sheet.SectionLabel>
            <Sheet.SectionHint>
              Existing columns are locked — add new stages below.
            </Sheet.SectionHint>
            <ColumnsWrapper>
              {boardColumns.map((column, index) => {
                const isExistingByName = activeBoard?.columns?.some(
                  (c) => c.name === column.name,
                )
                const isExistingById = activeBoard?.columns?.some(
                  (c) => c.id === column.id,
                )

                return (
                  <ColumnRowField
                    key={column.clientId}
                    id={column.clientId}
                    sortable={false}
                    name={column.name}
                    error={errors.columns?.[index]?.name?.message}
                    disabled={isExistingByName}
                    canRemove={!isExistingById}
                    onChangeName={(value) => handleChangeColumn(index, value)}
                    onRemove={() => handleRemoveColumn(index)}
                  />
                )
              })}
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
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          fullWidth={false}
          type="submit"
          form="column-form"
          disabled={isSubmitting || !hasNewColumns()}
          isLoading={isSubmitting}
        >
          Save changes
        </Button>
      </Sheet.Footer>
    </Sheet>
  )
}
