import React from 'react';
import { NavigationItem } from './types/navigationItem';
import EventIcon from '@mui/icons-material/Event';
import FeedIcon from '@mui/icons-material/Feed';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EditCalendarIcon from '../Icons/EditCalendarIcon';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import routes from '~/routes';
import DsekIcon from '../Icons/DsekIcon';
import { DateTime } from 'luxon';
import { hasAccess } from '~/providers/ApiAccessProvider';

const navigationItems: NavigationItem[] = [
  {
    translationKey: 'home',
    path: routes.root,
    icon: <HomeIcon color="primary" />,
    hasAccess: () => true,
  },
  {
    translationKey: 'guild',
    path: routes.committees,
    icon: <DsekIcon color="primary" style={{ fontSize: 24 }} />,
    hasAccess: () => true,
    children: [
      {
        translationKey: 'mandates',
        path: routes.mandateByYear(DateTime.now().year),
        icon: <PeopleIcon color="primary" />,
        hasAccess: () => true,
      },
    ],
  },
  {
    translationKey: 'documents',
    path: routes.documents,
    icon: <LibraryBooksIcon color="primary" />,
    hasAccess: () => true,
    children: [
      {
        translationKey: 'statutes',
        path: routes.statues,
        icon: <LibraryBooksIcon color="primary" />,
        hasAccess: () => true,
      },
      {
        translationKey: 'regulations',
        path: routes.regulations,
        icon: <LibraryBooksIcon color="primary" />,
        hasAccess: () => true,
      },
      {
        translationKey: 'meetingDocuments',
        path: routes.meetingDocuments,
        icon: <LibraryBooksIcon color="primary" />,
        hasAccess: () => true,
      },
    ],
  },
  {
    translationKey: 'calendar',
    path: routes.calendar,
    icon: <EventIcon color="primary" />,
    hasAccess: () => true,
    children: [
      {
        translationKey: 'events_list',
        path: routes.events,
        icon: <EventIcon color="primary" />,
        hasAccess: () => true,
      },
      {
        translationKey: 'create_new_event',
        path: routes.createEvent,
        icon: <EventIcon color="primary" />,
        hasAccess: (apiContext) => hasAccess(apiContext, 'event:create'),
      },
    ],
  },
  {
    translationKey: 'news',
    path: routes.news,
    icon: <FeedIcon color="primary" />,
    hasAccess: () => true,
  },
  {
    translationKey: 'booking',
    path: routes.booking,
    icon: <EditCalendarIcon color="primary" />,
    hasAccess: () => true,
  },
];

export default navigationItems;
