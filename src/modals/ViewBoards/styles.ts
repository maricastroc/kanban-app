import styled from 'styled-components'
import { Root as RadixRoot, Thumb as RadixThumb } from '@radix-ui/react-switch'

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem 0;
  background-color: ${(props) => props.theme['gray-600']};
  border: none;
  position: fixed;
  overflow-x: hidden;
  overflow-y: scroll;
  left: 50%;
  top: 50%;
  height: fit-content;
  max-height: 100vh;
  transform: translate(-50%, -50%);
  width: clamp(300px, 90vw, 320px);
  border-radius: 8px;
  z-index: 9999;

  &:focus {
    box-shadow: none;
  }
`

export const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0 1.5rem;
  width: 100%;

  h3 {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${(props) => props.theme['gray-400']};
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }
`

export const Description = styled.div`
  display: flex;
  margin-top: 1.5rem;
  flex-direction: column;
  width: 100%;
`

export const BoardsContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  flex-direction: column;
  width: 100%;
`

export const Board = styled.button`
  cursor: pointer;
  display: flex;
  padding: 0.9rem 1.5rem;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
  border: none;
  gap: 0.75rem;
  width: 100%;

  p {
    color: ${(props) => props.theme['gray-400']};
    font-size: 0.93rem;
    font-weight: 700;
  }

  img {
    color: color: ${(props) => props.theme['gray-400']};
    font-size: 1.5rem;
  }

  &.active {
    background-color: color: ${(props) => props.theme['purple-500']};
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;

    p {
      color: color: ${(props) => props.theme['white-color']};
    }

    img {
      filter: brightness(1.5);
    }
  }

  &.create {
    p {
      color: color: ${(props) => props.theme['purple-500']};
    }

    img {
      filter: invert(39%) sepia(47%) saturate(748%) hue-rotate(203deg)
        brightness(94%) contrast(93%);
    }
  }

  &:focus {
    box-shadow: none;
  }
`

export const ThemeSwitcherContainer = styled.div`
  margin: 1rem 1rem 0;
  background-color: color: ${(props) => props.theme['gray-700']};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 1.5rem;
  width: 90%;

  svg {
    color: color: ${(props) => props.theme['gray-400']};
    font-size: 1.5rem;
  }
`

export const SwitchRoot = styled(RadixRoot)`
  cursor: pointer;
  width: 40px;
  height: 20px;
  background-color: color: ${(props) => props.theme['purple-500']};
  border-radius: 9999px;
  position: relative;
  box-shadow: none;
  border: none;

  &:hover {
    background-color: color: ${(props) => props.theme['purple-300']};
    transition: 200ms;
  }
`

export const SwitchThumb = styled(RadixThumb)`
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: color: ${(props) => props.theme['white-color']};
  top: 3px;
  transform: translateX(-16px);
  transition: transform 0.2s ease;

  &[data-state='checked'] {
    transform: translateX(2px);
  }
`
