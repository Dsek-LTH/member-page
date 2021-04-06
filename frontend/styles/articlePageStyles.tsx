import { makeStyles } from '@material-ui/core/styles';

const articlePageStyles = makeStyles(theme => ({
    container: {
        width: "90%",
        margin: "auto",
    },
    sidebarGrid: {
        [theme.breakpoints.up('md')]: {
            position: "sticky",
            top: "0",
        },
    }
}))

export default articlePageStyles;