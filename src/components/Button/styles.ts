import styled from 'styled-components'

export const Container = styled.button`
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 0.7rem;
  border: none;

  &.primary {
    background-color: ${(props) => props.theme['white-color']};

    p {
      color: ${(props) => props.theme['purple-500']};
    }
  }

  &.secondary {
    background-color: ${(props) => props.theme['purple-500']};

    p {
      color: ${(props) => props.theme['white-color']};
    }
  }

  &.tertiary {
    background-color: ${(props) => props.theme['red-500']};

    p {
      color: ${(props) => props.theme['white-color']};
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
