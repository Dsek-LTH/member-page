import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Link from '~/components/Link';
import Events from '~/components/Nolla/Events';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import copyTextToClipboard from '~/functions/copyTextToClipboard';
import genGetProps from '~/functions/genGetServerSideProps';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';

export function ScheduleToolbar({ calendar }: { calendar: boolean }) {
  const apiContext = useApiAccess();
  const router = useRouter();
  const { t, i18n } = useTranslation(['common', 'calendar']);
  const subscribeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${routes.nolla.calendarDownload(
      i18n.language,
    )}`
    : '';
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        justifyContent="space-between"
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            color={calendar ? 'inherit' : 'primary'}
            startIcon={<ViewListIcon />}
            onClick={() => router.push(routes.nolla.schedule)}
          >
            {t('common:events_list')}
          </Button>
          <Button
            color={calendar ? 'primary' : 'inherit'}
            startIcon={<CalendarMonthIcon />}
            onClick={() => router.push(routes.nolla.calendar)}
          >
            {t('common:calendar')}
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" onClick={() => setDialogOpen(true)}>
            {t('common:subscribe')}
          </Button>

          {apiContext.hasAccess('event:create') && (
            <Link href={routes.createEvent} style={{ display: 'contents' }}>
              <Button variant="outlined">
                Create Event
                <AddIcon style={{ marginLeft: '0.25rem' }} />
              </Button>
            </Link>
          )}
        </Stack>
      </Stack>
      <Dialog
        disableScrollLock
        open={dialogOpen}
        PaperProps={{ sx: { p: 2 } }}
        onClick={() => setDialogOpen(false)}
      >
        <Typography paddingBottom="0.5rem">
          {t('calendar:copyAndPasteToCalendarProgram')}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField value={subscribeUrl} fullWidth />
          <div>
            <IconButton onClick={() => copyTextToClipboard(subscribeUrl)}>
              <ContentCopyIcon />
            </IconButton>
          </div>
        </Stack>
      </Dialog>
    </>
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

export const getServerSideProps = genGetProps(['nolla', 'event', 'calendar']);

Schedule.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

Schedule.theme = theme;
