import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :focus {
    outline: none;
    boxShadow: 0 0 0 2px rgba(99, 95, 199, 1);
  }

  body {
    background-color: ${(props) => props.theme['gray-700']};
    color: ${(props) => props.theme['white-color']};
    height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, button {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }

  ::-webkit-scrollbar {
    width: 0.7rem;
    height: 0.4rem;
  }

  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme['gray-500']};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-corner {
    background-color: ${(props) => props.theme['gray-800']};
  }
`
