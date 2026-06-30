import styled from 'styled-components'

// Inline loading spinner — inherits the button's text color via currentColor,
// so it works on every variant, and scales with the button's font size.
export const ButtonSpinner = styled.span`
  display: inline-block;
  width: 1.05em;
  height: 1.05em;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: btn-spin 0.6s linear infinite;

  @keyframes btn-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.4s;
  }
`

export const Container = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 9px;
  font-weight: 600;
  font-size: 0.82rem;
  white-space: nowrap;
  transition: background-color 140ms ease, border-color 140ms ease,
    box-shadow 140ms ease, transform 120ms ease;

  p {
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
  }

  &.full {
    width: 100%;
  }

  /* sizes */
  &.sm {
    height: 34px;
    padding: 0 0.95rem;
    font-size: 0.8rem;
  }
  &.md {
    height: 42px;
    padding: 0 1.1rem;
  }
  &.lg {
    height: 48px;
    padding: 0 1.4rem;
    font-size: 0.85rem;
  }

  /* variants */
  &.primary {
    background-color: ${(props) => props.theme['accent-color']};
    color: ${(props) => props.theme['accent-on']};

    &:not(:disabled):hover {
      background-color: ${(props) => props.theme['accent-hover']};
      box-shadow: 0 0 0 4px ${(props) => props.theme['accent-soft']};
    }
  }

  &.secondary {
    background-color: transparent;
    border-color: ${(props) => props.theme['border-color']};
    color: ${(props) => props.theme['text-color']};

    &:not(:disabled):hover {
      background-color: ${(props) => props.theme['card-hover']};
      border-color: ${(props) => props.theme['hairline-strong']};
    }
  }

  &.danger,
  &.tertiary {
    background-color: ${(props) => props.theme['error-color']};
    color: #ffffff;

    &:not(:disabled):hover {
      background-color: ${(props) => props.theme['error-hover']};
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:focus {
    box-shadow: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`
