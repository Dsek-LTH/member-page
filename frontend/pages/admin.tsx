import React, { useState } from 'react';
import {
  Stack, Typography, Container,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LoadingButton } from '@mui/lab';
import NoTitleLayout from '~/components/NoTitleLayout';
import { useSyncMandatesWithKeycloakMutation, useUpdateSearchIndexMutation } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'error'])),
    },
  };
}

export default function Error() {
  const [updateSearchIndex] = useUpdateSearchIndexMutation();
  const [syncMandatesWithKeycloak] = useSyncMandatesWithKeycloakMutation();
  const [loadingUpdateSearchIndex, setLoadingUpdateSearchIndex] = useState(false);
  const [syncingMandates, setSyncingMandates] = useState(false);
  const apiContext = useApiAccess();
  if (!hasAccess(apiContext, 'core:admin')) {
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
        </Stack>
      </Container>
    </NoTitleLayout>
  );
}
