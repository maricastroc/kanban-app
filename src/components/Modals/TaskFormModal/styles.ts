import styled from 'styled-components'

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
  padding: 1rem 0 0;
`
