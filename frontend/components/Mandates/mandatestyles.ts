import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const mandateStyles = makeStyles((theme: Theme) => ({
  hideStepperLabel: {
    display: "none",
  },
  header: {
    background: theme.palette.primary.main,
  },
  rowEven: {
    background: "#FFFFFF",
  },
  rowOdd: {
    background: theme.palette.primary.light,
  },
}))