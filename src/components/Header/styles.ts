import { styled } from '@/styles'

export const Container = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.25rem 1rem',
  backgroundColor: '$gray600',
  position: 'sticky',
  top: 0,
  zIndex: 10,
})

export const TextContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',

  img: {
    width: 24,
    height: 24,
  },
})

export const LaunchButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',

  h2: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '$white',
  },

  svg: {
    color: '$purple500',
    fontSize: '0.85rem',
    marginTop: '0.3rem',
    marginLeft: '-0.4rem',
  },

  '&:focus': {
    boxShadow: 'none',
  },
})

export const OptionsContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
})

export const AddButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$purple500',
  width: 48,
  height: 32,
  border: 'none',
  borderRadius: 16,

  svg: {
    fontSize: '1rem',
    color: '$white',
  },
})

export const ViewMoreButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  border: 'none',

  svg: {
    fontSize: '1rem',
    color: '$white',
  },
})
