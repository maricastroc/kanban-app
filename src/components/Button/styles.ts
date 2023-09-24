import styled from 'styled-components'

export const Container = styled.button`
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  padding: 0.7rem;
  border: none;

  &.primary {
    background-color: ${(props) => props.theme['light-bg-color']};

    p {
      color: ${(props) => props.theme['primary-color']};
    }
  }

  &.secondary {
    background-color: ${(props) => props.theme['primary-color']};

    p {
      color: ${(props) => props.theme['button-title']};
    }
  }

  &.tertiary {
    background-color: ${(props) => props.theme['error-color']};

    p {
      color: ${(props) => props.theme['button-title']};
    }
  }

  p {
    font-size: 0.8125rem;
    font-weight: 700;
  }

  &:focus {
    box-shadow: none;
  }

  &:hover {
    filter: brightness(1.2);
    transition: 200ms;
  }

  &[disabled] {
    cursor: not-allowed;
  }
`
