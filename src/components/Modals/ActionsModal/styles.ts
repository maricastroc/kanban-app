import styled from 'styled-components'

import { Content as RadixContent } from '@radix-ui/react-dialog'
import { menuSurface } from '@/components/Core/Menu/styles'

export const ModalContent = styled(RadixContent)`
  ${menuSurface}
  position: absolute;
  top: 5rem;
  right: 0.7rem;
  width: 12rem;

  @media (min-width: 768px) {
    right: 2rem;
  }
`
