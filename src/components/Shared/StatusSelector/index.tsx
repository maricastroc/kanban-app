import { BoardColumnProps } from '@/@types/board-column'
import { StatusSelectorBtn } from './styles'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface StatusSelectorProps {
  status: string | undefined
  handleChangeStatus: (newStatus: BoardColumnProps) => void
  column: BoardColumnProps
}

export function StatusSelector({
  status,
  handleChangeStatus,
  column,
}: StatusSelectorProps) {
  return (
    <StatusSelectorBtn
      type="button"
      key={column.name}
      onClick={() => handleChangeStatus(column)}
    >
      {status === column.name && <FontAwesomeIcon icon={faCheck} />}
      <span>{column.name}</span>
    </StatusSelectorBtn>
  )
}
