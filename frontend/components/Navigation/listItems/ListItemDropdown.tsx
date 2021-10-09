import React from 'react';
import { useTranslation } from 'next-i18next';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ListItemLink from './ListItemLink';
import { NavigationItem } from '../types/navigationItem';
import { listItemsStyles } from '../styles/listItemsStyles';
import { useRouter } from 'next/router';

type ListItemDropdownProps = {
  item: NavigationItem;
  divider?: boolean;
  defaultOpen?: boolean;
};

export default function ListItemDropdown({
  item,
  divider = false,
  defaultOpen = false,
}: ListItemDropdownProps) {
  const classes = listItemsStyles();
  const router = useRouter();
  const { t } = useTranslation('common');
  const [open, setOpen] = React.useState(defaultOpen);

  const handleClick = () => {
    setOpen((currentValue) => !currentValue);
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
          <ListItemIcon className={classes.listIcon}>{item.icon}</ListItemIcon>
          <ListItemText primary={t(item.translationKey)} />
        </ListItemLink>

        <div onClick={() => handleClick()} className={classes.dropdownListIcon}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </div>
      </ListItem>

      {/*Expanded list */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {item.children.map((child, i) => (
            <ListItemLink
              className={classes.subListItem}
              selected={router.asPath === child.path}
              divider={i + 1 !== item.children.length}
              href={child.path}
              key={child.translationKey}
              sx={{ pl: 3 }}
            >
              <ListItemIcon className={classes.listIcon}>
                {child.icon}
              </ListItemIcon>
              <ListItemText primary={t(child.translationKey)} />
            </ListItemLink>
          ))}
        </List>
      </Collapse>
    </>
  );
}
