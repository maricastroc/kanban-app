import styled from 'styled-components'

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    max-width: 85%;
  }
`

export const Description = styled.div`
  display: flex;
  margin-top: 1.5rem;
  flex-direction: column;
  width: 100%;

  p {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 0.8125rem;
    line-height: 1.4rem;
  }
`

export const SubtasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`

export const SubtasksTitle = styled.strong`
  font-size: 0.75rem;
  color: ${(props) => props.theme['title-color']};
  font-weight: 700;
  margin-top: 1.5rem;
`

export const CurrentStatusTitle = styled.strong`
  font-size: 0.75rem;
  color: ${(props) => props.theme['title-color']};
  font-weight: 700;
  margin-top: 1.5rem;
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const OptionsButton = styled.button`
  cursor: pointer;
  display: flex;
  background-color: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  align-items: center;
  justify-content: center;

  svg {
    cursor: pointer;
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 1.5rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['bg-color']};
    transition: 200ms;
  }
`

export const OptionsModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.2rem;
  border-radius: 8px;
  position: absolute;
  gap: 0.7rem;
  top: 2.5rem;
  right: 0;
  width: 10rem;
  background-color: ${(props) => props.theme['bg-color']};

  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 1rem;

    &.edit {
      color: ${(props) => props.theme['subtitle-color']};
    }

    &.delete {
      color: ${(props) => props.theme['error-color']};
    }
  }
`

export const EmptySubtask = styled.p`
  color: ${(props) => props.theme['subtitle-color']};
  font-size: 0.8125rem;
  line-height: 1.4rem;
  margin-top: 0.5rem;
`
