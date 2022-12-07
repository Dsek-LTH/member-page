import React from 'react';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FeedIcon from '@mui/icons-material/Feed';
import HomeIcon from '@mui/icons-material/Home';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import { DateTime } from 'luxon';
import SchoolIcon from '@mui/icons-material/School';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import GavelIcon from '@mui/icons-material/Gavel';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'; import routes from '~/routes';
import DsekIcon from '~/components/Icons/DsekIcon';
import { NavigationItem } from './types';
import { hasAccess } from '~/providers/ApiAccessProvider';
import EditCalendarIcon from '~/components/Icons/EditCalendarIcon';

const navigationItems: NavigationItem[] = [
  {
    translationKey: 'home',
    path: routes.root,
    icon: <HomeIcon color="primary" />,
    hasAccess: () => true,
  },
  {
    translationKey: 'news',
    path: routes.news,
    icon: <FeedIcon color="primary" />,
    hasAccess: () => true,
  },
  {
    translationKey: 'events',
    path: routes.events,
    icon: <InsertInvitationIcon color="primary" />,
    hasAccess: () => true,
  },
  {
    translationKey: 'documents',
    icon: <LibraryBooksIcon color="primary" />,
    hasAccess: () => true,
    children: [
      {
        translationKey: 'meetingDocuments',
        path: routes.documents,
        icon: <LibraryBooksIcon color="primary" />,
        hasAccess: () => true,
      },
      {
        translationKey: 'SRD',
        path: routes.srd,
        icon: <SchoolIcon color="primary" />,
        hasAccess: () => true,
      },
      {
        translationKey: 'kravprofiler',
        path: routes.kravprofiler,
        icon: <HowToVoteIcon color="primary" />,
        hasAccess: () => true,
      },
      {
        translationKey: 'policies',
        path: routes.policy,
        icon: <GavelIcon color="primary" />,
        hasAccess: () => true,
      },
    ],
  },
  {
    translationKey: 'guild',
    icon: <DsekIcon color="primary" style={{ fontSize: 20 }} />,
    hasAccess: () => true,
    children: [
      {
        translationKey: 'committees',
        path: routes.committees,
        icon: <Diversity3Icon color="primary" />,
        hasAccess: () => true,
      },
      {
        translationKey: 'mandates',
        path: routes.mandateByYear(DateTime.now().year),
        icon: <PersonIcon color="primary" />,
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
        translationKey: 'songs',
        path: routes.songs,
        icon: <LibraryMusicIcon color="primary" />,
        hasAccess: () => true,
      },
    ],
  },
  {
    translationKey: 'admin',
    icon: <AdminPanelSettingsIcon color="primary" />,
    path: '',
    hasAccess: (apiContext) => hasAccess(apiContext, 'core:access:admin:read') || (!apiContext.apisLoading && !hasAccess(apiContext, 'core:member:create')),
    children: [
      {
        translationKey: 'doors',
        path: routes.doors,
        icon: <MeetingRoomIcon color="primary" />,
        hasAccess: (apiContext) =>
          hasAccess(apiContext, 'core:access:door:create'),
      },
      {
        translationKey: 'editApis',
        path: routes.editApis,
        icon: <AutoFixHighIcon color="primary" />,
        hasAccess: (apiContext) =>
          hasAccess(apiContext, 'core:access:api:create'),
      },
      {
        translationKey: 'mailAlias',
        path: routes.mailAlias,
        icon: <EmailIcon color="primary" />,
        hasAccess: (apiContext) =>
          hasAccess(apiContext, 'core:mail:alias:create'),
      },
      {
        translationKey: 'markdownsAdmin',
        path: routes.markdownsAdmin,
        icon: <FormatColorTextIcon color="primary" />,
        hasAccess: (apiContext) =>
          hasAccess(apiContext, 'markdowns:create'),
      },
      {
        translationKey: 'Super Admin',
        path: '/admin',
        icon: <AdminPanelSettingsIcon color="primary" />,
        hasAccess: (apiContext) =>
          hasAccess(apiContext, 'core:admin') || (!apiContext.apisLoading && !hasAccess(apiContext, 'core:member:create')),
      },
    ],
  },
  {
    translationKey: 'webshop',
    path: routes.webshop,
    icon: <StorefrontIcon color="primary" />,
    hasAccess: (apiContext) =>
      hasAccess(apiContext, 'webshop:read'),
  },
];

const navigationData = {
  items: navigationItems,
};

export default navigationData;
