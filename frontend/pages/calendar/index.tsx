import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Grid, Paper, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, TextField, Box, Stack } from '@mui/material';
import { calendarPageStyles } from '~/styles/calendarPageStyles';
import BigCalendar from '~/components/Calendar/BigCalendar';
import { useEventsQuery, useGetBookingsQuery } from '~/generated/graphql';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import routes from '~/routes';
import copyTextToClipboard from '~/functions/copyTextToClipboard';

export default function CalendarPage() {
  const { data: eventsData, loading: eventsLoading } = useEventsQuery();
  const { data: bookingsData, loading: bookingsLoading } =
    useGetBookingsQuery();
  const classes = calendarPageStyles();
  const { t, i18n } = useTranslation('common');
  const subscribeUrl = typeof window !== "undefined" ? `${window.location.origin}${routes.calendarDownload(i18n.language)}` : "";

  return (
    <>
      <Grid
        container
        spacing={3}
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <h2>{t('calendar')}</h2>
          <Paper style={{ padding: '0.5rem' }}>
            <BigCalendar
              events={eventsData?.events?.events}
              bookings={bookingsData?.bookingRequests}
            />
          </Paper>

          <Accordion sx={{ marginTop: '1em' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <Typography>{t('subscribe')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {t('calendar:copyAndPasteToCalendarProgram')}
              </Typography>
              <Stack direction="row">
                <TextField
                  value={subscribeUrl}
                  fullWidth
                />
                <IconButton onClick={() => copyTextToClipboard(subscribeUrl)}>
                  <ContentCopyIcon />
                </IconButton>
              </Stack>
            </AccordionDetails>
          </Accordion>

        </Grid>
      </Grid>
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'event',
      'booking',
      'calendar',
    ])),
  },
});
