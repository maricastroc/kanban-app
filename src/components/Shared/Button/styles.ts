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
  height: 2.4rem;

  &.bigger {
    height: 2.7rem;

    p {
      font-size: 14px;
    }
  }

  &.primary {
    background-color: ${(props) => props.theme['primary-color']};

    p {
      color: ${(props) => props.theme['button-title']};
    }

    &:hover {
      background-color: ${(props) => props.theme['primary-hover']};
      transition: 200ms;
    }
  }

  &.secondary {
    background-color: ${(props) => `${props.theme['secondary-color']}`};

    p,
    svg {
      color: ${(props) => props.theme['primary-color']};
    }

    &:hover {
      background-color: ${(props) => `${props.theme['secondary-hover']}`};
      transition: 200ms;
    }
  }

  &.tertiary {
    background-color: ${(props) => props.theme['error-color']};

    p {
      color: ${(props) => props.theme['button-title']};
    }

    &:hover {
      background-color: ${(props) => props.theme['error-hover']};
      transition: 200ms;
    }
  }

  p {
    font-size: ${(props) => props.theme['body-l']};
    font-weight: 700;
  }

  &:focus {
    box-shadow: none;
  }

  &.disabled {
    cursor: not-allowed;
  }
`
