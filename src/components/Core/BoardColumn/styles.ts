import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
  min-width: 17.5rem;
  max-width: 17.5rem;
  height: 100%;
  width: 100%;
  margin-bottom: 2.5rem;

  &.empty {
    margin-bottom: 0;
  }
`

export const TagContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: transparent;
  }

  p {
    color: ${(props) => props.theme['subtitle-color']};
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.75rem;
    font-weight: 700;
  }
`

export const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  padding-bottom: 2rem;
  height: 100%;

  @media (min-width: 1024px) {
    gap: 1.25rem;
  }
`

export const EmptyTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  border: dashed 2px ${(props) => props.theme['border-color']};
  height: 100%;
  border-radius: 8px;
`
