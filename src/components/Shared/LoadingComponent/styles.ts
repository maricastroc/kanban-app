import styled from 'styled-components'

export const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: ${(props) => props.theme['overlay-color']};
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`

// Circular spinner: a faint accent ring with a bright accent arc on top.
export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${(props) => props.theme['accent-soft']};
  border-top-color: ${(props) => props.theme['accent-color']};
  animation: lc-spin 0.7s linear infinite;

  @keyframes lc-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.6s;
  }
`
