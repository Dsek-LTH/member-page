import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper,
  Typography,
  Stack,
  Badge,
} from '@mui/material';
import { DateTime } from 'luxon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BookingStatus, useGetBookingsQuery } from '~/generated/graphql';
import UserContext from '~/providers/UserProvider';
import BookingList from '~/components/BookingTable';
import BookingForm from '~/components/BookingForm';
import BookingFilter from '~/components/BookingFilter';
import Markdown from '~/components/Markdown';

export default function BookingPage() {
  const { t } = useTranslation(['common', 'booking']);
  const { user } = useContext(UserContext);
  const [to, setTo] = React.useState(DateTime.now().plus({ month: 1 }));
  const [status] = React.useState<BookingStatus>(undefined);

  const { data, loading, refetch } = useGetBookingsQuery({
    variables: {
      from: '2022-10-05',
      to,
      status,
    },
  });

  return (
    <>
      <h2>{t('booking:bookings')}</h2>
      <Stack spacing={2}>
        <Markdown name="booking" />
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{t('booking:filter')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <BookingFilter to={to} onToChange={setTo} />
          </AccordionDetails>
        </Accordion>
        <Paper>
          <BookingList
            data={data}
            refetch={refetch}
            loading={loading}
            user={user}
          />
        </Paper>
        <h2>Färgkodning:</h2>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="success" variant="dot" style={{ marginRight: '1rem' }} />
          Accepterad && pågår just nu
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="info" variant="dot" style={{ marginRight: '1rem' }} />
          Inväntar beslut
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="primary" variant="dot" style={{ marginRight: '1rem' }} />
          Accepterad
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="secondary" variant="dot" style={{ marginRight: '1rem' }} />
          Nekad
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="error" variant="dot" style={{ marginRight: '1rem' }} />
          Kolliderar med accepterad bokning
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="warning" variant="dot" style={{ marginRight: '1rem' }} />
          Kolliderar med ej accepterad bokning
        </div>
      </Stack>
      {user && (
        <Box>
          <h2>{t('booking:book')}</h2>
          <Paper
            sx={{
              padding: '1em',
            }}
          >
            <BookingForm onSubmit={refetch} />
          </Paper>
        </Box>
      )}
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'booking'])),
  },
});
