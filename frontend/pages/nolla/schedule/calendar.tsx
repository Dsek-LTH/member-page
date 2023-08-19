import { Box, Paper } from '@mui/material';
import Calendar from '~/components/Nolla/Calendar';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';
import { ScheduleToolbar } from '.';

export default function ScheduleCalendar() {
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', gap: 1, mt: -4,
    }}
    >
      <ScheduleToolbar calendar />
      <Paper sx={{ padding: 1 }}>
        <Calendar />
      </Paper>
    </Box>
  );
}

export const getServerSideProps = genGetProps(['nolla', 'event', 'calendar']);

ScheduleCalendar.getLayout = function getLayout({ children }) {
  return <NollaLayout maxWidth="lg">{children}</NollaLayout>;
};

ScheduleCalendar.theme = theme;
