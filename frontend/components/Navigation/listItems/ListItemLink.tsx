import React, { PropsWithChildren } from 'react';
import Link from 'next/link';
import { ListItemButton, ListItemButtonProps } from '@mui/material';
import listItemsStyles from '../styles/listItemsStyles';

type ListItemLinkProps =
  PropsWithChildren<{ href: string, className?: string }> & ListItemButtonProps;

export default function ListItemLink(props: ListItemLinkProps) {
  const { href } = props;
  const classes = listItemsStyles();

  return (
    <Link href={href}>
      <a
        href={href}
        className={classes.listItemAnchor}
      >
        <ListItemButton {...props} />
      </a>
    </Link>
  );
}
