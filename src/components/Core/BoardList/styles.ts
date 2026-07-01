import styled from 'styled-components'

export const BoardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  gap: 1px;
  padding: 0 0.6rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`

export const EmptyBoardsHint = styled.p`
  padding: 0.4rem 0.65rem 0.75rem;
  font-size: 0.76rem;
  line-height: 1.4;
  color: ${(props) => props.theme['muted-color']};
`

export const BoardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  flex-shrink: 0;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`

export const BoardButton = styled.button`
  cursor: pointer;
  position: relative;
  display: flex;
  padding: 0.6rem 0.65rem;
  align-items: center;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  gap: 0.6rem;
  width: 100%;
  text-align: left;
  color: ${(props) => props.theme['subtitle-color']};
  transition: background-color 160ms, color 160ms;

  svg {
    font-size: 0.95rem;
    flex-shrink: 0;
    color: ${(props) => props.theme['muted-color']};
  }

  p {
    flex: 1;
    min-width: 0;
    font-size: 0.82rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: inherit;
  }

  .count {
    font-size: 0.68rem;
    font-weight: 600;
    color: ${(props) => props.theme['muted-color']};
  }

  &:hover {
    background-color: ${(props) => props.theme['hairline-color']};
    color: ${(props) => props.theme['text-color']};
  }

  &.active {
    background-color: ${(props) => props.theme['accent-soft']};
    color: ${(props) => props.theme['accent-text']};

    svg {
      color: ${(props) => props.theme['accent-color']};
    }

    .count {
      color: ${(props) => props.theme['accent-color']};
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 16px;
      width: 2px;
      border-radius: 0 2px 2px 0;
      background-color: ${(props) => props.theme['accent-color']};
    }
  }

  &:focus-visible {
    outline-offset: -2px;
  }
`

// The "Create board" affordance. Placement differs per surface (pinned in the
// sidebar, inline in the mobile sheet), but the visual is shared here so the two
// never drift apart.
export const CreateBoardButton = styled.button`
  cursor: pointer;
  display: flex;
  padding: 0.6rem 0.65rem;
  align-items: center;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  gap: 0.6rem;
  width: 100%;
  text-align: left;
  color: ${(props) => props.theme['accent-color']};
  transition: background-color 160ms;

  .plus-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    border-radius: 6px;
    background-color: ${(props) => props.theme['accent-soft']};
  }

  svg {
    font-size: 0.8rem;
    color: ${(props) => props.theme['accent-color']};
  }

  p {
    font-size: 0.82rem;
    font-weight: 600;
    color: ${(props) => props.theme['accent-color']};
  }

  &:hover {
    background-color: ${(props) => props.theme['accent-soft']};
  }
`
