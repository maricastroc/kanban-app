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
  gap: '0.3rem',
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

export const ViewMoreContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
})

export const ViewMoreButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  backgroundColor: 'transparent',
  border: 'none',
  padding: '0.5rem',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',

  svg: {
    cursor: 'pointer',
    color: '$gray400',
    fontSize: '1.5rem',
  },

  '&:hover': {
    backgroundColor: '$gray700',
    transition: '200ms',
  },

  '&:focus': {
    boxShadow: 'none',
  },
})

export const ViewMoreModal = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1.2rem',
  borderRadius: 8,
  position: 'absolute',
  gap: '0.7rem',
  top: '2.8rem',
  right: 0,
  width: '10rem',
  backgroundColor: '$gray700',

  button: {
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1rem',

    '&:focus': {
      boxShadow: 'none',
    },

    '&.edit': {
      color: '$gray400',
    },

    '&.delete': {
      color: '$red500',
    },
  },
})
