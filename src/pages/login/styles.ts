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
  background-image: radial-gradient(
    600px circle at 50% 38%,
    rgba(26, 162, 148, 0.07),
    transparent 70%
  );
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
  max-width: 31.25rem;
  flex-direction: column;
  background-color: ${(props) => props.theme['bg-color']};

  @media (min-width: 480px) {
    padding: 2.3rem;
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
    padding-bottom: 0.75rem;
  }
`

export const Tagline = styled.p`
  width: 100%;
  text-align: center;
  color: ${(props) => props.theme['paragraph-color']};
  font-size: ${(props) => props.theme['heading-m']};
  letter-spacing: 0.2px;
  padding-bottom: 1.75rem;
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  gap: 0.65rem;
  color: ${(props) => props.theme['title-color']};

  h1 {
    font-size: ${(props) => props.theme['heading-xxl']};
    color: ${(props) => props.theme['title-color']};
  }

  p {
    color: ${(props) => props.theme['paragraph-color']};
    font-size: ${(props) => props.theme['heading-m']};
    line-height: 1.25rem;
  }
`

export const FormContainer = styled.form`
  display: flex;
  align-items: flex-start;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2.5rem;

  > button {
    height: 52px;
  }
`

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 0.5rem;
  gap: 0.75rem;
`

export const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  color: ${(props) => props.theme['paragraph-color']};
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${(props) => props.theme['border-color']};
  }
`

export const FormField = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  margin-bottom: 0.5rem;
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
  margin-top: 0.2rem;
  background-color: transparent;
  border: 2px solid ${(props) => props.theme['border-color']};
  border-radius: 5px;
  color: ${(props) => props.theme['text-color']};
  font-size: ${(props) => props.theme['body-l']};

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

  &:focus,
  &:focus-visible {
    background-color: transparent;
    outline: none;
    border-color: ${(props) => props.theme['accent-color']};
    box-shadow: 0 0 0 3px ${(props) => props.theme['accent-soft']};
  }

  &:-webkit-autofill:focus {
    border: 2px solid ${(props) => props.theme['accent-color']};
    box-shadow: 0 0 0px 1000px #000 inset,
      0 0 0 3px ${(props) => props.theme['accent-soft']};
  }

  &.error {
    border: solid 2px ${(props) => props.theme['error-color']};
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
    margin-top: 0.45rem;
  }
`

export const PasswordIconWrapper = styled.button`
  position: absolute;
  border: 2px solid transparent;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  right: 1rem;
  padding: 0.3rem;
  top: 52%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${(props) => props.theme['details-color']};
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
    color: ${(props) => props.theme['paragraph-color']};
    font-size: ${(props) => props.theme['heading-m']};
  }

  a {
    background-color: transparent;
    text-decoration: none;
    border: 2px solid transparent;
    border-radius: 4px;
    color: ${(props) => props.theme['accent-color']};
    transition: color 200ms;
    font-size: ${(props) => props.theme['heading-m']};

    &:hover {
      color: ${(props) => props.theme['accent-hover']};
      text-decoration: underline;
    }
  }

  @media (min-width: 480px) {
    flex-direction: row;
    gap: 0.4rem;
  }
`
