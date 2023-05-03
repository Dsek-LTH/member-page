import { Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useTranslation } from 'next-i18next';
import TagBlacklister from '~/components/Settings/TagBlacklister';
import
{
  useGetSubscriptionTypesQuery,
} from '~/generated/graphql';

export default function SubscriptionSettings() {
  const { data: allSettings, loading: settingsLoading } = useGetSubscriptionTypesQuery();

  const { t } = useTranslation();

  if (settingsLoading) {
    return <Stack gap={2} padding={4} paddingX={6} />;
  }

  if (!allSettings?.getSubscriptionTypes) {
    return <div>An error occured</div>;
  }
  return (
    <Stack gap={2} padding={4} paddingX={6}>
      <Tooltip title={t('tagBlacklistsDescription')}>
        <Typography variant="h5">{t('tagBlacklists')}</Typography>
      </Tooltip>
      <TagBlacklister />
    </Stack>
  );
}
