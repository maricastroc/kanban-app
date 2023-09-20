import { styled } from '../../styles'

export const Description = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: '1.5rem',

  p: {
    color: '$gray400',
    fontSize: '0.8125rem',
    lineHeight: '1.4rem',
  },
})

export const ButtonsContainer = styled('div', {
  display: 'flex',
  marginTop: '1.5rem',
  flexDirection: 'column',
  width: '100%',
  gap: '1rem',
})
