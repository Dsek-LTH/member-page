import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const pageStyles = makeStyles((theme: Theme) => ({
  sidebarGrid: {
    [theme.breakpoints.up("md")]: {
      marginTop: "76px",
      borderRadius: "10px",
      padding: 0,
      position: "sticky",
      top: "-76px",
    },
  },
  container: {
    width: "90%",
    margin: "auto",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    minHeight: "100%",
  },
}));
