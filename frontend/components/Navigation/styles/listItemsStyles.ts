import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  nestedListItem: {
    padding: '0.5rem 1rem',
    color: 'inherit',

    '& span': {
      fontSize: '1rem',
    },
  },

  subListItem: {
    '& svg': {
      fontSize: '1.35rem',
    },
    '& span': {
      fontSize: '0.8rem',
    },
  },
  listIcon: {
    minWidth: '36px',
  },
  dropdownListItem: {
    padding: 0,
  },
  dropdownListIcon: {
    height: '3rem',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
  },
  listItemAnchor: {
    color: 'inherit',
    textDecoration: 'none',
    width: '100%',
  },
}));
