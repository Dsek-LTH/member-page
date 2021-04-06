import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Link from 'next/link'

export default function ListItemLink(props) {
    return (
        <Link href={props.href}>
            <ListItem button {...props} />
        </Link>
    );
}