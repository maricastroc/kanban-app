import styled from 'styled-components'

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  height: 100%;
  background-color: ${(props) => props.theme['bg-color']};

  @media (min-width: 768px) {
    height: 100vh;
  }
`

export const BoardContent = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  overflow: hidden;

  @media (min-width: 768px) {
    min-height: 0;
    height: 100vh;
  }
`

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  @media (min-width: 768px) {
    min-height: 0;
    height: 100vh;
    overflow: hidden;
  }
`

export const ColumnsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1rem;
  gap: 0.85rem;
  flex-grow: 1;
  padding-bottom: 1.5rem;
  justify-content: initial;
  align-items: flex-start;
  /* Empty canvas is drag-to-pan (horizontal scroll); columns/cards override
     this with their own cursor so the grab only shows over the background. */
  cursor: grab;
  height: 100%;

  &:active {
    cursor: grabbing;
  }

  @media (min-width: 768px) {
    flex: 1;
    min-height: 0;
    height: auto;
    overflow-y: hidden;
    padding: 1.25rem 1.5rem;
    margin-left: 220px;

    &.hide-sidebar-mode {
      margin-left: 0;
    }
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
