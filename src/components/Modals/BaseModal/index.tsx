import * as Dialog from '@radix-ui/react-dialog'
import {
  CloseButton,
  HeaderContent,
  ModalContent,
  ModalOverlay,
  ModalTitle,
} from './styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { ReactNode } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'

interface Props {
  title?: string
  children: ReactNode
  padding?: string
  height?: string
  maxHeight?: string
  titlePadding?: string
  isLoading?: boolean
  hasHeader?: boolean
  overflow?: string
  className?: string
  onClose: () => void
}

export const BaseModal = ({
  title,
  children,
  padding,
  titlePadding,
  height,
  maxHeight,
  isLoading,
  hasHeader = true,
  overflow,
  className,
  onClose,
}: Props) => {
  return (
    <Dialog.Portal>
      <ModalOverlay />
      <ModalContent
        padding={padding}
        className={`DialogContent ${className ?? ''}`}
        maxHeight={maxHeight}
        height={height}
        overflow={overflow}
      >
        {hasHeader && (
          <HeaderContent padding={titlePadding}>
            <ModalTitle className="DialogTitle">{title}</ModalTitle>
            <CloseButton onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </CloseButton>
          </HeaderContent>
        )}

        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>

        {children}
      </ModalContent>

      {isLoading && <LoadingComponent />}
    </Dialog.Portal>
  )
}
