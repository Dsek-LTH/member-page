import { Box, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useTranslation } from 'next-i18next';
import
{
  useGetMySubscriptionsQuery,
  useGetSubscriptionTypesQuery,
  useModifySubscriptionSettingMutation,
} from '~/generated/graphql';
import NotificationSetting from './NotificationSetting';

export default function NotificationSettings() {
  const { data: settings, loading: settingsLoading } = useGetSubscriptionTypesQuery();
  const { data: mySettings, loading: mySettingsLoading } = useGetMySubscriptionsQuery();
  const [mutation] = useModifySubscriptionSettingMutation();
  const updateSetting = (type: string, enabled: boolean, push: boolean) => {
    mutation({
      variables: {
        type,
        enabled,
        pushNotification: push,
      },
    });
  };
  const { t } = useTranslation();

  if (settingsLoading || mySettingsLoading) {
    return <Stack gap={2} padding={4} paddingX={6} />;
  }

  if (!settings || !mySettings
    || !settings.getSubscriptionTypes
    || !mySettings.mySubscriptionSettings) {
    return <div>An error occured</div>;
  }

  return (
    <Stack
      gap={2}
      padding={4}
      sx={{
        px: {
          xs: 4,
          md: 6,
        },
      }}
    >
      <Typography variant="h5">{t('notificationSettings')}</Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
        columnGap: 2,
      }}
      >
        {settings.getSubscriptionTypes.filter((s) => s.type !== 'NEW_ARTICLE').map((setting) => (
          <NotificationSetting
            key={setting.type}
            setting={setting}
            onChange={(enabled, push) => updateSetting(setting.type, enabled, push)}
            isEnabled={mySettings.mySubscriptionSettings.some(
              (s) => s.type.type === setting.type,
            )}
            isPushEnabled={mySettings.mySubscriptionSettings.some(
              (s) => s.type.type === setting.type && s.pushNotification,
            )}
          />
        ))}

      </Box>
    </Stack>
  );
}
