import styled, { css } from 'styled-components'

/**
 * Shared popover-menu primitives (Edit/Delete/Logout style dropdowns).
 * `menuSurface` is position-agnostic — apply absolute/fixed positioning
 * per usage. Pair with <MenuItem /> and <MenuDivider />.
 */
export const menuSurface = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.2rem;
  padding: 0.3rem;
  border-radius: 10px;
  z-index: 10;
  background-color: ${(props) => props.theme['card-color']};
  border: 1px solid ${(props) => props.theme['hairline-strong']};
  box-shadow: ${(props) => props.theme['shadow-md']};
`

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  text-align: left;
  padding: 0.55rem 0.7rem;
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 7px;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${(props) => props.theme['text-color']};
  transition: background-color 140ms ease, color 140ms ease;

  svg {
    font-size: 0.78rem;
    width: 0.95rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['card-hover']};
    color: ${(props) => props.theme['title-color']};
  }

  &.danger {
    color: ${(props) => props.theme['error-color']};
  }

  &.danger:hover {
    background-color: ${(props) => props.theme['card-hover']};
    color: ${(props) => props.theme['error-hover']};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:disabled:hover {
    background-color: transparent;
    color: ${(props) => props.theme['text-color']};
  }
`

export const MenuDivider = styled.div`
  height: 1px;
  width: 100%;
  margin: 0.15rem 0;
  background-color: ${(props) => props.theme['hairline-color']};
`
