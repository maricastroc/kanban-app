import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  width: 100%;
  max-width: 100vw;
  padding: 1rem;
  background-color: ${(props) => props.theme['canvas-color']};
  border-bottom: solid 1px ${(props) => props.theme['hairline-color']};
  position: sticky;
  top: 0;
  z-index: 10;

  @media (min-width: 768px) {
    padding: 1.1rem 1.5rem;
    margin-left: 220px;
    width: auto;

    &.hide-sidebar-mode {
      margin-left: 0;
    }
  }
`

export const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-width: 0;
`

export const Eyebrow = styled.div`
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  color: ${(props) => props.theme['muted-color']};
  margin-bottom: -0.3rem;
`

export const BoardName = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: ${(props) => props.theme['title-color']};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60vw;

  @media (min-width: 920px) {
    font-size: 1.6rem;
  }
`

export const MetricStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;

  .chevron {
    display: none;
  }

  @media (max-width: 767px) {
    .chevron {
      display: inline-flex;
      align-items: center;
      color: ${(props) => props.theme['accent-color']};
      margin-left: 0.1rem;
      font-size: 0.7rem;
    }
  }
`

export const StatChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  height: 22px;
  padding: 0 0.5rem;
  border-radius: 7px;
  background-color: ${(props) => props.theme['panel-color']};
  border: 1px solid ${(props) => props.theme['hairline-color']};
  font-size: 0.7rem;
  color: ${(props) => props.theme['muted-color']};
  white-space: nowrap;

  strong {
    font-weight: 500;
    color: ${(props) => props.theme['text-color']};
  }

  .ring {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${(props) => props.theme['accent-color']};
  }
`

export const BoardNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
  cursor: default;

  @media (max-width: 767px) {
    cursor: pointer;
  }
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`

export const ActionBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 40px;
  padding: 0 1rem;
  border-radius: 10px;
  border: none;
  background-color: ${(props) => props.theme['accent-color']};
  transition: background-color 160ms ease, box-shadow 160ms ease,
    transform 120ms ease;

  &:hover {
    box-shadow: 0 0 0 4px ${(props) => props.theme['accent-soft']};
  }

  &:active {
    transform: scale(0.97);
  }

  svg {
    font-size: 0.8rem;
    color: ${(props) => props.theme['button-title']};
  }

  p {
    font-size: 0.8rem;
    font-weight: 600;
    color: ${(props) => props.theme['button-title']};
  }

  &:hover {
    background-color: ${(props) => props.theme['accent-hover']};
  }

  &.secondary {
    background-color: ${(props) => props.theme['card-color']};
    border: 1px solid ${(props) => props.theme['border-color']};

    svg {
      color: ${(props) => props.theme['subtitle-color']};
    }

    p {
      color: ${(props) => props.theme['text-color']};
    }

    &:hover {
      background-color: ${(props) => props.theme['card-hover']};
      border-color: ${(props) => props.theme['hairline-strong']};
    }
  }

  p {
    display: none;
  }

  @media (min-width: 560px) {
    p {
      display: block;
    }
  }
`

export const EditDeleteBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.theme['card-color']};
  border: 1px solid ${(props) => props.theme['border-color']};
  border-radius: 9px;

  svg {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.1rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['card-hover']};
  }
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  transition: opacity 160ms ease;

  &.disabled {
    opacity: 0.4;
    cursor: default;
    pointer-events: none;
  }
`

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 160px;
  height: 40px;
  padding: 0 0.8rem;
  border-radius: 9px;
  background-color: ${(props) => props.theme['card-color']};
  border: 1px solid ${(props) => props.theme['border-color']};
  transition: border-color 160ms;

  svg {
    font-size: 0.85rem;
    color: ${(props) => props.theme['muted-color']};
    flex-shrink: 0;
  }

  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.8rem;
    color: ${(props) => props.theme['text-color']};

    &::placeholder {
      color: ${(props) => props.theme['muted-color']};
    }
  }

  .clear {
    cursor: pointer;
    color: ${(props) => props.theme['muted-color']};
    font-size: 0.85rem;

    &:hover {
      color: ${(props) => props.theme['text-color']};
    }
  }

  .kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 5px;
    background-color: ${(props) => props.theme['kbd-bg']};
    border: 1px solid ${(props) => props.theme['hairline-color']};
    font-size: 0.66rem;
    font-weight: 600;
    color: ${(props) => props.theme['muted-color']};
    flex-shrink: 0;
  }

  &:focus-within {
    border-color: ${(props) => props.theme['accent-color']};
    box-shadow: 0 0 0 3px ${(props) => props.theme['accent-soft']};

    .kbd {
      opacity: 0;
    }
  }
`

export const ToolButtonWrapper = styled.div`
  position: relative;
`

export const ToolButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  height: 40px;
  padding: 0 0.9rem;
  border-radius: 9px;
  background-color: ${(props) => props.theme['card-color']};
  border: 1px solid ${(props) => props.theme['border-color']};
  color: ${(props) => props.theme['text-color']};
  font-size: 0.8rem;
  font-weight: 500;
  transition: background-color 160ms, border-color 160ms;

  svg {
    font-size: 0.8rem;
    color: ${(props) => props.theme['muted-color']};
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 8px;
    font-size: 0.62rem;
    font-weight: 700;
    background-color: ${(props) => props.theme['accent-color']};
    color: ${(props) => props.theme['accent-on']};
  }

  &:hover,
  &.open {
    background-color: ${(props) => props.theme['card-hover']};
    border-color: ${(props) => props.theme['hairline-strong']};
  }

  &.active {
    border-color: ${(props) => props.theme['accent-color']};
    color: ${(props) => props.theme['accent-text']};

    svg {
      color: ${(props) => props.theme['accent-color']};
    }
  }
`

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 50;
  min-width: 200px;
  padding: 0.4rem;
  border-radius: 10px;
  background-color: ${(props) => props.theme['card-color']};
  border: 1px solid ${(props) => props.theme['hairline-strong']};
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  gap: 1px;

  .dropdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.35rem 0.5rem 0.5rem;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: ${(props) => props.theme['muted-color']};

    button {
      cursor: pointer;
      background: none;
      border: none;
      font-size: 0.66rem;
      font-weight: 700;
      letter-spacing: 0.4px;
      color: ${(props) => props.theme['accent-text']};
      text-transform: none;
    }
  }

  .empty {
    padding: 0.5rem;
    font-size: 0.76rem;
    color: ${(props) => props.theme['muted-color']};
  }
`

export const DropdownItem = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.5rem 0.5rem;
  border-radius: 7px;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 0.8rem;
  color: ${(props) => props.theme['text-color']};
  transition: background-color 140ms;

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .check {
    margin-left: auto;
    font-size: 0.75rem;
    color: ${(props) => props.theme['accent-color']};
  }

  span.label {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background-color: ${(props) => props.theme['hairline-color']};
  }

  &.selected {
    color: ${(props) => props.theme['accent-text']};
  }
`
