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
        text: "Hem",
        path: "/",
        icon:  <HomeIcon color="primary" />,
    },
    {
        text: "Dokument",
        path: "#documents",
        icon:  <LibraryBooksIcon color="primary" />,
        children: [
            {
                text: "Stadgar",
                path: "#stadgar",
                icon: <LibraryBooksIcon color="primary" />,
            },
            {
                text: "Reglemente",
                path: "#reglemente",
                icon: <LibraryBooksIcon color="primary" />,
            },
            {
                text: "Möteshandlingar",
                path: "#möteshandlingar",
                icon: <LibraryBooksIcon color="primary" />,
            },
        ]
    },
    {
        text: "Kalender",
        path: "#calendar",
        icon:  <EventIcon color="primary" />,
    },
    {
        text: "Nyheter",
        path: "/news",
        icon:  <FeedIcon color="primary" />,
    },
    {
        text: "Bokning",
        path: "#bokning",
        icon:  <EditCalendarIcon color="primary" />,
    },
    {
        text: "Arkiv",
        path: "#archive",
        icon: <InventoryIcon color="primary"/>,
        children: [
            {
                text: "Bilder",
                path: "#pictures",
                icon: <InventoryIcon color="primary"/>,
            },
            {
                text: "Sånger",
                path: "#songs",
                icon: <InventoryIcon color="primary"/>,
            },
        ],
    }
];

export default navigationItems;