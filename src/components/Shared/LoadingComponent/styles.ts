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
