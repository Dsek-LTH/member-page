import { makeStyles } from '@material-ui/core/styles';

export const listItemsStyles = makeStyles(theme => ({
    nestedListItem: {
        padding: 0,
        color: "inherit",
        
        '& span': {
            fontSize: "1rem",
        },
    },

    subListItem: {
        '& svg': {
            fontSize: "1.35rem",
        },
        '& span': {
            fontSize: "0.8rem",
        },
    },
    listIcon: {
        minWidth: "36px",
    },
    dropdownListItem: {
        height: "48px"
    },
    dropdownListIcon: {
        height: "24px",
        color: "rgba(0, 0, 0, 0.54)"
    },
    listItemAnchor: {
        color: "inherit",
        textDecoration: "none",
        width: "100%"
    }
}))