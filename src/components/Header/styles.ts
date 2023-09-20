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

  '@media(min-width: 768px)': {
    padding: '0',
    justifyContent: 'initial',
    borderBottom: 'solid 1px $gray500',
  },
})

export const Wrapper = styled('div', {
  display: 'flex',

  '@media(min-width: 768px)': {
    alignItems: 'center',
    gap: '1rem',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: '1.7rem',
    marginLeft: 0,
  },
})

export const BoardName = styled('h2', {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '$white',
  marginLeft: '1.8rem',
  padding: '1.75rem 0',

  '@media(min-width: 1024px)': {
    fontSize: '1.5rem',
  },
})

export const LogoContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  minWidth: 260,
  borderRight: 'solid 1px $gray500',
  height: 80,
})

export const LogoWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  paddingLeft: '1.7rem',
})

export const TextMobileContainer = styled('div', {
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

  '@media(min-width: 768px)': {
    gap: '1.5rem',
  },
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

  p: {
    display: 'none',
  },

  '&:hover': {
    transition: '200ms',
    backgroundColor: '$purple300',
  },

  '@media(min-width: 768px)': {
    gap: '1.5rem',
    width: 164,
    height: 48,
    borderRadius: 22,

    svg: {
      display: 'none',
    },

    p: {
      display: 'block',
      fontSize: '0.93rem',
      color: '$white',
      fontWeight: 700,
    },
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

  '@media(min-width: 1024px)': {
    top: '3.5rem',
  },
})
