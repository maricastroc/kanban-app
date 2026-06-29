import styled from 'styled-components'

// Dashed "Add column" composer reuses the shared sheet primitive.
export { DashedComposerBtn as AddColumnBtn } from '../Sheet/styles'

export const ColumnsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  width: 100%;
  margin-bottom: 0.7rem;
`

export const ColumnRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  height: 44px;
  padding: 0 0.4rem 0 0.65rem;
  background-color: ${(props) => props.theme['field-bg']};
  border: 1px solid ${(props) => props.theme['border-color']};
  border-radius: 9px;
  transition: border-color 160ms ease, box-shadow 160ms ease,
    background-color 160ms ease;

  &:hover {
    border-color: ${(props) => props.theme['hairline-strong']};
  }

  &:focus-within {
    border-color: ${(props) => props.theme['accent-color']};
    box-shadow: 0 0 0 3px ${(props) => props.theme['accent-soft']};
    background-color: ${(props) => props.theme['card-color']};
  }

  &.error {
    border-color: ${(props) => props.theme['error-color']};
  }
`

export const GripIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${(props) => props.theme['muted-color']};
  font-size: 0.8rem;
  cursor: grab;
`

export const ColumnInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: ${(props) => props.theme['title-color']};
  font-size: 0.85rem;

  &::placeholder {
    color: ${(props) => props.theme['muted-color']};
  }
`

export const RemoveColumnBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 7px;
  color: ${(props) => props.theme['muted-color']};
  transition: background-color 140ms ease, color 140ms ease;

  svg {
    font-size: 0.95rem;
  }

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme['hairline-color']};
    color: ${(props) => props.theme['error-color']};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }
`
