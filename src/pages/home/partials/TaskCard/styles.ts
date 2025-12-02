import styled from 'styled-components'

export const TaskCardContainer = styled.div`
  cursor: grab;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  outline: none;
  border-radius: 8px;
  background-color: ${(props) => props.theme['cards-color']};
  width: 100%;
  align-items: flex-start;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: 300ms;

  strong {
    font-size: ${(props) => props.theme['heading-m']};
    font-weight: 700;
    color: ${(props) => props.theme['title-color']};
    line-height: 1.3rem;
  }

  p {
    font-size: ${(props) => props.theme['heading-s']};
    font-weight: 700;
    color: ${(props) => props.theme['subtitle-color']};
  }

  &:hover {
    animation: shake 0.4s ease-in-out;
    filter: brightness(0.85);
  }
`

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  overflow: auto;
`

export const Tag = styled.span`
  height: 8px;
  border-radius: 8px;
  width: 2.5rem;
`

export const InfoContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin-top: 0.15rem;
`

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: ${(props) => props.theme['subtitle-color']};
  justify-content: flex-start;

  p {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: ${(props) => props.theme['heading-s']};
  }

  svg {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 13px;
    margin-top: -0.1rem;
  }

  &.overdue {
    svg {
      color: ${(props) => props.theme['overdue-color']};
    }
  }

  &.completed {
    svg {
      color: ${(props) => props.theme['completed-color']};
    }
  }

  &.due_soon {
    svg {
      color: ${(props) => props.theme['due-soon-color']};
    }
  }
`

export const ProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  svg {
    color: ${(props) => props.theme['title-hover']};
    font-size: 14px;
  }
`

export const ProgressContainer = styled.div`
  width: 100%;
  height: 9px;
  background-color: ${(props) => props.theme['border-color']};
  border-radius: 4px;
  overflow: hidden;
  padding: 0.08rem;
`

export const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: ${(props) => props.theme['primary-color']};
  transition: width 0.3s ease-in-out;
  border-radius: 4px;
`
