import { styled } from '../../styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
})

export const ColumnsContainer = styled('div', {
  display: 'flex',
  width: '100%',
  padding: '1.5rem 1rem 0',
  overflowY: 'auto',
  overflowX: 'scroll',
  gap: '1.5rem',
  paddingBottom: '1.5rem',
})

export const NewColumnContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '17.5rem',
  height: '100%',
  marginTop: '2.4rem',
  borderRadius: 8,
  background:
    'linear-gradient(to bottom,rgba(121,132,147,.2),rgba(130,143,163,.1),rgba(130,143,163,0))',
})

export const NewColumnButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  border: 'none',

  h2: {
    fontSize: 'clamp(1.2rem,3vw,1.5rem)',
    color: '$gray400',
  },
})
