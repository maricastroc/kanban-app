import styled from 'styled-components'

export const TaskCardContainer = styled.div`
  cursor: grab;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.85rem 0.8rem 1rem;
  outline: none;
  border-radius: 11px;
  background-color: ${(props) => props.theme['card-color']};
  border: 1px solid ${(props) => props.theme['hairline-color']};
  box-shadow: ${(props) => props.theme['shadow-xs']};
  width: 100%;
  align-items: flex-start;
  transition: background-color 180ms ease, border-color 180ms ease,
    box-shadow 180ms ease, transform 180ms ease;
  will-change: transform;

  strong {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${(props) => props.theme['title-color']};
    line-height: 1.4;
    letter-spacing: -0.01em;
  }

  &:hover {
    background-color: ${(props) => props.theme['card-lift']};
    border-color: ${(props) => props.theme['hairline-strong']};
    box-shadow: ${(props) => props.theme['shadow-sm']};
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }

  &.dragging {
    cursor: grabbing;
    background-color: ${(props) => props.theme['card-lift']};
    border-color: ${(props) => props.theme['accent-color']};
    box-shadow: ${(props) => props.theme['shadow-lg']},
      0 0 0 1px ${(props) => props.theme['accent-color']};
  }

  /* When dragging is off (loading / filtering), the card is only clickable —
     drop the grab affordance so it doesn't promise a move that won't happen.
     Declared last so it wins over :active on equal specificity. */
  &.drag-disabled,
  &.drag-disabled:active {
    cursor: default;
  }
`

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
  width: 100%;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  height: 16px;
  padding: 0 0.35rem;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
  filter: saturate(0.8);
`

export const ProgressWrapper = styled.div`
  width: 100%;
`

export const ProgressContainer = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${(props) => props.theme['hairline-strong']};
  border-radius: 3px;
  overflow: hidden;
`

export const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: ${(props) => props.theme['accent-color']};
  transition: width 0.3s ease-in-out;
  border-radius: 3px;
`

export const InfoContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
`

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: ${(props) => props.theme['muted-color']};

  p {
    color: ${(props) => props.theme['muted-color']};
    font-size: 0.7rem;
    font-weight: 500;
  }

  svg {
    color: ${(props) => props.theme['muted-color']};
    font-size: 0.72rem;
  }
`

// The due-date status reads as a chip (tinted fill + soft border) sitting next
// to the date, so it shares the visual language of the tags up top without
// being mistaken for one — the date stays the primary datum, muted.
export const DueChip = styled.span`
  display: inline-flex;
  align-items: center;
  height: 17px;
  padding: 0 0.4rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;

  &.overdue {
    color: ${(props) => props.theme['overdue-color']};
    background-color: ${(props) => `${props.theme['overdue-color']}1f`};
    border-color: ${(props) => `${props.theme['overdue-color']}33`};
  }

  &.due_soon {
    color: ${(props) => props.theme['due-soon-color']};
    background-color: ${(props) => `${props.theme['due-soon-color']}1f`};
    border-color: ${(props) => `${props.theme['due-soon-color']}33`};
  }

  &.completed {
    color: ${(props) => props.theme['completed-color']};
    background-color: ${(props) => `${props.theme['completed-color']}1f`};
    border-color: ${(props) => `${props.theme['completed-color']}33`};
  }
`
