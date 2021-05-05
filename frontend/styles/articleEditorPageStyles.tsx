import { makeStyles } from '@material-ui/core/styles';

const articleEditorPageStyles = makeStyles(theme => ({
    container:{
        padding: "1em",
    },
    removeButton: {
        marginTop: theme.spacing(2)
    } 
}))

export default articleEditorPageStyles;