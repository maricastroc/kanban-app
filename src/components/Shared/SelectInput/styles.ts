import styled from 'styled-components'

import {
  SelectTrigger,
  SelectIcon,
  SelectValue,
  SelectContent,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectItem,
  SelectViewport,
  SelectItemText,
  SelectGroup,
} from '@radix-ui/react-select'

export const Trigger = styled(SelectTrigger)`
  height: 2.7rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: ${(props) => props.theme['body-l']};
  color: ${(props) => props.theme['subtitle-color']};
  background-color: transparent;
  border: solid 2px ${(props) => props.theme['border-color']};
  border-radius: 4px;
  padding: 0.5rem 1rem;
`

export const Value = styled(SelectValue)`
  color: ${(props) => props.theme['title-color']};
`

export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

export const ItemText = styled(SelectItemText)`
  color: ${(props) => props.theme['title-color']};
  margin-left: 8px;
`

export const Circle = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => props.color};

  &.title {
    margin-top: -0.2rem;
  }
`

export const Icon = styled(SelectIcon)`
  margin-left: 0.5rem;
  color: ${(props) => props.theme['title-color']};
`

export const Content = styled(SelectContent)`
  z-index: 10000;
  width: 250px;
  height: 10rem;
  overflow-y: scroll;
  margin-top: 0.25rem;
  background-color: ${(props) => props.theme['bg-color']};
  color: ${(props) => props.theme['details-color']};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
  border-radius: 0.375rem;
  border: none;
  font-size: ${(props) => props.theme['body-l']};

  @media (min-width: 480px) {
    width: 300px;
  }
`

export const ScrollUpButton = styled(SelectScrollUpButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme['title-color']};
`

export const ScrollDownButton = styled(SelectScrollDownButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme['title-color']};
`

export const Viewport = styled(SelectViewport)`
  padding: 0.25rem;
`

export const SelectItemStyled = styled(SelectItem)<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  margin: 0.5rem;
  cursor: pointer;
  color: ${(props) =>
    props.disabled
      ? props.theme['subtitle-color']
      : props.theme['details-color']};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? 'transparent' : '#bfdbfe'};
  }

  &:focus {
    background-color: #bfdbfe;
    color: ${(props) => props.theme['select-color']};
  }
`

export const DisabledText = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  color: ${(props) => props.theme['subtitle-color']};
`

export const Group = styled(SelectGroup)`
  width: 100%;
`
