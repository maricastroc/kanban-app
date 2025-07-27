import styled from 'styled-components'

export const TagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.4rem;
  padding: 1.3rem 0 0;

  span {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
`

export const TagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.85rem;
  background-color: ${(props) => props.theme['bg-color']};
  border-radius: 8px;
  width: 100%;

  p {
    color: ${(props) => props.theme['details-color']};
    font-size: 0.85rem;
  }
`

export const TagName = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 0.5rem;

  p {
    font-size: 0.75rem;
    margin-left: 1rem;
    font-weight: 700;
    color: ${(props) => props.theme['title-color']};
  }
`

export const TagMark = styled.div<{ color: string }>`
  width: 30px;
  height: 10px;
  border-radius: 8px;
  background-color: ${(props) => props.color};

  &.title {
    margin-top: -0.2rem;
  }
`
