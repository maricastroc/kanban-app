import styled from 'styled-components'

export const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem;
  background-color: ${(props) => props.theme['gray-600']};
  position: sticky;
  top: 0;
  z-index: 10;

  @media (min-width: 768px) {
    padding: 0;
    justify-content: initial;
    border-bottom: solid 1px ${(props) => props.theme['gray-500']};
  }
`

export const Wrapper = styled.div`
  display: flex;

  @media (min-width: 768px) {
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
    padding-right: 1.7rem;
    margin-left: 0;
  }
`

export const BoardName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme['white-color']};
  margin-left: 1.8rem;
  padding: 1.75rem 0;

  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
`

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 260px;
  border-right: solid 1px ${(props) => props.theme['gray-500']};
  height: 80px;
`

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1.7rem;
`

export const TextMobileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    width: 24px;
    height: 24px;
  }
`

export const LaunchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  background-color: transparent;
  border: none;

  h2 {
    font-size: 1.125rem;
    font-weight: 700;
    color: ${(props) => props.theme['white-color']};
  }

  svg {
    color: ${(props) => props.theme['purple-500']};
    font-size: 0.85rem;
    margin-top: 0.3rem;
    margin-left: -0.4rem;
  }

  &:focus {
    box-shadow: none;
  }
`

export const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;

  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`

export const AddButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme['purple-500']};
  width: 48px;
  height: 32px;
  border: none;
  border-radius: 16px;

  svg {
    font-size: 1rem;
    color: ${(props) => props.theme['white-color']};
  }

  p {
    display: none;
  }

  &:hover {
    transition: 200ms;
    background-color: ${(props) => props.theme['purple-300']};
  }

  @media (min-width: 768px) {
    gap: 1.5rem;
    width: 164px;
    height: 48px;
    border-radius: 22px;

    svg {
      display: none;
    }

    p {
      display: block;
      font-size: 0.93rem;
      color: ${(props) => props.theme['white-color']};
      font-weight: 700;
    }
  }
`

export const ViewMoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const ViewMoreButton = styled.button`
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
    color: ${(props) => props.theme['gray-400']};
    font-size: 1.5rem;
  }

  &:hover {
    background-color: ${(props) => props.theme['gray-700']};
    transition: 200ms;
  }

  &:focus {
    box-shadow: none;
  }
`

export const ViewMoreModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.2rem;
  border-radius: 8px;
  position: absolute;
  gap: 0.7rem;
  top: 2.8rem;
  right: 0;
  width: 10rem;
  background-color: ${(props) => props.theme['gray-700']};

  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 1rem;

    &:focus {
      box-shadow: none;
    }

    &.edit {
      color: ${(props) => props.theme['gray-400']};
    }

    &.delete {
      color: ${(props) => props.theme['red-500']};
    }
  }

  @media (min-width: 1024px) {
    top: 3.5rem;
  }
`
