import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible,
  a:focus-visible
  {
    outline: 2px solid ${(props) => props.theme['accent-color']};
    outline-offset: 2px;
    border-color: ${(props) => props.theme['accent-color']};
  }

  button:focus-visible {
    outline: 2px solid ${(props) => props.theme['accent-color']};
    outline-offset: 2px;
  }

  body {
    background-color: ${(props) => props.theme['bg-color']};
    color: ${(props) => props.theme['title-color']};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body, input, textarea, button {
    font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont,
      'Segoe UI', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    letter-spacing: -0.01em;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont,
      'Segoe UI', sans-serif;
    letter-spacing: -0.02em;
  }

  ::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme['scroll-color']};
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${(props) => props.theme['muted-color']};
    background-clip: padding-box;
  }

  ::-webkit-scrollbar-corner {
    background-color: ${(props) => props.theme['scroll-color']};
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    border: 2px solid ${(props) => props.theme['border-color']};
    -webkit-text-fill-color: ${(props) => props.theme['text-color']};
    -webkit-box-shadow: 0 0 0px 1000px ${(props) =>
      props.theme['field-bg']} inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`
