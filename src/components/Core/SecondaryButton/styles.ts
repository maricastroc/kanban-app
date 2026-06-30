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
  width: auto;
  min-width: 164px;
  height: 48px;
  padding: 0 1.6rem;
  gap: 0.5rem;
  box-shadow: 0 8px 22px ${(props) => props.theme['accent-glow']};
  transition: background-color 200ms ease, transform 200ms ease,
    box-shadow 200ms ease;

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
    background-color: ${(props) => props.theme['tertiary-hover']};
    transform: translateY(-1px);
    box-shadow: 0 10px 26px ${(props) => props.theme['accent-glow']};
  }
`
