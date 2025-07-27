import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  ActionBtn,
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
  faTag,
} from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'
import { BoardsDetailsModal } from '@/components/Modals/BoardsDetailsModal'
import { useEffect, useState } from 'react'
import { TaskFormModal } from '@/components/Modals/TaskFormModal'
import { ActionsModal } from '@/components/Modals/ActionsModal'
import { BREAKPOINT_SM } from '@/utils/constants'
import { useWindowResize } from '@/utils/useWindowResize'
import { useBoardsContext } from '@/contexts/BoardsContext'
import LogoTextLight from '../../../../public/kanban.svg'
import LogoTextDark from '../../../../public/kanban-dark.svg'
import Image from 'next/image'
import { useTheme } from 'styled-components'
import { TagsModal } from '@/components/Modals/TagsModal'

type Props = {
  hideSidebar: boolean
}

export function Header({ hideSidebar }: Props) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)

  const [isEditTagsModalOpen, setIsEditTagsModalOpen] = useState(false)

  const { activeBoard } = useBoardsContext()

  const { enableDarkMode } = useTheme()

  const [isBoardsDetailsModalOpen, setIsBoardsDetailsModalOpen] =
    useState(false)

  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  useEffect(() => {
    if (!isSmallerThanSm) {
      setIsBoardsDetailsModalOpen(false)
    }
  }, [isSmallerThanSm])

  return (
    <Container className={hideSidebar ? 'hide-sidebar-mode' : ''}>
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
        <Dialog.Root open={isEditTagsModalOpen}>
          <Dialog.Trigger asChild>
            <ActionBtn
              className="secondary"
              onClick={() => setIsEditTagsModalOpen(true)}
            >
              <FontAwesomeIcon icon={faTag} />
              <p>Edit Tags</p>
            </ActionBtn>
          </Dialog.Trigger>
          <TagsModal onClose={() => setIsEditTagsModalOpen(false)} />
        </Dialog.Root>

        {activeBoard && (
          <Dialog.Root open={isAddTaskModalOpen}>
            <Dialog.Trigger asChild>
              <ActionBtn onClick={() => setIsAddTaskModalOpen(true)}>
                <FontAwesomeIcon icon={faPlus} />
                <p>+ Add New Task</p>
              </ActionBtn>
            </Dialog.Trigger>
            <TaskFormModal
              isEditing={false}
              column={activeBoard?.columns[0]}
              onClose={() => setIsAddTaskModalOpen(false)}
            />
          </Dialog.Root>
        )}

        <EditDeleteWrapper>
          <Dialog.Root
            open={isActionsModalOpen}
            onOpenChange={setIsActionsModalOpen}
          >
            <Dialog.Trigger asChild>
              <EditDeleteBtn>
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  onClick={() => setIsActionsModalOpen(false)}
                />
              </EditDeleteBtn>
            </Dialog.Trigger>
            <ActionsModal onClose={() => setIsActionsModalOpen(false)} />
          </Dialog.Root>
        </EditDeleteWrapper>
      </EditDeleteContainer>
    </Container>
  )
}
