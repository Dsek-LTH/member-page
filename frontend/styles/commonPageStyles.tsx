import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const commonPageStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '90%',
    margin: 'auto',
  },
  innerContainer: {
    padding: theme.spacing(2),
  },
  sidebarGrid: {
    [theme.breakpoints.up('md')]: {
      position: 'sticky',
      top: '0',
    },
  },
}));
