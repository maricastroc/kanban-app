import { RefObject, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  LayoutContainer,
  OptionsBtn,
  OptionsContainer,
  OptionsModal,
  TaskTitle,
} from './styles'
import { HeaderIcon } from '../../../Sheet/styles'
import { MenuDivider, MenuItem } from '@/components/Core/Menu/styles'
import {
  faEllipsisVertical,
  faPen,
  faSquareCheck,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { useClickOutside } from '@/utils/useClickOutside'

interface Props {
  enableDarkMode: boolean
  isActionsModalOpen: boolean
  taskName: string
  onToggleActionsModal: (value: boolean) => void
  onToggleEditModal: (value: boolean) => void
  onToggleDeleteModal: (value: boolean) => void
}

export const Header = ({
  enableDarkMode,
  taskName,
  isActionsModalOpen,
  onToggleActionsModal,
  onToggleDeleteModal,
  onToggleEditModal,
}: Props) => {
  const optionsRef = useRef<HTMLDivElement>(null)

  useClickOutside(optionsRef as RefObject<HTMLElement>, () => {
    if (isActionsModalOpen) onToggleActionsModal(false)
  })

  return (
    <LayoutContainer>
      <HeaderIcon>
        <FontAwesomeIcon icon={faSquareCheck} />
      </HeaderIcon>
      <TaskTitle>{taskName}</TaskTitle>
      <OptionsContainer ref={optionsRef}>
        <OptionsBtn
          aria-label="Task options"
          data-active={isActionsModalOpen}
          onClick={() => onToggleActionsModal(!isActionsModalOpen)}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </OptionsBtn>
        {isActionsModalOpen && (
          <OptionsModal className={enableDarkMode ? 'dark' : 'light'}>
            <MenuItem type="button" onClick={() => onToggleEditModal(true)}>
              <FontAwesomeIcon icon={faPen} />
              Edit Task
            </MenuItem>
            <MenuDivider />
            <MenuItem
              type="button"
              className="danger"
              onClick={() => onToggleDeleteModal(true)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
              Delete Task
            </MenuItem>
          </OptionsModal>
        )}
      </OptionsContainer>
    </LayoutContainer>
  )
}
