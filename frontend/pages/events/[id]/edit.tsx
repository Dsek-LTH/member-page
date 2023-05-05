import { Box, Paper } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import EventEditor from '~/components/Calendar/EventEditor';
import genGetProps from '~/functions/genGetServerSideProps';
import { useEventQuery } from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';
import UserContext from '~/providers/UserProvider';

export default function BookingPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { loading, data: eventQuery } = useEventQuery({
    variables: { id },
  });
  const { t } = useTranslation(['event']);
  useSetPageName(t('event:edit'));
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

export const getServerSideProps = genGetProps([
  'booking',
  'event',
  'news',
]);
