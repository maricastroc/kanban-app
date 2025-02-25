import styled from 'styled-components'
import { Content as RadixContent } from '@radix-ui/react-dialog'

export const StyledDatePickerWrapper = styled.div`
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker {
    background-color: ${(props) => props.theme['bg-color']};
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 0.7rem;

    div {
      color: ${(props) => props.theme['title-color']};
    }

    button {
      color: ${(props) => props.theme['title-color']};
      top: 1rem;
      width: 16px;
      height: 16px;
      right: 0.3rem;
      fill: ${(props) => props.theme['border-color']};
      color: ${(props) => props.theme['border-color']};
    }

    span {
      height: 5px;
      margin-top: -1rem;
      margin-right: 1.25rem;
      fill: ${(props) => props.theme['border-color']};

      &::before {
        height: 7px;
        width: 7px;
        border-color: ${(props) => props.theme['subtitle-color']};
      }
    }
  }

  .react-datepicker__day-names {
    padding-top: 1rem;
  }

  .react-datepicker__header {
    position: relative;
    background-color: transparent;
    border: none;
    color: ${(props) => props.theme['title-color']};

    h2,
    div {
      color: ${(props) => props.theme['title-color']};
    }
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--today,
  .react-datepicker__day:hover {
    background-color: ${(props) => props.theme['subtitle-color']};
    color: white;
  }

  .react-datepicker__day--today {
    background-color: ${(props) => props.theme['border-color']};
    border-radius: 4px;
    color: white;
  }

  .react-datepicker-popper[data-placement^='top'] .react-datepicker__triangle {
    color: ${(props) => props.theme['bg-color']};
    fill: ${(props) => props.theme['bg-color']};
    stroke: ${(props) => props.theme['bg-color']};
  }
`

export const SubtasksForm = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0.7rem;
`

export const SubtasksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

export const TagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.4rem;
  padding: 1rem 0 2rem;
`

export const ModalContent = styled(RadixContent)<{ padding?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 2rem;
  height: auto;
  max-height: 30rem;
  background-color: ${(props) => props.theme['cards-color']};
  border: none;
  overflow-y: auto;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(300px, 90vw, 33rem);
  border-radius: 8px;
  z-index: 9999;
  animation: scaleIn 0.5s ease-out forwards;

  &:focus {
    box-shadow: none;
  }

  &.lg {
    max-height: 35rem;
  }

  &.xl {
    height: auto;
    max-height: 35rem;
  }

  &.smaller {
    height: auto;
  }

  &.delete {
    height: auto;
    overflow: auto;
    max-height: auto;
    width: clamp(300px, 90vw, 28rem);
  }

  @keyframes scaleIn {
    0% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
`

export const EmptyWarning = styled.p`
  font-size: 0.9rem;
  color: ${(props) => props.theme['details-color']};
`

export const TagsTitle = styled.p`
  text-align: left;
  color: ${(props) => props.theme['details-color']};
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
`

export const TagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  padding: 0.7rem 0.6rem;
  border: 2px solid ${(props) => props.theme['border-color']};
  border-radius: 4px;
  width: 100%;

  p {
    color: ${(props) => props.theme['details-color']};
    font-size: 0.85rem;
  }
`

export const TagName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
