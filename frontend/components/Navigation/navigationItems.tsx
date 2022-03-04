import React from 'react';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import EventIcon from '@mui/icons-material/Event';
import FeedIcon from '@mui/icons-material/Feed';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { DateTime } from 'luxon';
import EditCalendarIcon from '../Icons/EditCalendarIcon';
import routes from '~/routes';
import DsekIcon from '../Icons/DsekIcon';
import { NavigationItem } from './types/navigationItem';
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
  {
    translationKey: 'cafe',
    path: routes.cafe,
    icon: <LocalCafeIcon color="primary" />,
    hasAccess: () => true,
  },
  {
    translationKey: 'doors',
    path: routes.doors,
    icon: <MeetingRoomIcon color="primary" />,
    hasAccess: (apiContext) => hasAccess(apiContext, 'core:access:door:create'),
  },
  {
    translationKey: 'editApis',
    path: routes.editApis,
    icon: <AutoFixHighIcon color="primary" />,
    hasAccess: (apiContext) => hasAccess(apiContext, 'core:access:api:create'),
  },
];

export default navigationItems;
