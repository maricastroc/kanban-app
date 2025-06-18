import styled from 'styled-components'

export const SubtasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
`

export const EmptySubtask = styled.p`
  color: ${(props) => props.theme['subtitle-color']};
  font-size: ${(props) => props.theme['body-l']};
  line-height: 1.4rem;
  margin-top: 0.5rem;
`
