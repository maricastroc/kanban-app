import styled from 'styled-components'

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  flex-grow: 1;
  background-color: ${(props) => props.theme['bg-color']};
`

export const LoginCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
  width: 90%;
  border-radius: 15px;
  padding-top: 4.5rem;
  padding-bottom: 4rem;
  margin-bottom: 1.5rem;
  max-width: 30rem;
  flex-direction: column;
  background-color: ${(props) => props.theme['bg-color']};

  @media (min-width: 480px) {
    padding: 2rem;
    margin-bottom: 2.5rem;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${(props) => props.theme['cards-color']};
  }
`

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2.5rem;
  gap: 1.3rem;
  width: 100%;

  img {
    scale: 1.2;
  }

  @media (min-width: 480px) {
    padding-bottom: 2.5rem;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  gap: 0.65rem;
  color: ${(props) => props.theme['title-color']};

  h1 {
    font-size: 1.8rem;
    color: ${(props) => props.theme['title-color']};
  }

  p {
    color: ${(props) => props.theme['subtitle-color']};
    font-size: 0.95rem;
    line-height: 1.25rem;
  }

  @media (min-width: 480px) {
    p {
      font-size: 0.95rem;
    }
  }
`

export const FormContainer = styled.form`
  display: flex;
  align-items: flex-start;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 0.5rem;
  gap: 0.75rem;
`

export const FormField = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
  margin-bottom: 0.5rem;

  p {
    font-size: 14px;
    color: ${(props) => props.theme['title-color']};
  }
`

export const InputContainer = styled.div`
  position: relative;
  background-color: transparent;
  width: 100%;
`

export const InputField = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  padding-left: 3rem;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme['border-color']};
  border-radius: 5px;
  color: ${(props) => props.theme['text-color']};
  font-size: 1rem;

  &:-webkit-autofill {
    background-color: transparent !important;
    color: ${(props) => props.theme['text-color']} !important;
    box-shadow: 0 0 0px 1000px transparent inset !important;
  }

  &:-moz-placeholder {
    background-color: transparent;
  }

  &::-webkit-input-placeholder {
    background-color: transparent;
  }

  &:focus {
    background-color: transparent;
  }
`

export const IconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;

  svg {
    color: ${(props) => props.theme['details-color']};
    margin-top: 0.25rem;
  }
`

export const PasswordIconWrapper = styled.button`
  position: absolute;
  border: none;
  background-color: transparent;
  cursor: pointer;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);

  svg {
    color: ${(props) => props.theme['details-color']};
    margin-top: 0.25rem;
  }
`

export const CreateAccountContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;

  p {
    color: ${(props) => props.theme['subtitle-color']};
  }

  a {
    background-color: transparent;
    text-decoration: none;
    border: none;
    color: ${(props) => props.theme['primary-color']};
    transition: 200ms;

    &:hover {
      color: ${(props) => props.theme['primary-hover']};
    }
  }

  @media (min-width: 480px) {
    flex-direction: row;
    gap: 0.4rem;
  }
`
