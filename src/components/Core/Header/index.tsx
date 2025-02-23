import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  AddTaskBtn,
  BoardName,
  BoardNameContainer,
  Container,
  LogoContainer,
  EditDeleteContainer,
  EditDeleteWrapper,
  EditDeleteBtn,
  LogoWrapper,
  LogoContent,
} from './styles'
import Logo from '@/../public/icon.svg'
import {
  faAngleDown,
  faEllipsisVertical,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'
import { BoardsDetailsModal } from '@/components/Modals/BoardsDetailsModal'
import { useEffect, useState } from 'react'
import { TaskFormModal } from '@/components/Modals/TaskFormModal'
import { EditDeleteModal } from '@/components/Modals/EditDeleteModal'
import { BREAKPOINT_SM } from '@/utils/constants'
import { useWindowResize } from '@/utils/useWindowResize'
import { useBoardsContext } from '@/contexts/BoardsContext'
import LogoTextLight from '../../../../public/kanban.svg'
import LogoTextDark from '../../../../public/kanban-dark.svg'
import Image from 'next/image'
import { useTheme } from 'styled-components'

type Props = {
  hideSidebar: boolean
}

export function Header({ hideSidebar }: Props) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)

  const { activeBoard } = useBoardsContext()

  const { enableDarkMode } = useTheme()

  const [isBoardsDetailsModalOpen, setIsBoardsDetailsModalOpen] =
    useState(false)

  const [isEditDeleteModalOpen, setIsEditDeleteModalOpen] = useState(false)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  useEffect(() => {
    if (!isSmallerThanSm) {
      setIsBoardsDetailsModalOpen(false)
    }
  }, [isSmallerThanSm])

  return (
    <Container>
      <LogoContainer>
        {isSmallerThanSm && (
          <Image src={Logo} width={24} height={24} alt="Project Logo" />
        )}

        {hideSidebar && !isSmallerThanSm && (
          <LogoContent>
            <LogoWrapper>
              <Image src={Logo} width={24} height={24} alt="" />
              <Image
                src={
                  enableDarkMode === undefined || enableDarkMode
                    ? LogoTextLight
                    : LogoTextDark
                }
                width={112}
                height={24}
                className="logo"
                alt=""
              />
            </LogoWrapper>
          </LogoContent>
        )}

        <Dialog.Root open={isBoardsDetailsModalOpen}>
          <Dialog.Trigger asChild>
            <BoardNameContainer
              className={`${
                hideSidebar && !isSmallerThanSm && 'sidebar-hidden'
              }`}
              onClick={() =>
                isSmallerThanSm && setIsBoardsDetailsModalOpen(true)
              }
            >
              <BoardName>{activeBoard?.name}</BoardName>
              {isSmallerThanSm && <FontAwesomeIcon icon={faAngleDown} />}
            </BoardNameContainer>
          </Dialog.Trigger>
          <BoardsDetailsModal
            onClose={() => setIsBoardsDetailsModalOpen(false)}
          />
        </Dialog.Root>
      </LogoContainer>
      <EditDeleteContainer>
        {activeBoard && (
          <Dialog.Root open={isAddTaskModalOpen}>
            <Dialog.Trigger asChild>
              <AddTaskBtn onClick={() => setIsAddTaskModalOpen(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <p>+ Add New Task</p>
              </AddTaskBtn>
            </Dialog.Trigger>
            <TaskFormModal
              isEditing={false}
              onClose={() => setIsAddTaskModalOpen(false)}
            />
          </Dialog.Root>
        )}

        <EditDeleteWrapper>
          <Dialog.Root
            open={isEditDeleteModalOpen}
            onOpenChange={setIsEditDeleteModalOpen}
          >
            <Dialog.Trigger asChild>
              <EditDeleteBtn>
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  onClick={() => setIsEditDeleteModalOpen(false)}
                />
              </EditDeleteBtn>
            </Dialog.Trigger>
            <EditDeleteModal onClose={() => setIsEditDeleteModalOpen(false)} />
          </Dialog.Root>
        </EditDeleteWrapper>
      </EditDeleteContainer>
    </Container>
  )
}
