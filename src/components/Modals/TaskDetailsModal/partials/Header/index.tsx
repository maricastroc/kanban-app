import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  LayoutContainer,
  OptionsBtn,
  OptionsContainer,
  OptionsModal,
} from './styles'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { Title } from '@radix-ui/react-dialog'

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
  return (
    <LayoutContainer>
      <Title>{taskName}</Title>
      <OptionsContainer>
        <OptionsBtn onClick={() => onToggleActionsModal(!isActionsModalOpen)}>
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </OptionsBtn>
        {isActionsModalOpen && (
          <OptionsModal className={enableDarkMode ? 'dark' : 'light'}>
            <button className="edit" onClick={() => onToggleEditModal(true)}>
              Edit Task
            </button>
            <button
              className="delete"
              onClick={() => onToggleDeleteModal(true)}
            >
              Delete Task
            </button>
          </OptionsModal>
        )}
      </OptionsContainer>
    </LayoutContainer>
  )
}
