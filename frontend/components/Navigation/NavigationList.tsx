import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListItemSet from './ListItemSet';
import { useTheme } from '@material-ui/core/styles';
import { NavigationListStyles } from './styles/NavigationListStyles';
import Paper from '@material-ui/core/Paper';
import navigationItems from './NavigationItems';
import { useTranslation } from 'next-i18next';

type NavigationListProps = {
    className?: string
}

export default function NavigationList({ className }: NavigationListProps) {
    const theme = useTheme();
    const large = useMediaQuery(theme.breakpoints.up('lg'));
    const classes = NavigationListStyles();

    const { t, i18n } = useTranslation('common');

    if (large){
        return (
            <Paper>
                <ListItemSet className={className} items={navigationItems} />
            </Paper>
        );
    }

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className={classes.menuBar}
            >
                <Typography>{ t('menu') }</Typography>
            </AccordionSummary>

            <AccordionDetails className={classes.menuDetails}>
                <ListItemSet className={className} items={navigationItems} />
            </AccordionDetails>
        </Accordion>
    );
}