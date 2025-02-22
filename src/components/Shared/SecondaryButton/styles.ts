import styled from 'styled-components'

export const SecondaryBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme['primary-color']};
  width: 48px;
  height: 32px;
  border: none;
  border-radius: 16px;

  svg {
    font-size: 1rem;
    color: ${(props) => props.theme['button-title']};
  }

  p {
    display: none;
  }

  &:hover {
    transition: 200ms;
    background-color: ${(props) => props.theme['tertiary-hover']};
  }

  @media (min-width: 768px) {
    gap: 1.5rem;
    width: 164px;
    height: 48px;
    border-radius: 22px;

    svg {
      display: none;
    }

    p {
      display: block;
      font-size: ${(props) => props.theme['heading-m']};
      color: ${(props) => props.theme['button-title']};
      font-weight: 700;
    }
  }
`
