/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonContent, Container, ContentWrapper } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { BoardFormModal } from '@/components/Modals/BoardFormModal'
import { KeyedMutator } from 'swr'
import { AxiosResponse } from 'axios'
import { BoardProps } from '@/@types/board'
import { Button } from '../Button'
import { SecondaryButton } from '../SecondaryButton'

interface Props {
  mutate: KeyedMutator<AxiosResponse<BoardProps, any>>
  boardsMutate: KeyedMutator<AxiosResponse<BoardProps[], any>>
  activeBoard: BoardProps | undefined
}

export function EmptyContainer({ mutate, boardsMutate, activeBoard }: Props) {
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
              mutate={mutate}
              boardsMutate={boardsMutate}
              activeBoard={activeBoard as BoardProps}
              onClose={() => setAddBoardModalOpen(false)}
            />
          </Dialog.Root>
        </ButtonContent>
      </ContentWrapper>
    </Container>
  )
}
