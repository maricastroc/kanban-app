/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ButtonContent,
  Container,
  ContentWrapper,
  FeatureDivider,
  FeatureList,
  Illustration,
} from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { BoardFormModal } from '@/components/Modals/BoardFormModal'
import { SecondaryButton } from '../../Core/SecondaryButton'

const FEATURES = ['Custom workflows', 'Drag & drop', 'Smart tags']

export function EmptyContainer() {
  const [addBoardModalOpen, setAddBoardModalOpen] = useState(false)

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
            {/* columns */}
            <g strokeWidth="1.5" opacity="0.35">
              <rect x="10" y="14" width="32" height="7" rx="3.5" />
              <rect x="10" y="29" width="32" height="20" rx="4" />
              <rect x="10" y="55" width="32" height="20" rx="4" />

              <rect x="50" y="14" width="32" height="7" rx="3.5" />
              <rect x="50" y="55" width="32" height="20" rx="4" />

              <rect x="90" y="14" width="32" height="7" rx="3.5" />
              <rect x="90" y="29" width="32" height="20" rx="4" />
            </g>
            {/* active card */}
            <rect
              x="50"
              y="29"
              width="32"
              height="20"
              rx="4"
              strokeWidth="1.5"
              fill="currentColor"
              fillOpacity="0.16"
              opacity="0.75"
            />
          </svg>
        </Illustration>

        <h2>Welcome to your workspace</h2>
        <p>
          Create your first board to organize projects, track tasks and
          collaborate.
        </p>

        <ButtonContent>
          <Dialog.Root open={addBoardModalOpen}>
            <Dialog.Trigger asChild>
              <SecondaryButton
                title="+ Create your first board"
                onClick={() => setAddBoardModalOpen(true)}
              />
            </Dialog.Trigger>
            <BoardFormModal
              isEditing={false}
              onClose={() => setAddBoardModalOpen(false)}
            />
          </Dialog.Root>
        </ButtonContent>

        <FeatureDivider />

        <FeatureList>
          {FEATURES.map((feature) => (
            <li key={feature}>
              <FontAwesomeIcon icon={faCheck} />
              {feature}
            </li>
          ))}
        </FeatureList>
      </ContentWrapper>
    </Container>
  )
}
