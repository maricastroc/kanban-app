import { styled } from '@/styles'

export const Title = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  h3: {
    fontSize: '1.125rem',
    fontWeight: 700,
    maxWidth: '85%',
  },
})

export const Description = styled('div', {
  display: 'flex',
  marginTop: '1.5rem',
  flexDirection: 'column',
  width: '100%',

  p: {
    color: '$gray400',
    fontSize: '0.8125rem',
    lineHeight: '1.4rem',
  },
})

export const SubtasksContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginTop: '1rem',
})

export const SubtasksTitle = styled('strong', {
  fontSize: '0.75rem',
  color: '$white',
  fontWeight: 700,
  marginTop: '1.5rem',
})

export const CurrentStatusTitle = styled('strong', {
  fontSize: '0.75rem',
  color: '$white',
  fontWeight: 700,
  marginTop: '1.5rem',
})

export const OptionsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
})

export const OptionsButton = styled('button', {
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
})

export const OptionsModal = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1.2rem',
  borderRadius: 8,
  position: 'absolute',
  gap: '0.7rem',
  top: '2.5rem',
  right: 0,
  width: '10rem',
  backgroundColor: '$gray700',

  button: {
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1rem',

    '&.edit': {
      color: '$gray400',
    },

    '&.delete': {
      color: '$red500',
    },
  },
})

export const EmptySubtask = styled('p', {
  color: '$gray400',
  fontSize: '0.8125rem',
  lineHeight: '1.4rem',
  marginTop: '0.5rem',
})
