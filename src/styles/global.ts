import { globalCss } from '.'

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',

    ':focus': {
      outline: 'transparent',
      boxShadow: '0 0 0 2px rgba(99, 95, 199, 1)',
    },
  },

  body: {
    backgroundColor: '$gray700',
    color: '$white',
    height: '100vh',
    '-webkit-font-smoothing': 'antialiased',

    '*::-webkit-scrollbar': {
      width: '0.7rem',
      height: '0.4rem',
    },

    '*::-webkit-scrollbar-track': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 10,
    },

    '*::-webkit-scrollbar-thumb': {
      background: '$gray500',
      borderRadius: 10,
    },

    '*::-webkit-scrollbar-corner': {
      backgroundColor: '$gray800',
    },
  },

  'body, input, textarea, button': {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 500,
  },
})
