import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const articleEditorItemStyles = makeStyles((theme: Theme) => ({
  uploadButton: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
    },
  },
}));
