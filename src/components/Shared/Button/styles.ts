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
    background-color: ${(props) => `${props.theme['primary-color']}1A`};

    p {
      color: ${(props) => props.theme['primary-color']};
    }

    &:hover {
      background-color: ${(props) => `${props.theme['primary-color']}40`};
      transition: 200ms;
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

  &[disabled] {
    cursor: not-allowed;
  }
`
