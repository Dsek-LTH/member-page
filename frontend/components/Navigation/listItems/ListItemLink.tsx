import React, { PropsWithChildren } from 'react';
import ListItem, { ListItemBaseProps } from '@mui/material/ListItem';
import Link from 'next/link';
import listItemsStyles from '../styles/listItemsStyles';

type ListItemLinkProps = PropsWithChildren<{href: string, className?: string}> & ListItemBaseProps;

export default function ListItemLink(props: ListItemLinkProps) {
  const { href } = props;
  const classes = listItemsStyles();

  return (
    <Link href={href}>
      <a
        href={href}
        className={classes.listItemAnchor}
      >
        <ListItem button {...props} />
      </a>
    </Link>
  );
}
