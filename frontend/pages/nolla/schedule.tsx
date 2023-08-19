import AddIcon from '@mui/icons-material/Add';
import {
  Alert, Box, Button, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Link from '~/components/Link';
import Events from '~/components/Nolla/Events';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';

export default function Schedule() {
  const apiContext = useApiAccess();
  const router = useRouter();

  // restrict access during development
  useEffect(() => {
    if (!apiContext.apisLoading && !apiContext.hasAccess('nolla:events')) {
      router.push(routes.root);
    }
  }, [apiContext, router]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Alert severity="warning">
        <Typography>This page is under construction!</Typography>
      </Alert>
      {apiContext.hasAccess('event:create') && (
      <Link href={routes.createEvent}>
        <Button variant="outlined">
          Create Event
          <AddIcon style={{ marginLeft: '0.25rem' }} />
        </Button>
      </Link>
      )}
      <Events />
    </Box>
  );
}

export const getServerSideProps = genGetProps(['nolla', 'event']);

Schedule.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

Schedule.theme = theme;
