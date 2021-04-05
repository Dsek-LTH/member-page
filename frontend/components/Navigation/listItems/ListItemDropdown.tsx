import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ListItemLink from './ListItemLink';
import { NavigationItem } from '../types/navigationItem'
import { listItemsStyles } from '../styles/listItemsStyles';
import { useRouter } from 'next/router';

type ListItemDropdownProps = {
    item: NavigationItem,
    divider?: boolean,
    defaultOpen?: boolean
}

export default function ListItemDropdown({ item, divider = false, defaultOpen = false }: ListItemDropdownProps) {
    const classes = listItemsStyles();
    const router = useRouter();

    const [open, setOpen] = React.useState(defaultOpen);

    const handleClick = () => {
        setOpen(currentValue => !currentValue);
    };

    return (
        <>
            {/* Dropdown */}
            <ListItem 
                button 
                selected={router.asPath === item.path} 
                divider={divider} 
                className={classes.dropdownListItem}
            >
                <ListItemLink 
                    button={false} 
                    className={classes.nestedListItem} 
                    disableGutters 
                    dense 
                    href={item.path}
                >
                    <ListItemIcon className={classes.listIcon}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemLink>

                <div onClick={() => handleClick()} className={classes.dropdownListIcon}>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </div>
            </ListItem>

            {/*Expanded list */}
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding >
                    {item.children.map((child, i) => (
                        <ListItemLink 
                            className={classes.subListItem} 
                            selected={router.asPath === child.path}  
                            divider={i+1 !== item.children.length} 
                            href={child.path} 
                            key={child.text} 
                            sx={{ pl: 3 }}
                        >
                            <ListItemIcon className={classes.listIcon}>
                                {child.icon}
                            </ListItemIcon>
                            <ListItemText primary={child.text} />
                        </ListItemLink>
                    ))}
                </List>
            </Collapse>
        </>
    );
}

