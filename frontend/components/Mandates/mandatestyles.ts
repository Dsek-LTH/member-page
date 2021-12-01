import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const mandateStyles = makeStyles((theme: Theme) => ({
  hideStepperLabel: {
    display: "none",
  },
  header: {
    background:
      theme.palette.mode === "light"
        ? theme.palette.primary.main
        : theme.palette.primary.dark,
  },
  rowEven: {
    background: theme.palette.background.default,
  },
  rowOdd: {
    background:
      theme.palette.mode === "light" ? theme.palette.primary.light : "",
  },
}));
