import styled from 'styled-components'

const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const SheetHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  width: 100%;
  flex-shrink: 0;
  padding: 1.7rem 1.5rem 1.1rem;
`

export const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 11px;
  background-color: ${(props) => props.theme['accent-soft']};
  color: ${(props) => props.theme['accent-color']};
  font-size: 0.95rem;
`

export const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-width: 0;
`

export const SheetTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${(props) => props.theme['title-color']};
`

export const SheetSubtitle = styled.p`
  font-size: 0.78rem;
  color: ${(props) => props.theme['muted-color']};
  line-height: 1.35;
`

export const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: ${(props) => props.theme['muted-color']};
  transition: background-color 140ms ease, color 140ms ease;

  svg {
    font-size: 1.05rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['hairline-color']};
    color: ${(props) => props.theme['title-color']};
  }
`

export const Body = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  padding: 0.2rem 1rem 1.2rem;
`

export const TagList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const TagRow = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.7rem 0.6rem;
  border-radius: 9px;
  border-bottom: 1px solid ${(props) => props.theme['hairline-color']};
  transition: background-color 140ms ease, box-shadow 140ms ease;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: ${(props) => hexToRgba(props.$color, 0.1)};
    box-shadow: inset 2px 0 0 ${(props) => props.$color};
  }

  &:hover .row-actions {
    opacity: 1;
    pointer-events: auto;
  }
`

export const Swatch = styled.span<{ $color: string }>`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 6px;
  background-color: ${(props) => props.$color};
  box-shadow: inset 0 0 0 1px ${(props) => hexToRgba(props.$color, 0.5)},
    0 1px 4px ${(props) => hexToRgba(props.$color, 0.35)};
`

export const TagInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
`

export const TagName = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(props) => props.theme['title-color']};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TagMeta = styled.span`
  font-size: 0.72rem;
  color: ${(props) => props.theme['muted-color']};
`

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.15rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 140ms ease;

  @media (hover: none) {
    opacity: 1;
    pointer-events: auto;
  }
`

export const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 7px;
  color: ${(props) => props.theme['muted-color']};
  transition: background-color 140ms ease, color 140ms ease;

  svg {
    font-size: 0.82rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['hairline-strong']};
    color: ${(props) => props.theme['title-color']};
  }

  &.danger:hover {
    color: ${(props) => props.theme['error-color']};
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.3rem;
  padding: 2rem 1rem;

  p {
    font-size: 0.82rem;
    color: ${(props) => props.theme['muted-color']};
  }
`

/* ---- inline composer (create / edit) ---- */

export const Composer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  padding: 0.85rem;
  margin: 0.4rem 0;
  border-radius: 11px;
  background-color: ${(props) => props.theme['field-bg']};
  border: 1px solid ${(props) => props.theme['hairline-strong']};
`

export const ComposerInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 0.8rem;
  border-radius: 8px;
  background-color: ${(props) => props.theme['card-color']};
  border: 1px solid ${(props) => props.theme['border-color']};
  color: ${(props) => props.theme['title-color']};
  font-size: 0.85rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &::placeholder {
    color: ${(props) => props.theme['muted-color']};
  }

  &:focus,
  &:focus-visible {
    outline: none;
    border-color: ${(props) => props.theme['accent-color']};
    box-shadow: 0 0 0 3px ${(props) => props.theme['accent-soft']};
  }
`

export const SwatchPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`

export const SwatchOption = styled.button<{
  $color: string
  $selected: boolean
}>`
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  cursor: pointer;
  background-color: ${(props) => props.$color};
  border: none;
  box-shadow: ${(props) =>
    props.$selected
      ? `0 0 0 2px ${props.theme['field-bg']}, 0 0 0 4px ${props.$color}`
      : `inset 0 0 0 1px ${hexToRgba(props.$color, 0.55)}`};
  transition: transform 120ms ease, box-shadow 150ms ease;

  &:hover {
    transform: scale(1.08);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.25;
    transform: none;
  }
`

export const ComposerActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
`

export const ComposerHint = styled.span`
  font-size: 0.72rem;
  color: ${(props) => props.theme['muted-color']};
`

export const ComposerButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  height: 40px;
  margin-bottom: 0.7rem;
  padding: 0 0.8rem;
  border-radius: 9px;
  background-color: ${(props) => props.theme['field-bg']};
  border: 1px solid ${(props) => props.theme['border-color']};
  transition: border-color 150ms ease, box-shadow 150ms ease;

  svg {
    color: ${(props) => props.theme['muted-color']};
    font-size: 0.82rem;
  }

  input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    color: ${(props) => props.theme['title-color']};
    font-size: 0.85rem;

    &::placeholder {
      color: ${(props) => props.theme['muted-color']};
    }
  }

  &:focus-within {
    border-color: ${(props) => props.theme['accent-color']};
    box-shadow: 0 0 0 3px ${(props) => props.theme['accent-soft']};
  }
`
