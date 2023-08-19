import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  Box,
  Button,
  Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import Link from '~/components/Link';
import Events from '~/components/Nolla/Events';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';

export function ScheduleToolbar({ calendar }: { calendar: boolean }) {
  const apiContext = useApiAccess();
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
      {apiContext.hasAccess('event:create') && (
      <Link href={routes.createEvent}>
        <Button variant="outlined">
          Create Event
          <AddIcon style={{ marginLeft: '0.25rem' }} />
        </Button>
      </Link>
      )}

      <Button
        color={calendar ? 'inherit' : 'primary'}
        startIcon={<ViewListIcon />}
        onClick={() => router.push(routes.nolla.schedule)}
      >
        {t('events_list')}
      </Button>
      <Button
        color={calendar ? 'primary' : 'inherit'}
        startIcon={<CalendarMonthIcon />}
        onClick={() => router.push(routes.nolla.calendar)}
      >
        {t('calendar')}
      </Button>
    </Stack>
  );
}

export default function Schedule() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <ScheduleToolbar calendar={false} />
      <Events />
    </Box>
  );
}

export const getServerSideProps = genGetProps(['nolla', 'event']);

Schedule.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

Schedule.theme = theme;
