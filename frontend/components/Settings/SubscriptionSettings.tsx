import { Collapse, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import TagSubscriber from '~/components/Settings/TagSubscriber';
import
{
  useGetMySubscriptionsQuery, useGetSubscriptionTypesQuery,
  useModifySubscriptionSettingMutation,
} from '~/generated/graphql';
import NotificationSetting from './NotificationSetting';

export default function SubscriptionSettings() {
  const { data: allSettings, loading: settingsLoading } = useGetSubscriptionTypesQuery();
  const { data: mySettings, loading: mySettingsLoading } = useGetMySubscriptionsQuery();

  const [wantsNotifications, setWantsNotifications] = useState(false);

  const { t } = useTranslation();
  const [mutation] = useModifySubscriptionSettingMutation();
  const updateSetting = (type: string, enabled: boolean, push: boolean) => {
    mutation({
      variables: {
        type,
        enabled,
        pushNotification: push,
      },
    });
    setWantsNotifications(enabled);
  };
  const subscriptionSetting = allSettings?.getSubscriptionTypes.find((setting) => setting.type === 'NEW_ARTICLE');

  useEffect(() => {
    setWantsNotifications(mySettings?.mySubscriptionSettings.some(
      (s) => s.type.type === subscriptionSetting.type,
    ) ?? false);
  }, [mySettings?.mySubscriptionSettings, subscriptionSetting]);

  if (settingsLoading || mySettingsLoading) {
    return <Stack gap={2} padding={4} paddingX={6} />;
  }

  if (!allSettings?.getSubscriptionTypes
    || !mySettings?.mySubscriptionSettings) {
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
      <Typography variant="h5">{t('newsSubscriptions')}</Typography>
      <NotificationSetting
        key={subscriptionSetting.type}
        setting={subscriptionSetting}
        onChange={(enabled, push) => updateSetting(subscriptionSetting.type, enabled, push)}
        isEnabled={mySettings?.mySubscriptionSettings.some(
          (s) => s?.type?.type === subscriptionSetting?.type,
        )}
        isPushEnabled={mySettings.mySubscriptionSettings.some(
          (s) => s?.type?.type === subscriptionSetting?.type && s?.pushNotification,
        )}
        noLine
      />
      <Collapse in={wantsNotifications}>
        <TagSubscriber />
      </Collapse>
    </Stack>
  );
}
