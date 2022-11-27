import { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import SearchInput from '../Header/SearchInput';
import NavigationListStyles from './styles/NavigationListStyles';
import ListItemSet from './ListItemSet';
import routes from '~/routes';
import { useUser } from '~/providers/UserProvider';

type NavigationListProps = {
  className?: string;
};

export default function NavigationList({ className }: NavigationListProps) {
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up('md'));
  const classes = NavigationListStyles();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [router.asPath]);

  if (large) {
    return (
      <Paper>
        <ListItemSet className={className} />
      </Paper>
    );
  }

  return (
    <Accordion expanded={expanded} onChange={(_, value) => setExpanded(value)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classes.menuBar}
      >
        <Typography>{t('menu')}</Typography>
      </AccordionSummary>

      <AccordionDetails className={classes.menuDetails}>
        <ListItemSet className={className} />
      </AccordionDetails>
      {user && (
      <Box margin="1rem" marginTop="0">
        <SearchInput onSelect={(studentId) => {
          router.push(routes.member(studentId));
        }}
        />
      </Box>
      )}
    </Accordion>
  );
}
