import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useGetMySubscriptionsQuery, useGetSubscriptionTypesQuery, useModifySubscriptionSettingMutation } from '~/generated/graphql';
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

  if (settingsLoading || mySettingsLoading) {
    return <div>Loading...</div>;
  }

  if (!settings || !mySettings
    || !settings.getSubscriptionTypes
    || !mySettings.mySubscriptionSettings) {
    return <div>Error</div>;
  }

  return (
    <Stack gap={2} padding={4} paddingX={6} display="inline-flex">
      <Typography variant="h4">{t('notificationSettings')}</Typography>
      {settings.getSubscriptionTypes.map((setting) => (
        <NotificationSetting
          key={setting.type}
          title={setting.title}
          description={setting.description}
          onChange={(enabled, push) => updateSetting(setting.type, enabled, push)}
          isEnabled={mySettings.mySubscriptionSettings.some(
            (s) => s.type.type === setting.type,
          )}
          isPushEnabled={mySettings.mySubscriptionSettings.some(
            (s) => s.type.type === setting.type && s.pushNotification,
          )}
        />
      ))}
    </Stack>
  );
}
