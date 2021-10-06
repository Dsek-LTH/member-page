import { makeStyles } from '@material-ui/styles';

export const articleEditorItemStyles = makeStyles(theme => ({
    uploadButton: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(2),
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2),
        },
    }
}))