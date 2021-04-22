import { makeStyles } from '@material-ui/core/styles';

export const memberStyles = makeStyles(theme => ({
    member: {
        color: "#454545",
        fontSize: "1em",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "10px",
        '& code': {
            display: "block",
            overflow: "auto",
        },
    },
    skeletonImage: {
        margin: '0 auto',
    },
}))