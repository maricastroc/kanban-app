import styled, { keyframes } from 'styled-components'

const enter = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* Fill the board area (a flex-start row) and center on both axes, so the
     empty state sits in the middle instead of sinking to the bottom. */
  flex: 1;
  align-self: stretch;
  height: 100%;
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 90%;
  animation: ${enter} 250ms ease both;

  @media (min-width: 480px) {
    width: 28rem;
  }

  h2 {
    margin-top: 1.75rem;
    font-size: ${(props) => props.theme['heading-xxl']};
    font-weight: 700;
    color: ${(props) => props.theme['title-color']};
    letter-spacing: -0.02em;
  }

  p {
    margin-top: 0.6rem;
    max-width: 22rem;
    font-size: ${(props) => props.theme['body-l']};
    line-height: 1.55;
    color: ${(props) => props.theme['subtitle-color']};
  }
`

export const Illustration = styled.div`
  color: ${(props) => props.theme['accent-color']};

  svg {
    width: 132px;
    height: auto;
  }
`

export const ButtonContent = styled.div`
  margin-top: 1.6rem;

  p {
    margin-top: 0;
    color: ${(props) => props.theme['button-title']};
  }
`

export const FeatureDivider = styled.span`
  width: 100%;
  max-width: 18rem;
  height: 1px;
  margin: 2rem 0 1.5rem;
  background-color: ${(props) => props.theme['hairline-color']};
`

export const FeatureList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.7rem 1.4rem;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: ${(props) => props.theme['body-m']};
    font-weight: 500;
    color: ${(props) => props.theme['details-color']};
  }

  svg {
    width: 16px;
    height: 16px;
    padding: 3px;
    border-radius: 50%;
    color: ${(props) => props.theme['accent-text']};
    background-color: ${(props) => props.theme['accent-soft']};
  }
`
