import
{
  Avatar,
  Button,
  Paper, Stack, Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Link from '~/components/Link';
import { timeAgo } from '~/functions/datetimeFunctions';
import { getFullName } from '~/functions/memberFunctions';
import { Ping, usePingMemberMutation } from '~/generated/graphql';
import routes from '~/routes';

type Props = {
  ping: Ping
};

export default function PingCard({ ping }: Props) {
  const { t } = useTranslation('member');
  const member = ping.from;
  const [pingBack] = usePingMemberMutation({
    variables: {
      id: member?.id,
    },
  });
  const [hasPinged, setHasPinged] = useState(false);
  return (
    <Paper sx={{ p: { xs: 1, sm: 2 } }}>
      <Stack direction="row" gap={{ xs: 1, sm: 2 }} justifyContent="space-between" alignItems="flex-start">
        <Stack direction="row" gap={{ xs: 1, sm: 2 }}>
          <Avatar
            src={member?.picture_path}
            sx={{ width: { xs: 32, sm: 48 }, height: { xs: 32, sm: 48 } }}
          />
          <Stack>
            <Typography sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
              <Link href={routes.member(member?.student_id)}>{getFullName(member)}</Link>
              {' '}
              {ping.counter > 1 ? t('hasPingedYou', { count: ping.counter }) : t('pingedYou')}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
              {timeAgo(DateTime.fromISO(ping.lastPing))}
            </Typography>
          </Stack>
        </Stack>
        <Button
          disabled={hasPinged}
          variant="contained"
          onClick={() => {
            setHasPinged(true);
            pingBack();
          }}
          sx={{
            fontSize: { xs: '0.7rem', sm: '1rem' },
            flexShrink: 0,
          }}
        >
          {t('pingBack')}
        </Button>
      </Stack>
    </Paper>
  );
}
