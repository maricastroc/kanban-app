import styled from 'styled-components'
import { Root as RadixRoot, Thumb as RadixThumb } from '@radix-ui/react-switch'

export const ThemeSwitcherContainer = styled.div`
  background-color: ${(props) => props.theme['panel-color']};
  border: 1px solid ${(props) => props.theme['hairline-color']};
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  gap: 1rem;

  svg {
    color: ${(props) => props.theme['muted-color']};
    font-size: 1rem;
  }
`

export const SwitchRoot = styled(RadixRoot)`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 38px;
  height: 20px;
  padding: 0;
  background-color: ${(props) => props.theme['accent-color']};
  border-radius: 9999px;
  position: relative;
  box-shadow: none;
  border: none;
  flex-shrink: 0;
  transition: background-color 200ms ease;

  &:hover {
    background-color: ${(props) => props.theme['accent-hover']};
  }
`

export const SwitchThumb = styled(RadixThumb)`
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #ffffff;
  transform: translateX(3px);
  transition: transform 0.2s ease;
  will-change: transform;

  &[data-state='checked'] {
    transform: translateX(21px);
  }
`
