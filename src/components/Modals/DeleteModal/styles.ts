import styled from 'styled-components'

import { Description as RadixDescription } from '@radix-ui/react-dialog'

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`

export const IconBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  color: ${(props) => props.theme['error-color']};
  background-color: ${(props) => props.theme['error-color']}1F;

  svg {
    font-size: 1rem;
  }
`

export const Title = styled.strong`
  font-size: ${(props) => props.theme['heading-l']};
  font-weight: 700;
  line-height: 1.2;
  color: ${(props) => props.theme['title-color']};
`

export const TargetCard = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme['hairline-color']};
  background-color: ${(props) => props.theme['field-bg']};

  span {
    overflow: hidden;
    font-size: ${(props) => props.theme['body-l']};
    font-weight: 600;
    color: ${(props) => props.theme['title-color']};
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const ModalDescription = styled(RadixDescription)`
  width: 100%;
  margin-top: 0.85rem;
  color: ${(props) => props.theme['subtitle-color']};
  font-size: ${(props) => props.theme['body-l']};
  font-weight: 500;
  line-height: 1.45;
`

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1.5rem;
`
