import React from 'react';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ContactPageIcon from '@mui/icons-material/ContactPage';
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
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'; import ApartmentIcon from '@mui/icons-material/Apartment';
import ChecklistIcon from '@mui/icons-material/FormatListNumbered';
import LuggageIcon from '@mui/icons-material/Luggage';
import routes from '~/routes';
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
        translationKey: 'contact',
        path: routes.contactUs,
        icon: <ContactPageIcon color="primary" />,
        hasAccess: () => true,
      },
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
      {
        translationKey: 'webshop',
        path: routes.webshop,
        icon: <StorefrontIcon color="primary" />,
        hasAccess: (apiContext) =>
          hasAccess(apiContext, 'webshop:read'),
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
          hasAccess(apiContext, 'core:access:door:read'),
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
];

const nollningNavigationItems: NavigationItem[] = [
  {
    translationKey: 'home',
    path: routes.nolla.home,
    icon: <HomeIcon color="primary" />,
    hasAccess: () => true,
  },
  {
    translationKey: 'accomodation',
    path: routes.nolla.accomodation,
    icon: <ApartmentIcon color="primary" />,
    hasAccess: () => true,
  },
  {
    translationKey: 'checklist',
    path: routes.nolla.checklist,
    icon: <ChecklistIcon color="primary" />,
    hasAccess: () => true,
  },
  {
    translationKey: 'guild',
    path: routes.nolla.guild,
    icon: <DsekIcon color="primary" />,
    hasAccess: () => true,
  },
  {
    translationKey: 'packinglist',
    path: routes.nolla.packinglist,
    icon: <LuggageIcon color="primary" />,
    hasAccess: () => true,
  },
];

const navigationData = {
  items: navigationItems,
  nollningItems: nollningNavigationItems,
};

export default navigationData;
