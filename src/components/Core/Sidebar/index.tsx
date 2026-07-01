import {
  Brand,
  Container,
  CreateBoardArea,
  CreateDivider,
  HideButton,
  OptionsContainer,
  SectionLabel,
  Wrapper,
} from './styles'
import Image from 'next/image'
import LogoMark from '@/../public/logo-mark.svg'
import * as Dialog from '@radix-ui/react-dialog'

import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { BoardFormModal } from '@/components/Modals/BoardFormModal'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { BoardList } from '@/components/Core/BoardList'
import { ThemeToggle } from '@/components/Core/ThemeToggle'
import { CreateBoardButton } from '@/components/Core/BoardList/styles'

interface SidebarProps {
  onClose: () => void
  className?: string
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const { boards } = useBoardsContext()

  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)

  return (
    <Container className={className}>
      <Wrapper className={className}>
        <Brand>
          <span className="logo-mark">
            <Image src={LogoMark} width={30} height={30} alt="Cadence logo" />
          </span>
          <span>cadence</span>
        </Brand>

        <SectionLabel>
          <span>Boards</span>
          <span>{boards?.length || 0}</span>
        </SectionLabel>

        <BoardList />

        <CreateBoardArea>
          <CreateDivider />

          <Dialog.Root open={isAddBoardModalOpen}>
            <Dialog.Trigger asChild>
              <CreateBoardButton
                className="create"
                onClick={() => {
                  setIsAddBoardModalOpen(true)
                }}
              >
                <span className="plus-box">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <p>Create board</p>
              </CreateBoardButton>
            </Dialog.Trigger>
            {isAddBoardModalOpen && (
              <BoardFormModal
                isEditing={false}
                onClose={() => {
                  setIsAddBoardModalOpen(false)
                }}
              />
            )}
          </Dialog.Root>
        </CreateBoardArea>
      </Wrapper>

      <OptionsContainer>
        <ThemeToggle />
        <HideButton onClick={onClose}>
          <FontAwesomeIcon icon={faEyeSlash} />
          <p>Hide sidebar</p>
        </HideButton>
      </OptionsContainer>
    </Container>
  )
}
