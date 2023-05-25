import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import
{
  Accordion, AccordionDetails, AccordionSummary, Badge, Box, Button, Paper, Stack, Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import BookingForm from '~/components/BookingForm';
import BookingList from '~/components/BookingTable';
import DateTimePicker from '~/components/DateTimePicker';
import MarkdownPage from '~/components/MarkdownPage';
import genGetProps from '~/functions/genGetServerSideProps';
import { BookingStatus, useGetBookingsQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import UserContext from '~/providers/UserProvider';
import routes from '../../routes';
import PageHeader from '~/components/PageHeader';

const YESTERDAY = DateTime.now().minus({ days: 1 });
const NEXT_MONTH = DateTime.now().plus({ month: 1 });

export default function BookingPage() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'booking']);
  useSetPageName(t('booking:bookings'));
  const { user } = useContext(UserContext);
  const [from, setFrom] = React.useState(null);
  const [to, setTo] = React.useState(null);
  const apiContext = useApiAccess();
  const [status] = React.useState<BookingStatus>(undefined);

  React.useEffect(() => {
    const initialEndDate = router.query.endDate
      ? DateTime.fromMillis(parseInt(Array.isArray(router.query.endDate)
        ? router.query.endDate[0]
        : router.query.endDate, 10))
      : undefined;
    setFrom(YESTERDAY);
    setTo((initialEndDate && initialEndDate.isValid)
      ? initialEndDate : NEXT_MONTH);
  }, [router.query.endDate]);

  const { data, loading, refetch } = useGetBookingsQuery({
    variables: {
      from,
      to,
      status,
    },
  });

  return (
    <Stack gap={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <PageHeader noMargin>{t('booking:bookings')}</PageHeader>
        {hasAccess(apiContext, 'booking_request:bookable:read') && (
          <Link href={routes.bookables} passHref>
            <Button>
              {t('booking:view_bookables')}
            </Button>
          </Link>
        )}
      </Box>
      <MarkdownPage name="booking" />
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{t('booking:filter')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" gap={2} flexWrap="wrap">
            <Box sx={{ flex: 1, flexBasis: 0, minWidth: 240 }}>
              <DateTimePicker
                value={from}
                onChange={setFrom}
                label={t('booking:startTime')}
              />
            </Box>
            <Box sx={{ flex: 1, flexBasis: 0, minWidth: 240 }}>
              <DateTimePicker
                value={to}
                onChange={setTo}
                label={t('booking:endTime')}
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Paper>
        <BookingList
          data={data}
          refetch={refetch}
          loading={loading}
        />
      </Paper>
      <PageHeader>{t('booking:colorcode')}</PageHeader>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(400px, 100%), 1fr))',
        gap: 1,
      }}
      >
        <Box>
          <Badge color="success" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:accepted_and_ongoing')}
        </Box>
        <Box>
          <Badge color="info" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:awaiting_decision')}
        </Box>
        <Box>
          <Badge color="primary" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:accepted')}
        </Box>
        <Box>
          <Badge color="secondary" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:denied')}
        </Box>
        <Box>
          <Badge color="error" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:colliding_with_accepted_booking')}
        </Box>
        <Box>
          <Badge color="warning" variant="dot" style={{ marginRight: '1rem' }} />
          {t('booking:colliding_with_nonaccepted_booking')}
        </Box>

      </Box>
      {user && (
        <>
          <PageHeader>{t('booking:book')}</PageHeader>
          <Paper
            sx={{
              padding: '1em',
            }}
          >
            <BookingForm onSubmit={refetch} />
          </Paper>
        </>
      )}
    </Stack>
  );
}

export const getStaticProps = genGetProps(['booking']);
