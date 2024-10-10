import styled from 'styled-components'

export const LayoutContainer = styled.div`
  padding: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  width: 100%;
  gap: 3rem;
`

export const StyledPickerContainer = styled.div`
  .react-colorful {
    min-height: 20rem;
    width: 100%; /* Ajuste de largura */
    border-radius: 8px; /* Modifique o raio das bordas */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .react-colorful__saturation {
    border-radius: 8px;
  }

  .react-colorful__hue {
    margin-top: 1rem;
    height: 12px; /* Altura da barra de saturação */
  }

  .react-colorful__hue-pointer,
  .react-colorful__saturation-pointer {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${(props) => props.theme['primary-color']};
  }
`
