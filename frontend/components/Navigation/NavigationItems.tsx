import React from 'react';
import { NavigationItem } from "./types/navigationItem";
import EventIcon from '@material-ui/icons/Event';
import FeedIcon from '@material-ui/icons/Feed';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import InventoryIcon from '@material-ui/icons/Inventory';
import EditCalendarIcon from '../Icons/EditCalendarIcon';
import HomeIcon from '@material-ui/icons/Home';

const navigationItems:NavigationItem[] = [
    {
        translationKey: "home",
        path: "/",
        icon:  <HomeIcon color="primary" />,
    },
    {
        translationKey: "document",
        path: "#documents",
        icon:  <LibraryBooksIcon color="primary" />,
        children: [
            {
                translationKey: "statutes",
                path: "#stadgar",
                icon: <LibraryBooksIcon color="primary" />,
            },
            {
                translationKey: "regulations",
                path: "#reglemente",
                icon: <LibraryBooksIcon color="primary" />,
            },
            {
                translationKey: "meetingDocuments",
                path: "#möteshandlingar",
                icon: <LibraryBooksIcon color="primary" />,
            },
        ]
    },
    {
        translationKey: "calendar",
        path: "#calendar",
        icon:  <EventIcon color="primary" />,
    },
    {
        translationKey: "news",
        path: "/news",
        icon:  <FeedIcon color="primary" />,
    },
    {
        translationKey: "booking",
        path: "#bokning",
        icon:  <EditCalendarIcon color="primary" />,
    },
    {
        translationKey: "archive",
        path: "#archive",
        icon: <InventoryIcon color="primary"/>,
        children: [
            {
                translationKey: "pictures",
                path: "#pictures",
                icon: <InventoryIcon color="primary"/>,
            },
            {
                translationKey: "songs",
                path: "#songs",
                icon: <InventoryIcon color="primary"/>,
            },
        ],
    }
];

export default navigationItems;