import { StatusSelectorBtn } from './styles'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface StatusSelectorProps {
  status: string | undefined
  handleChangeStatus: (newStatus: string) => void
  column: { name: string }
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
      onClick={() => handleChangeStatus(column.name)}
    >
      {status === column.name && <FontAwesomeIcon icon={faCheck} />}
      <span>{column.name}</span>
    </StatusSelectorBtn>
  )
}
