import React from 'react';
import { NavigationItem } from './types/navigationItem';
import EventIcon from '@mui/icons-material/Event';
import FeedIcon from '@mui/icons-material/Feed';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditCalendarIcon from '../Icons/EditCalendarIcon';
import HomeIcon from '@mui/icons-material/Home';
import routes from '~/routes';

const navigationItems: NavigationItem[] = [
  {
    translationKey: 'home',
    path: routes.root,
    icon: <HomeIcon color="primary" />,
  },
  {
    translationKey: 'documents',
    path: routes.documents,
    icon: <LibraryBooksIcon color="primary" />,
    children: [
      {
        translationKey: 'statutes',
        path: routes.statues,
        icon: <LibraryBooksIcon color="primary" />,
      },
      {
        translationKey: 'regulations',
        path: routes.regulations,
        icon: <LibraryBooksIcon color="primary" />,
      },
      {
        translationKey: 'meetingDocuments',
        path: routes.meetingDocuments,
        icon: <LibraryBooksIcon color="primary" />,
      },
    ],
  },
  {
    translationKey: 'calendar',
    path: routes.calendar,
    icon: <EventIcon color="primary" />,
    children: [
      {
        translationKey: 'events_list',
        path: routes.events,
        icon: <EventIcon color="primary" />,
      },
    ],
  },
  {
    translationKey: 'news',
    path: routes.news,
    icon: <FeedIcon color="primary" />,
  },
  {
    translationKey: 'booking',
    path: routes.booking,
    icon: <EditCalendarIcon color="primary" />,
  },
  {
    translationKey: 'archive',
    path: routes.archive,
    icon: <InventoryIcon color="primary" />,
    children: [
      {
        translationKey: 'pictures',
        path: routes.pictures,
        icon: <InventoryIcon color="primary" />,
      },
      {
        translationKey: 'songs',
        path: routes.songs,
        icon: <InventoryIcon color="primary" />,
      },
    ],
  },
];

export default navigationItems;
