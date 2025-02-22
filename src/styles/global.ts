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
    background-color: ${(props) => props.theme['bg-color']};
    color: ${(props) => props.theme['title-color']};
    height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, button {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Plus Jakarta Sans', sans-serif;
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
    background-color: ${(props) => props.theme['scroll-color']};
    border-radius: 10px;
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
  border: 1px solid ${(props) => props.theme['details-color']};
  -webkit-text-fill-color: ${(props) => props.theme['details-color']};
  -webkit-box-shadow: 0 0 0px 1000px #000 inset;
  transition: background-color 5000s ease-in-out 0s;
}

`
