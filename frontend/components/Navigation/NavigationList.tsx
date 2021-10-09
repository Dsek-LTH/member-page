import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemSet from './ListItemSet';
import { useTheme } from '@mui/material/styles';
import { NavigationListStyles } from './styles/NavigationListStyles';
import Paper from '@mui/material/Paper';
import navigationItems from './NavigationItems';

type NavigationListProps = {
  className?: string;
};

export default function NavigationList({ className }: NavigationListProps) {
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up('md'));
  const classes = NavigationListStyles();

  if (large) {
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
        <Typography>Meny</Typography>
      </AccordionSummary>

      <AccordionDetails className={classes.menuDetails}>
        <ListItemSet className={className} items={navigationItems} />
      </AccordionDetails>
    </Accordion>
  );
}
