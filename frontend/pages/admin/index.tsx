import { LoadingButton } from '@mui/lab';
import { Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import CreateAlert from '~/components/Admin/CreateAlert';
import RemoveAlert from '~/components/Admin/RemoveAlerts';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import handleApolloError from '~/functions/handleApolloError';
import { useSeedDatabaseMutation, useSyncMandatesWithKeycloakMutation, useUpdateSearchIndexMutation } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';

export const getStaticProps = genGetProps(['error']);

export default function Error() {
  useSetPageName('Admin');
  const [updateSearchIndex] = useUpdateSearchIndexMutation();
  const [syncMandatesWithKeycloak] = useSyncMandatesWithKeycloakMutation();
  const [seedDatabase] = useSeedDatabaseMutation();
  const { showMessage } = useSnackbar();
  const { t } = useTranslation();
  const [loadingUpdateSearchIndex, setLoadingUpdateSearchIndex] = useState(false);
  const [syncingMandates, setSyncingMandates] = useState(false);
  const [seedingDatabase, setSeedingDatabase] = useState(false);
  const { hasAccess } = useApiAccess();
  if (!hasAccess('core:admin') && hasAccess('core:member:create')) {
    return <NoTitleLayout>This is a page for admins only. Get out</NoTitleLayout>;
  }
  return (
    <NoTitleLayout>
      <Container maxWidth="md">
        <Stack
          spacing={4}
          direction="column"
          height="100%"
          alignItems="flex-start"
        >
          <Typography variant="h2" component="h1">
            Admin
          </Typography>
          <LoadingButton
            variant="contained"
            loading={loadingUpdateSearchIndex}
            onClick={() => {
              setLoadingUpdateSearchIndex(true);
              updateSearchIndex().then(() => {
                setLoadingUpdateSearchIndex(false);
              });
            }}
          >
            Update search index
          </LoadingButton>
          <LoadingButton
            variant="contained"
            loading={syncingMandates}
            onClick={() => {
              setSyncingMandates(true);
              syncMandatesWithKeycloak().then(() => {
                setSyncingMandates(false);
              });
            }}
          >
            Sync mandates with keycloak
          </LoadingButton>
          <LoadingButton
            variant="contained"
            loading={seedingDatabase}
            onClick={() => {
              setSeedingDatabase(true);
              seedDatabase()
                .catch((e) => {
                  handleApolloError(e, showMessage, t);
                })
                .finally(() => {
                  setSeedingDatabase(false);
                });
            }}
          >
            Seed database
          </LoadingButton>
          {hasAccess('alert') && (
            <>
              <CreateAlert />
              <RemoveAlert />
            </>
          )}
        </Stack>
      </Container>
    </NoTitleLayout>
  );
}
