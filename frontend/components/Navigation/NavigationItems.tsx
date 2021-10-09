import React from 'react';
import { NavigationItem } from "./types/navigationItem";
import EventIcon from '@material-ui/icons/Event';
import FeedIcon from '@material-ui/icons/Feed';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import InventoryIcon from '@material-ui/icons/Inventory';
import EditCalendarIcon from '../Icons/EditCalendarIcon';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import routes from '~/routes';
import DsekIcon from '../Icons/DsekIcon';

const navigationItems:NavigationItem[] = [
    {
        translationKey: "home",
        path: routes.root,
        icon:  <HomeIcon color="primary" />,
    },
    {
        translationKey: "D-sek",
        path: routes.dsek,
        icon:  <DsekIcon color='primary'style={{ fontSize: 24 }}/>,
        children: [
            {
                translationKey: "Mandates",
                path: routes.mandates,
                icon: <PeopleIcon color="primary" />,
            },
        ]
    },
    {
        translationKey: "documents",
        path: routes.documents,
        icon:  <LibraryBooksIcon color="primary" />,
        children: [
            {
                translationKey: "statutes",
                path: routes.statues,
                icon: <LibraryBooksIcon color="primary" />,
            },
            {
                translationKey: "regulations",
                path: routes.regulations,
                icon: <LibraryBooksIcon color="primary" />,
            },
            {
                translationKey: "meetingDocuments",
                path: routes.meetingDocuments,
                icon: <LibraryBooksIcon color="primary" />,
            },
        ]
    },
    {
        translationKey: "calendar",
        path: routes.calendar,
        icon:  <EventIcon color="primary" />,
    },
    {
        translationKey: "news",
        path: routes.news,
        icon:  <FeedIcon color="primary" />,
    },
    {
        translationKey: "booking",
        path: routes.booking,
        icon:  <EditCalendarIcon color="primary" />,
    },
    {
        translationKey: "archive",
        path: routes.archive,
        icon: <InventoryIcon color="primary"/>,
        children: [
            {
                translationKey: "pictures",
                path: routes.pictures,
                icon: <InventoryIcon color="primary"/>,
            },
            {
                translationKey: "songs",
                path: routes.songs,
                icon: <InventoryIcon color="primary"/>,
            },
        ],
    }
];

export default navigationItems;