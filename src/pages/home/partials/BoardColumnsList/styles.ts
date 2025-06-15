import styled from 'styled-components'

export const AddColumnContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 17.5rem;
  height: auto;
  margin-top: 2.4rem;
  border-radius: 8px;

  &.dark {
    background: linear-gradient(
      to bottom,
      rgba(130, 143, 163, 0.075),
      rgba(130, 143, 163, 0)
    );
  }

  &.light {
    background: linear-gradient(180deg, #e9effa, rgba(233, 239, 250, 0.5));
  }

  &:hover {
    h2 {
      color: ${(props) => props.theme['primary-color']};
      transition: 200ms;
    }
  }
`

export const AddColumnBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: ${(props) => props.theme['subtitle-color']};
  font-weight: 700;
`
