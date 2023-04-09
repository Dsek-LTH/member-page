import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export default makeStyles((theme: Theme) => ({
  sidebar: {
    [theme.breakpoints.up('md')]: {
      marginTop: '76px',
      borderRadius: '10px',
      padding: 0,
    },
  },
  sidebarGrid: {
    [theme.breakpoints.up('md')]: {
      position: 'sticky',
      top: '-76px',
    },
  },
  container: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
  },
}));

export const fullWidth = {
  position: 'relative',
  width: {
    xs: '90vw',
    md: '95vw',
  },
  left: {
    xs: 'calc(-45vw + 50%)',
    md: 'calc(-47.5vw + 50%)',
  },
};
