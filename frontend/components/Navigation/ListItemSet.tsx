import React from 'react';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemLink from './listItems/ListItemLink'
import { NavigationItem } from './types/navigationItem'
import { listItemsStyles } from './styles/listItemsStyles';
import ListItemDropdown from './listItems/ListItemDropdown';
import { useRouter } from 'next/router';

type ListItemSetProps = {
    className?: string
    items: NavigationItem[]
}

export default function ListItemSet({ className, items }: ListItemSetProps) {

    const classes = listItemsStyles();
    const router = useRouter();

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={className}
        >

            {items.map((item, i) => {
                if (item.children) {
                    return (
                        <ListItemDropdown 
                            item={item} 
                            key={item.text} 
                            divider={i + 1 !== items.length}
                            defaultOpen = {router.asPath.includes(item.path)}
                        />
                    )
                }

                return (
                    <ListItemLink  
                        selected={router.asPath === item.path}
                        divider={i + 1 !== items.length}
                        href={item.path}
                        key={item.text}
                    >
                        <ListItemIcon className={classes.listIcon}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemLink>
                )
            })}
        </List>
    )
}