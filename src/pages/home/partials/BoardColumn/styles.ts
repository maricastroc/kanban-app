import styled from 'styled-components'
import { menuSurface } from '@/components/Core/Menu/styles'

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 17.5rem;
  max-width: 17.5rem;
  width: 100%;
  align-self: flex-start;
  max-height: 100%;
  background-color: ${(props) => props.theme['panel-color']};
  border: 1px solid ${(props) => props.theme['hairline-color']};
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 180ms ease;
  /* The column body isn't draggable (only the grip is) — don't inherit the
     board's pan grab cursor here. */
  cursor: default;

  .menu {
    transition: color 160ms ease, background-color 160ms ease;
  }

  .add-task {
    transition: color 160ms ease, background-color 160ms ease;
  }

  &:hover {
    border-color: ${(props) => props.theme['hairline-strong']};
  }

  &.drag-overlay {
    cursor: grabbing;
    border-color: ${(props) => props.theme['accent-color']};
    box-shadow: 0 12px 28px -8px rgba(0, 0, 0, 0.45);
  }
`

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.7rem;
  border-bottom: 1px solid ${(props) => props.theme['hairline-color']};

  .name {
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    color: ${(props) => props.theme['title-color']};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .count {
    font-size: 0.78rem;
    font-weight: 500;
    color: ${(props) => props.theme['muted-color']};
  }
`

export const DragHandle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 26px;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: 6px;
  color: ${(props) => props.theme['muted-color']};
  cursor: grab;
  touch-action: none;
  transition: color 160ms ease, background-color 160ms ease;

  svg {
    font-size: 0.8rem;
  }

  &:hover {
    color: ${(props) => props.theme['title-color']};
    background-color: ${(props) => props.theme['card-hover']};
  }

  &:active {
    cursor: grabbing;
  }

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
`

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: auto;
`

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: transparent;
  border: none;
  border-radius: 7px;
  color: ${(props) => props.theme['muted-color']};
  cursor: pointer;
  transition: color 160ms ease, background-color 160ms ease;

  svg {
    font-size: 0.9rem;
  }

  &:hover,
  &.is-open {
    color: ${(props) => props.theme['title-color']};
    background-color: ${(props) => props.theme['card-hover']};
  }
`

export const MenuDropdown = styled.div`
  ${menuSurface}
  position: absolute;
  top: 2.1rem;
  right: 0;
  width: 11rem;
  z-index: 9999;
`

export const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  width: 100%;
  flex: 1;
  min-height: 0;
  padding: 0.6rem;
  overflow-y: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme['scroll-color']};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  scrollbar-width: thin;
  scrollbar-color: ${(props) => props.theme['scroll-color']} transparent;
`

export const EmptyTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  min-height: 92px;
  border: dashed 1.5px ${(props) => props.theme['hairline-strong']};
  border-radius: 9px;
  color: ${(props) => props.theme['muted-color']};

  svg {
    font-size: 1.1rem;
    opacity: 0.7;
  }

  span {
    font-size: 0.72rem;
    font-weight: 500;
  }
`

export const AddTaskButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.65rem 0.8rem;
  background: transparent;
  border: none;
  border-top: 1px solid ${(props) => props.theme['hairline-color']};
  color: ${(props) => props.theme['muted-color']};
  font-size: 0.76rem;
  font-weight: 500;
  transition: color 140ms, background-color 140ms;

  svg {
    font-size: 0.75rem;
  }

  &:hover {
    color: ${(props) => props.theme['accent-text']};
    background-color: ${(props) => props.theme['accent-soft']};
  }
`
