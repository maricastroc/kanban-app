import { CustomLabel } from '@/components/Core/Label'
import { StatusContainer, StatusSelectorContainer } from './styles'
import { SelectStatus } from '@/components/Core/SelectStatus'
import { RefObject } from 'react'
import { StatusSelector } from '@/components/Shared/StatusSelector'
import { BoardColumnProps } from '@/@types/board-column'
import { BoardProps } from '@/@types/board'

interface Props {
  activeBoard?: BoardProps
  isOpen: boolean
  isActive: boolean
  status: string
  statusRef: RefObject<HTMLDivElement | null>
  onToggleOpen: (value: boolean) => void
  handleChangeStatus: (column: BoardColumnProps) => Promise<void>
}

export const StatusSection = ({
  isActive,
  isOpen,
  status,
  statusRef,
  activeBoard,
  onToggleOpen,
  handleChangeStatus,
}: Props) => {
  return (
    <StatusContainer>
      <CustomLabel>Current Status</CustomLabel>
      <SelectStatus
        isActive={isActive}
        isOpen={isOpen}
        status={status}
        onClick={() => onToggleOpen(true)}
      />
      {isOpen && (
        <StatusSelectorContainer ref={statusRef}>
          {activeBoard?.columns?.map((column) => (
            <StatusSelector
              key={column.name}
              column={column}
              status={status}
              handleChangeStatus={(column) => {
                handleChangeStatus(column)
              }}
            />
          ))}
        </StatusSelectorContainer>
      )}
    </StatusContainer>
  )
}
