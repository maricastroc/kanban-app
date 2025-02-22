import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme['bg-color']};
`

export const BoardContent = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
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
  padding: 1.5rem 1rem 0;
  gap: 1.5rem;
  padding-bottom: 2rem;
  justify-content: initial;
  cursor: move;
  height: 100%;

  &.hide-sidebar-mode {
    justify-content: center;
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
    height: 100vh;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
    gap: 2rem;
  }
`

export const AddColumnContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 17.5rem;
  height: 100%;
  margin-top: 2.4rem;
  border-radius: 8px;

  &.dark {
    background: linear-gradient(
      to bottom,
      rgba(130, 143, 163, 0.075),
      rgba(130, 143, 163, 0)
    );
  }

  &.light {
    background: linear-gradient(180deg, #e9effa, rgba(233, 239, 250, 0.5));
  }

  &:hover {
    h2 {
      color: ${(props) => props.theme['primary-color']};
      transition: 200ms;
    }
  }
`

export const AddColumnBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: ${(props) => props.theme['subtitle-color']};
  font-weight: 700;
`

export const StyledToastContainer = styled(ToastContainer)`
  & .Toastify__toast {
    background-color: ${(props) => props.theme['bg-color']};
    color: ${(props) => props.theme['details-color']};
    border-radius: 4px;
    font-family: 'Plus Jakarta Sans';
    font-size: 0.85rem;
    line-height: 1.5;
  }

  & .Toastify__close-button {
    color: ${(props) => props.theme['title-color']};
  }

  & .Toastify__toast-body svg {
    fill: ${(props) => props.theme['primary-color']};
    font-size: 0.5rem;
  }

  & .Toastify__progress-bar {
    background-color: ${(props) => props.theme['primary-color']};
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
  position: absolute;
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
