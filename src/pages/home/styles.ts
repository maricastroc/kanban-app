import styled from 'styled-components'

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  height: 100%;
  background-color: ${(props) => props.theme['bg-color']};
`

export const BoardContent = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  overflow: hidden;
`

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow-x: scroll;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`

export const ColumnsContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: scroll;
  padding: 1.5rem 2.1rem 0;
  gap: 1.5rem;
  flex-grow: 1;
  padding-bottom: 2rem;
  justify-content: initial;
  align-items: stretch;
  cursor: move;
  height: 100%;

  @media (min-width: 768px) {
    padding: 1.5rem;
    min-height: 100%;
    margin-left: 260px;

    &.hide-sidebar-mode {
      margin-left: 0;
    }
  }

  @media (min-width: 1024px) {
    padding: 2rem;
    gap: 2rem;
  }
`

export const ShowSidebarBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-top-right-radius: 22px;
  border-bottom-right-radius: 22px;
  position: fixed;
  z-index: 9999;
  background-color: ${(props) => props.theme['primary-color']};
  width: 56px;
  height: 48px;
  top: 87%;

  svg {
    font-size: 1.5rem;
    color: ${(props) => props.theme['title-color']};
  }

  &:hover {
    background-color: ${(props) => props.theme['primary-hover']};
    transition: 200ms;
  }
`
