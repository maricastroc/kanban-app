import styled from 'styled-components'

interface TagContainerProps {
  variant: '1' | '2' | '3' | '4' | '5' | '6'
}

const tagVariants = {
  1: 'tag-color-1',
  2: 'tag-color-2',
  3: 'tag-color-3',
  4: 'tag-color-4',
  5: 'tag-color-5',
  6: 'tag-color-6',
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
  min-width: 17.5rem;
  max-width: 17.5rem;
  width: 100%;
`

export const TagContainer = styled.div<TagContainerProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    width: 15px;
    height: 15px;
    border-radius: 50%;

    background-color: ${(props) =>
      props.theme[`${tagVariants[props.variant]}`]};
  }

  strong {
    color: ${(props) => props.theme['gray-400']};
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.75rem;
  }
`

export const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  padding-bottom: 2rem;

  @media (min-width: 1024px) {
    gap: 1.5rem;
  }
`

export const EmptyTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  border: dashed 2px ${(props) => props.theme['gray-500']};
  height: 100vh;
  border-radius: 8px;
`

export const TaskItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border-radius: 8px;
  background-color: ${(props) => props.theme['gray-600']};
  width: 100%;
  align-items: flex-start;

  strong {
    font-size: 0.95rem;
    font-weight: 700;
    color: ${(props) => props.theme['white-color']};
    line-height: 1.3rem;
  }

  p {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${(props) => props.theme['gray-400']};
  }

  &:hover {
    transition: 200ms;

    strong {
      color: ${(props) => props.theme['purple-500']};
    }
  }
`
