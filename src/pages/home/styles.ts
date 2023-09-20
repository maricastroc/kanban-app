import { styled } from '@/styles'
import { ToastContainer } from 'react-toastify'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
})

export const Wrapper = styled('div', {
  display: 'flex',
  width: '100%',
  overflow: 'auto',
})

export const ColumnsContainer = styled('div', {
  display: 'flex',
  width: '100%',
  padding: '1.5rem 1rem 0',
  overflowY: 'auto',
  overflowX: 'scroll',
  gap: '1.5rem',
  paddingBottom: '1.5rem',

  '&.hand-cursor': {
    cursor: 'grab',
  },

  '@media(min-width: 768px)': {
    padding: '1.5rem',
    height: '100%',
  },

  '@media(min-width: 1024px)': {
    padding: '2rem',
    gap: '2rem',
    height: '100%',
  },
})

export const NewColumnContainer = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '17.5rem',
  height: '100%',
  marginTop: '2.4rem',
  borderRadius: 8,
  background:
    'linear-gradient(to bottom,rgba(121,132,147,.2),rgba(130,143,163,.1),rgba(130,143,163,0))',

  '&:hover': {
    h2: {
      color: '$purple500',
      transition: '200ms',
    },
  },
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

export const StyledToastContainer = styled(ToastContainer, {
  '& .Toastify__toast': {
    backgroundColor: '$gray700',
    color: '$gray300',
    borderRadius: 4,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '0.85rem',
    lineHeight: 1.5,
  },

  '& .Toastify__close-button': {
    color: '$white',
  },

  '& .Toastify__toast-body svg': {
    fill: '$purple500',
    fontSize: '0.5rem',
  },

  '& .Toastify__progress-bar': {
    backgroundColor: '$purple500',
  },
})

export const ShowSidebarButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderTopRightRadius: 22,
  borderBottomRightRadius: 22,
  position: 'absolute',
  zIndex: 9999,
  backgroundColor: '$purple500',
  width: 56,
  height: 48,
  top: '87%',

  svg: {
    fontSize: '1.5rem',
    color: '$white',
  },

  '&:hover': {
    backgroundColor: '$purple300',
    transition: '200ms',
  },
})
