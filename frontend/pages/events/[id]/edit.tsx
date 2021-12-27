import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import UserContext from '~/providers/UserProvider';
import EventEditor from '~/components/Calendar/EventEditor';
import { useEventQuery } from '~/generated/graphql';

export default function BookingPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { loading, data: eventQuery } = useEventQuery({
    variables: { id },
  });
  const { t } = useTranslation(['event']);
  const { user } = useContext(UserContext);
  return (
    <>
      <h2>{t('event:edit')}</h2>
      {user && (
        <Box>
          <Paper
            sx={{
              padding: '1em',
            }}
          >
            {!loading && eventQuery && (
              <EventEditor onSubmit={() => { }} eventQuery={eventQuery} />
            )}
          </Paper>
        </Box>
      )}
    </>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'booking',
      'event',
      'news',
    ])),
  },
});
