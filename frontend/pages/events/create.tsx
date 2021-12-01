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
} from '@mui/material';
import UserContext from '~/providers/UserProvider';
import EventEditor from '~/components/Calendar/EventEditor';

export default function BookingPage() {
  const { t } = useTranslation(['common', 'event']);
  const { user, loading: userLoading } = useContext(UserContext);
  return (
    <>
      <h2>{t('create_new_event')}</h2>
      {user && (
        <Box>
          <Paper
            sx={{
              padding: '1em',
            }}
          >
            <EventEditor onSubmit={() => {}} />
          </Paper>
        </Box>
      )}
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'booking',
      'event',
      'news',
    ])),
  },
});
