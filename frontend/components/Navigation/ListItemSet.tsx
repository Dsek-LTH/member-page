import React from 'react';
import { useTranslation } from 'next-i18next';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import ListItemLink from './listItems/ListItemLink';
import listItemsStyles from './styles/listItemsStyles';
import ListItemDropdown from './listItems/ListItemDropdown';
import items from './navigationItems';
import { useApiAccess } from '~/providers/ApiAccessProvider';

type ListItemSetProps = {
  className?: string;
};

export default function ListItemSet({ className }: ListItemSetProps) {
  const classes = listItemsStyles();
  const router = useRouter();
  const { t } = useTranslation('common');
  const apiContext = useApiAccess();

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={className}
    >
      {items.map((item, i) => (
        item.hasAccess(apiContext) && (
          <div key={item.translationKey}>
            {item.children && (
              <ListItemDropdown
                item={item}
                divider={i + 1 !== items.length}
                defaultOpen={router.asPath.includes(item.path)}
              />
            )}
            {!item.children && (
              <ListItemLink
                selected={router.asPath === item.path}
                divider={i + 1 !== items.length}
                href={item.path}
              >
                <ListItemIcon className={classes.listIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={t(item.translationKey)} />
              </ListItemLink>
            )}
          </div>
        )
      ))}
    </List>
  );
}
