import * as Dialog from '@radix-ui/react-dialog'
import {
  ButtonContent,
  Container,
  ContentWrapper,
  Illustration,
} from '../EmptyContainer/styles'
import { SecondaryButton } from '../../Core/SecondaryButton'
import { ColumnFormModal } from '@/components/Modals/ColumnFormModal'

interface EmptyColumnsProps {
  isOpen: boolean
  onOpenModal: (value: boolean) => void
}

export function EmptyColumns({ isOpen, onOpenModal }: EmptyColumnsProps) {
  return (
    <Container>
      <ContentWrapper>
        <Illustration aria-hidden>
          <svg
            viewBox="0 0 132 96"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* board outline */}
            <rect
              x="1"
              y="1"
              width="130"
              height="94"
              rx="8"
              strokeWidth="1.5"
              opacity="0.18"
            />
            {/* empty column placeholders */}
            <g strokeWidth="1.5" opacity="0.32" strokeDasharray="4 3">
              <rect x="12" y="14" width="30" height="68" rx="6" />
              <rect x="51" y="14" width="30" height="68" rx="6" />
              <rect x="90" y="14" width="30" height="68" rx="6" />
            </g>
            {/* add hint in the middle column */}
            <g strokeWidth="1.8" opacity="0.6" strokeLinecap="round">
              <line x1="66" y1="40" x2="66" y2="56" />
              <line x1="58" y1="48" x2="74" y2="48" />
            </g>
          </svg>
        </Illustration>

        <h2>No columns yet</h2>
        <p>
          Add columns like To do, In progress and Done to organize your tasks by
          stage.
        </p>

        <ButtonContent>
          <Dialog.Root open={isOpen} onOpenChange={onOpenModal}>
            <Dialog.Trigger asChild>
              <SecondaryButton
                title="+ New column"
                onClick={() => onOpenModal(true)}
              />
            </Dialog.Trigger>
            <ColumnFormModal onClose={() => onOpenModal(false)} />
          </Dialog.Root>
        </ButtonContent>
      </ContentWrapper>
    </Container>
  )
}
