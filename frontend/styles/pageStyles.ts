import { makeStyles } from '@material-ui/core/styles';

export const pageStyles = makeStyles(theme => ({
    container: {
        width: "90%",
        margin: "auto",
    },
    sidebar: {
        [theme.breakpoints.up('lg')]: {
            marginTop: "76px",
            borderRadius: "10px",
            padding: 0,
          },
    },
    sidebarGrid: {
        [theme.breakpoints.up('md')]: {
            position: "sticky",
            top: "-76px",
        },
    }
}))