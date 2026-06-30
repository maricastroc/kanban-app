import styled from 'styled-components'

/**
 * Shared drag-handle (the "grip dots") used as the drag activator across the
 * sortable lists — board columns, and the subtasks in the task view/edit
 * modals. Muted by default, brightens on hover, shows the grab/grabbing cursor.
 */
export const DragHandle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 26px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: ${(props) => props.theme['muted-color']};
  font-size: 0.8rem;
  cursor: grab;
  touch-action: none;
  transition: color 140ms ease, background-color 140ms ease;

  &:hover:not(:disabled) {
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
