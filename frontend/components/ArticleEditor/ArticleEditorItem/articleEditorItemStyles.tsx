import { makeStyles } from '@material-ui/core/styles';

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