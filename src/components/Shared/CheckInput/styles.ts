import styled from 'styled-components'

export const UncheckedBox = styled.button`
  cursor: pointer;
  min-width: 16px;
  min-height: 16px;
  background-color: ${(props) => props.theme['cards-color']};
  border: solid 1px ${(props) => props.theme['border-color']};
  border-radius: 3;

  &:focus {
    box-shadow: none;
  }
`

export const CheckedBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-width: 16px;
  min-height: 16px;
  background-color: ${(props) => props.theme['primary-color']};
  border: none;
  border-radius: 3;

  svg {
    color: ${(props) => props.theme['button-title']};
    font-size: 0.7rem;
  }

  &:focus {
    box-shadow: none;
  }
`
