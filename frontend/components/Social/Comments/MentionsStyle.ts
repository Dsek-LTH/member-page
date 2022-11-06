export default {
  width: '85%',

  control: {
    backgroundColor: 'transparent',
    fontSize: '1rem',
    fontWeight: 'normal',
    color: 'inherit',
  },

  '&multiLine': {
    control: {
      fontFamily: 'Roboto',
      minHeight: '1rem',
      color: 'inherit',
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: '0.5rem 1rem',
      borderRadius: '2rem',
      color: 'inherit',
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
      color: 'inherit',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'black',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: 'pink',
      },
    },
  },
};
