import { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import SearchInput from '../Header/SearchInput';
import NavigationListStyles from './styles/NavigationListStyles';
import ListItemSet from './ListItemSet';
import routes from '~/routes';
import { useUser } from '~/providers/UserProvider';

type NavigationListProps = {
  className?: string;
};

const MobileOnly = styled('div')`
  display: none;
  @media (max-width: 959px) {
    display: block;
  }
`;

const DesktopOnly = styled('div')`
  display: block;
  @media (max-width: 959px) {
    display: none;
  }
`;

export default function NavigationList({ className }: NavigationListProps) {
  const classes = NavigationListStyles();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setExpanded(false);
  }, [router.asPath]);

  return (
    <>
      <DesktopOnly>
        <Paper>
          <ListItemSet className={className} />
        </Paper>
      </DesktopOnly>
      <MobileOnly>
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
      </MobileOnly>
    </>
  );
}
