import { HexColorPicker } from 'react-colorful'
import * as Dialog from '@radix-ui/react-dialog'

import { Button } from '@/components/Shared/Button'
import { ModalContent, ModalOverlay } from '@/styles/shared'
import { LayoutContainer, StyledPickerContainer } from './styles'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useEscapeKeyHandler } from '@/utils/useEscapeKeyPress'
import { useRef, useState } from 'react'
import { useOutsideClick } from '@/utils/useOutsideClick'

interface ColorPickerModalProps {
  currentColor: string
  onChange: (color: string) => void
  onClose: () => void
}

export const ColorPickerModal = ({
  currentColor,
  onChange,
  onClose,
}: ColorPickerModalProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    currentColor,
  )

  const statusRef = useRef<HTMLDivElement | null>(null)

  useOutsideClick(statusRef, () => onClose())

  useEscapeKeyHandler(onClose)

  const handleChangeCurrentColor = () => {
    if (selectedColor) {
      onChange(selectedColor)
      onClose()
    }
  }

  return (
    <Dialog.Portal>
      <ModalOverlay />
      <ModalContent>
        <VisuallyHidden>
          <Dialog.Title />
        </VisuallyHidden>
        <VisuallyHidden>
          <Dialog.Description />
        </VisuallyHidden>
        <LayoutContainer>
          <StyledPickerContainer>
            <HexColorPicker onChange={setSelectedColor} />
          </StyledPickerContainer>
          <Button
            onClick={handleChangeCurrentColor}
            variant="primary"
            title="Save Changes"
          />
        </LayoutContainer>
      </ModalContent>
    </Dialog.Portal>
  )
}
