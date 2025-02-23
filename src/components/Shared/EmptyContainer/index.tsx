/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonContent, Container, ContentWrapper } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { BoardFormModal } from '@/components/Modals/BoardFormModal'
import { SecondaryButton } from '../SecondaryButton'

export function EmptyContainer() {
  const [addBoardModalOpen, setAddBoardModalOpen] = useState(false)

  return (
    <Container>
      <ContentWrapper>
        <h2>It looks a bit empty around here...</h2>
        <p>How about creating your first board?</p>

        <ButtonContent>
          <Dialog.Root open={addBoardModalOpen}>
            <Dialog.Trigger asChild>
              <SecondaryButton
                title="+ Add New Board"
                onClick={() => setAddBoardModalOpen(true)}
              />
            </Dialog.Trigger>
            <BoardFormModal
              isEditing={false}
              onClose={() => setAddBoardModalOpen(false)}
            />
          </Dialog.Root>
        </ButtonContent>
      </ContentWrapper>
    </Container>
  )
}
