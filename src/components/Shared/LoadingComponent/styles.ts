import styled from 'styled-components'

export const ModalLoading = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

export const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`
