import React from 'react';
import ListItem from '@mui/material/ListItem';
import Link from 'next/link';
import { listItemsStyles } from '../styles/listItemsStyles';

export default function ListItemLink(props) {
  const classes = listItemsStyles();

  return (
    <Link href={props.href}>
      <a 
        className={classes.listItemAnchor}
      >
        <ListItem button {...props} />
      </a>
    </Link>
  );
}
