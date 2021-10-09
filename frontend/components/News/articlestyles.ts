import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const articleStyles = makeStyles((theme: Theme) => ({
    article: {
        color: "#454545",
        fontSize: "1em",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "10px",
    },
    header: {
        color: "#706072",
        fontWeight: 500,
        marginBlockStart: 0,
        marginBlockEnd: 0,
        fontSize: "2em",
        textOverflow: "ellipsis",
        overflow: "hidden",
        height: "1.5em",
        whiteSpace: "nowrap",
        [theme.breakpoints.down('xs')]: {
            fontSize: "1.7em"
          },
    },
    imageGrid: {
        textAlign: "center",
    },
    bodyGrid: {
        maxWidth: "100%",
        '& img': {
            maxWidth: "100%"
        },
        '& code': {
            display: "block",
            overflow: "auto",
        }
    },
    image: {
        maxWidth: "200px",
        height: "200px",
        borderRadius: "20px",
        objectFit: "cover",
        [theme.breakpoints.up('lg')]: {
            position: "absolute",
            top: "0",
            bottom: "0",
            right: "0",
            margin: "auto",
        },
        [theme.breakpoints.down('md')]: {
            maxWidth: "80%",
        },
    }, 
    footer: {
        color: "#706072",
        fontSize: "0.8em",
        marginTop: "5px"
    },
}))