import { makeStyles } from '@material-ui/core/styles';

export const articlePageStyles = makeStyles(theme => ({
    container: {
        width: "80%",
        margin: "auto",
    },
    sidebarGrid: {
        [theme.breakpoints.up('md')]: {
            position: "sticky",
            top: "0",
        },
    }
}))