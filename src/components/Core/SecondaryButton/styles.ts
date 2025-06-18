import styled from 'styled-components'

export const SecondaryBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme['primary-color']};
  color: ${(props) => props.theme['button-title']};
  border: none;
  border-radius: 22px;
  width: 164px;
  height: 48px;

  svg {
    font-size: 1rem;
    color: ${(props) => props.theme['button-title']};
  }

  p {
    font-size: ${(props) => props.theme['heading-m']};
    font-weight: 700;
    color: ${(props) => props.theme['button-title']};
  }

  &:not([disabled]):hover {
    transition: 200ms;
    background-color: ${(props) => props.theme['tertiary-hover']};
  }
`
