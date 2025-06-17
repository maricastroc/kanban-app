import styled from 'styled-components'

export const TagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.4rem;
  padding: 1rem 0 2rem;
`

export const EmptyWarning = styled.p`
  font-size: 0.9rem;
  color: ${(props) => props.theme['details-color']};
`

export const TagsTitle = styled.p`
  text-align: left;
  font-size: ${(props) => props.theme['body-m']};
  font-weight: 700;
  color: ${(props) => props.theme['title-color']};
  margin-bottom: 0.35rem;
`

export const TagName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  p {
    font-size: ${(props) => props.theme['body-m']};
    font-weight: 700;
    color: ${(props) => props.theme['title-color']};
  }
`

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${(props) => props.theme['subtitle-color']};
    cursor: pointer;
    transition: 200ms;

    &:hover {
      color: ${(props) => props.theme['title-color']};
    }

    &.delete {
      &:hover {
        color: ${(props) => props.theme['error-color']};
      }
    }
  }
`

export const Circle = styled.div<{ color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${(props) => props.color};

  &.title {
    margin-top: -0.2rem;
  }
`

export const DeleteTagContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  width: 100%;
  gap: 0.4rem;
  margin-top: 1rem;
  line-height: 1.25rem;

  h2 {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
  }

  p {
    color: ${(props) => props.theme['details-color']};
    font-size: 0.9rem;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
  width: 100%;
  gap: 0.5rem;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`

export const TagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem;
  background-color: ${(props) => props.theme['bg-color']};
  border-radius: 8px;
  width: 100%;

  p {
    color: ${(props) => props.theme['details-color']};
    font-size: 0.85rem;
  }
`
