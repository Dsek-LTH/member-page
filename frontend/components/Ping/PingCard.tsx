import
{
  Avatar,
  Box,
  Paper, Stack, Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Link from '~/components/Link';
import LoadingButton from '~/components/LoadingButton';
import { timeAgo } from '~/functions/datetimeFunctions';
import { getFullName } from '~/functions/memberFunctions';
import { Ping, useNotificationsQuery, usePingMemberMutation } from '~/generated/graphql';
import routes from '~/routes';

type Props = {
  ping: Ping
};

export default function PingCard({ ping }: Props) {
  const { t } = useTranslation('member');
  const member = ping.from;
  const { refetch: refetchNotifications } = useNotificationsQuery({
    skip: true, // we don't want to actually fetch, just refetch
  });
  const [pingBack] = usePingMemberMutation({
    variables: {
      id: member?.id,
    },
  });
  const [hasPinged, setHasPinged] = useState(false);
  const pingButton = (
    <LoadingButton
      disabled={hasPinged}
      variant="contained"
      onClick={async () => {
        setHasPinged(true);
        await pingBack();
        refetchNotifications();
      }}
      sx={{
        fontSize: { xs: '0.8rem', sm: '1rem' },
        flexShrink: 0,
      }}
    >
      {t('pingBack')}
    </LoadingButton>
  );
  return (
    <Paper sx={{ p: { xs: 1, sm: 2 } }}>
      <Stack direction="row" gap={{ xs: 1, sm: 2 }} alignItems="flex-start" justifyContent="space-between">
        <Stack direction="row" gap={{ xs: 1, sm: 2 }} alignItems="flex-start" flexGrow={1}>
          <Avatar
            src={member?.picture_path}
            sx={{ width: 48, height: 48 }}
          />
          <Stack flexGrow={1}>
            <Typography>
              <Link href={routes.member(member?.student_id)}>{getFullName(member)}</Link>
              {' '}
              {ping.counter > 1 ? t('hasPingedYou', { count: ping.counter }) : t('pingedYou')}
            </Typography>
            <Stack direction="row" gap={{ xs: 1, sm: 2 }} justifyContent="space-between">
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                {timeAgo(DateTime.fromISO(ping.lastPing))}
              </Typography>
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>{pingButton}</Box>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
