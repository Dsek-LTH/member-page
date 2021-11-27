import React from 'react';
import { useTranslation } from 'next-i18next';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemLink from './listItems/ListItemLink';
import { NavigationItem } from './types/navigationItem';
import { listItemsStyles } from './styles/listItemsStyles';
import ListItemDropdown from './listItems/ListItemDropdown';
import { useRouter } from 'next/router';
import items from './NavigationItems';

type ListItemSetProps = {
  className?: string;
};

export default function ListItemSet({ className }: ListItemSetProps) {
  const classes = listItemsStyles();
  const router = useRouter();
  const { t } = useTranslation('common');

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
              key={item.translationKey}
              divider={i + 1 !== items.length}
              defaultOpen={router.asPath.includes(item.path)}
            />
          );
        }

        return (
          <ListItemLink
            selected={router.asPath === item.path}
            divider={i + 1 !== items.length}
            href={item.path}
            key={item.translationKey}
          >
            <ListItemIcon className={classes.listIcon}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={t(item.translationKey)} />
          </ListItemLink>
        );
      })}
    </List>
  );
}
