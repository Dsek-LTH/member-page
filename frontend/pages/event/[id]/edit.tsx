import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '~/layouts/defaultLayout';
import { Box, Paper } from '@mui/material';
import UserContext from '~/providers/UserProvider';
import EventEditor from '~/components/Calendar/EventEditor';
import { useEventQuery } from '~/generated/graphql';
import { useRouter } from 'next/router';

export default function BookingPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { loading, data: eventQuery } = useEventQuery({
    variables: { id: parseInt(id) ? parseInt(id) : 0 },
  });
  const { t } = useTranslation(['event']);
  const { user, loading: userLoading } = useContext(UserContext);
  return (
    <DefaultLayout>
      <h2>{t('event:create_new')}</h2>
      {user && (
        <Box>
          <Paper
            sx={{
              padding: '1em',
            }}
          >
            {!loading && eventQuery && (
              <EventEditor onSubmit={() => {}} eventQuery={eventQuery} />
            )}
          </Paper>
        </Box>
      )}
    </DefaultLayout>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'booking', 'event'])),
  },
});
