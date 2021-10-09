import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const pageStyles = makeStyles((theme: Theme) => ({
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
    },
    container: {
        width: "90%",
        margin: "auto",
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
    },
}));