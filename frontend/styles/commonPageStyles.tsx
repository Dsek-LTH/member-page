import { makeStyles } from '@material-ui/core/styles';

export const commonPageStyles = makeStyles(theme => ({
    container: {
        width: "90%",
        margin: "auto",
    },
    innerContainer: {
        padding: theme.spacing(2),
    },
    sidebarGrid: {
        [theme.breakpoints.up('md')]: {
            position: "sticky",
            top: "0",
        },
    }
}))