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
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.18);
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
    background-color: ${(props) => props.theme['card-hover']};
    border-color: ${(props) => props.theme['hairline-strong']};
    box-shadow: ${(props) => props.theme['card-shadow']};
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }

  &.dragging {
    cursor: grabbing;
    background-color: ${(props) => props.theme['card-hover']};
    border-color: ${(props) => props.theme['accent-color']};
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.5),
      0 0 0 1px ${(props) => props.theme['accent-soft']};
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

  &.overdue {
    p,
    svg {
      color: ${(props) => props.theme['overdue-color']};
    }
  }

  &.completed {
    p,
    svg {
      color: ${(props) => props.theme['completed-color']};
    }
  }

  &.due_soon {
    p,
    svg {
      color: ${(props) => props.theme['due-soon-color']};
    }
  }
`
