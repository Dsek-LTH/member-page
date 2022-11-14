import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export default makeStyles((theme: Theme) => ({
  article: {
    fontSize: '1em',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '10px',
    a: {
      color: '#454545',
      textDecoration: 'none',
    },
  },
  header: {
    color: theme.palette.text.primary,
    fontWeight: 500,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8em',
    },
    marginTop: '0.2em',
    marginBottom: '0.2em',
  },
  imageGrid: {
    textAlign: 'center',
  },
  bodyGrid: {
    color: theme.palette.text.secondary,
    maxWidth: '100%',
    '& img': {
      maxWidth: '100%',
    },
    '& code': {
      display: 'block',
      overflow: 'auto',
    },
    marginBottom: '0.5em',
  },
  image: {
    width: '100%',
    borderRadius: '20px',
    objectFit: 'cover',
    marginTop: '1rem',
    [theme.breakpoints.down('md')]: {
      maxWidth: '80%',
    },
  },
}));
