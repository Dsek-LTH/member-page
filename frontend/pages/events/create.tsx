import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Paper,
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import UserContext from '~/providers/UserProvider';
import EventEditor from '~/components/Calendar/EventEditor';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

export default function BookingPage() {
  const { t } = useTranslation(['common', 'event']);
  const { user } = useContext(UserContext);
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const apiContext = useApiAccess();

  if (!keycloak?.authenticated || !user) {
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
