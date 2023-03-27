import
{
  Box,
  Paper,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';
import EventEditor from '~/components/Calendar/EventEditor';
import genGetProps from '~/functions/genGetServerSideProps';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import UserContext from '~/providers/UserProvider';

export default function BookingPage() {
  const { t } = useTranslation(['common', 'event']);
  const { user } = useContext(UserContext);
  const apiContext = useApiAccess();

  if (!user) {
    return <>{t('notAuthenticated')}</>;
  }

  if (!hasAccess(apiContext, 'event:create')) {
    return (
      <>
        {t('no_permission_page')}
      </>
    );
  }

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
            <EventEditor onSubmit={() => { }} />
          </Paper>
        </Box>
      )}
    </>
  );
}

export const getStaticProps = genGetProps([
  'booking',
  'event',
  'news',
]);
