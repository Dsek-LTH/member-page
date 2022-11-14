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
  Button,
} from '@mui/material';
import { DateTime } from 'luxon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { BookingStatus, useGetBookingsQuery } from '~/generated/graphql';
import UserContext from '~/providers/UserProvider';
import BookingList from '~/components/BookingTable';
import BookingForm from '~/components/BookingForm';
import BookingFilter from '~/components/BookingFilter';
import Markdown from '~/components/Markdown';
import routes from '../../routes';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

const yesterday = DateTime.now().minus({ days: 1 });
export default function BookingPage() {
  const { t } = useTranslation(['common', 'booking']);
  const { user } = useContext(UserContext);
  const [to, setTo] = React.useState(DateTime.now().plus({ month: 1 }));
  const apiContext = useApiAccess();
  const [status] = React.useState<BookingStatus>(undefined);

  const { data, loading, refetch } = useGetBookingsQuery({
    variables: {
      from: yesterday,
      to,
      status,
    },
  });

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h2>{t('booking:bookings')}</h2>
        {hasAccess(apiContext, 'booking_request:bookable:read') && (
        <Link href={routes.bookables}>
          <Button>
            {t('booking:view_bookables')}
          </Button>
        </Link>
        )}
      </Box>
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
          />
        </Paper>
        <h2>{t('booking:colorcode')}</h2>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="success" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:accepted_and_ongoing')}
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="info" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:awaiting_decision')}
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="primary" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:accepted')}
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="secondary" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:denied')}
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="error" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:colliding_with_accepted_booking')}
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Badge color="warning" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:colliding_with_nonaccepted_booking')}
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

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'booking'])),
  },
});
