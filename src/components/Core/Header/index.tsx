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
import { useAppSelector } from '@/store/hooks'
import LogoTextLight from '../../../../public/kanban.svg'
import LogoTextDark from '../../../../public/kanban-dark.svg'
import Image from 'next/image'
import { TagsModal } from '@/components/Modals/TagsModal'
import { TagProps } from '@/@types/tag'
import { EditTagModal } from '@/components/Modals/EditTagModal'
import useRequest from '@/utils/useRequest'
import { DeleteTagModal } from '@/components/Modals/DeleteTagModal'

type Props = {
  hideSidebar: boolean
  enableDarkMode: boolean
}

export function Header({ hideSidebar, enableDarkMode }: Props) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)

  const [isViewTagsModalOpen, setIsViewTagsModalOpen] = useState(false)

  const [isEditTagModalOpen, setIsEditTagModalOpen] = useState(false)

  const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false)

  const [selectedTag, setSelectedTag] = useState<TagProps | null>(null)

  const activeBoard = useAppSelector((state) => state.boards.activeBoard)

  const [isBoardsDetailsModalOpen, setIsBoardsDetailsModalOpen] =
    useState(false)

  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false)

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  const { data, mutate: tagsMutate } = useRequest<{
    tags: TagProps[]
  }>({
    url: '/tags',
    method: 'GET',
  })

  const onCloseTagModal = () => {
    setIsViewTagsModalOpen(false)
    setIsDeleteTagModalOpen(false)
    setIsEditTagModalOpen(false)
    setSelectedTag(null)
  }

  useEffect(() => {
    if (!isSmallerThanSm) {
      setIsBoardsDetailsModalOpen(false)
    }
  }, [isSmallerThanSm])

  return (
    <Container className={`${hideSidebar ? 'hide-sidebar-mode' : ''}`}>
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
        <Dialog.Root
          open={isViewTagsModalOpen}
          onOpenChange={setIsViewTagsModalOpen}
        >
          <Dialog.Trigger asChild>
            <ActionBtn className="secondary">
              <FontAwesomeIcon icon={faTag} />
              <p>Edit Tags</p>
            </ActionBtn>
          </Dialog.Trigger>
          <TagsModal
            tags={data?.tags || null}
            onDeleteTag={(tag) => {
              setSelectedTag(tag)
              setIsDeleteTagModalOpen(true)
              setIsEditTagModalOpen(false)
              setIsViewTagsModalOpen(false)
            }}
            onAddTag={() => {
              setSelectedTag(null)
              setIsEditTagModalOpen(true)
              setIsViewTagsModalOpen(false)
            }}
            onSelectTag={(tag) => {
              setSelectedTag(tag)
              setIsEditTagModalOpen(true)
              setIsViewTagsModalOpen(false)
            }}
            onClose={onCloseTagModal}
          />
        </Dialog.Root>

        <Dialog.Root
          open={isEditTagModalOpen}
          onOpenChange={setIsEditTagModalOpen}
        >
          <EditTagModal selectedTag={selectedTag} onClose={onCloseTagModal} />
        </Dialog.Root>

        <Dialog.Root
          open={isDeleteTagModalOpen}
          onOpenChange={setIsDeleteTagModalOpen}
        >
          <DeleteTagModal
            tagsMutate={tagsMutate}
            selectedTag={selectedTag}
            onClose={onCloseTagModal}
          />
        </Dialog.Root>

        {activeBoard && (
          <Dialog.Root
            open={isAddTaskModalOpen}
            onOpenChange={setIsAddTaskModalOpen}
          >
            <Dialog.Trigger asChild>
              <ActionBtn>
                <FontAwesomeIcon icon={faPlus} />
                <p>+ Add New Task</p>
              </ActionBtn>
            </Dialog.Trigger>
            <TaskFormModal
              isEditing={false}
              column={activeBoard?.columns?.[0]}
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


if (process.env.NODE_ENV === 'development') {
  Header.whyDidYouRender = true
}
