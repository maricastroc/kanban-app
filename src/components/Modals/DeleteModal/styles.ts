import styled from 'styled-components'

import { Description as RadixDescription } from '@radix-ui/react-dialog'

export const ModalDescription = styled(RadixDescription)`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1rem;

  span {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: ${(props) => props.theme['body-l']};
    font-weight: 500;
    line-height: 1.4rem;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  width: 100%;
  gap: 0.5rem;
`
