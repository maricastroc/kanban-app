import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  inset: 0;
  z-index: 9998;
  background-color: rgba(10, 10, 10, 0.7);
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem;
  background-color: ${(props) => props.theme['gray-600']};
  border: none;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(300px, 90vw, 33rem);
  border-radius: 8px;
  z-index: 9999;

  &:focus {
    box-shadow: none;
  }

  &.bigger {
    padding: 1.5rem 1.5rem 3rem;
    height: 90vh;
    overflow-y: scroll;
  }
`

export const Title = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  max-width: 100%;

  &.delete {
    color: ${(props) => props.theme['red-500']};
  }
`

export const FormError = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.theme['red-500']};
  font-weight: 700;
`

export const FormContainer = styled.form`
  display: flex;
  margin-top: 1.5rem;
  flex-direction: column;
  width: 100%;
  gap: 1.5rem;
`

export const DataContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  flex-direction: column;
  width: 100%;
  gap: 1.5rem;
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.7rem;
  width: 100%;
`

export const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => props.theme['white-color']};
  margin-bottom: 0.7rem;
`

export const Input = styled.input`
  pointer-events: initial;
  opacity: 1;
  width: 100%;
  background-color: ${(props) => props.theme['gray-600']};
  border: solid 2px ${(props) => props.theme['gray-500']};
  padding: 0.7rem 1rem;
  color: ${(props) => props.theme['white-color']};
  font-size: 0.8125rem;
  border-radius: 4px;

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`

export const TextArea = styled.textarea`
  background-color: ${(props) => props.theme['gray-600']};
  border: solid 2px ${(props) => props.theme['gray-500']};
  padding: 0.7rem 1rem;
  line-height: 1.3rem;
  color: ${(props) => props.theme['white-color']};
  font-size: 0.8125rem;
  border-radius: 4px;
  min-height: 112px;
  resize: none;
  width: 100%;
`

export const InputVariantsContainer = styled.div`
  display: flex;
  flex-direction: column;

  span {
    margin-top: 0.3rem;
    display: block;
    color: ${(props) => props.theme['red-500']};
    font-size: 0.75rem;
    font-weight: 700;
    left: 75%;
  }
`
