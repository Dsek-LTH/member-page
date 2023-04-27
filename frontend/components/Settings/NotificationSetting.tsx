import
{
  Collapse,
  Grid, Stack, Switch, Tooltip, Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'next-i18next';
import selectTranslation from '~/functions/selectTranslation';
import { SubscriptionType } from '~/generated/graphql';

type Props = {
  setting: SubscriptionType
  onChange: (enabled: boolean, push: boolean) => void;
  isEnabled: boolean;
  isPushEnabled: boolean;
  noLine?: boolean;
};

// Shows a list item with a toggle switch and a title, which shows description as tooltip.
export default function NotificationSetting({
  setting, onChange, isEnabled, isPushEnabled, noLine,
}: Props) {
  const [isChecked, setIsChecked] = React.useState(isEnabled);
  const [isPushChecked, setIsPushChecked] = React.useState(isPushEnabled);
  const { t, i18n } = useTranslation();

  return (
    <Stack
      alignItems="stretch"
      paddingBottom={2}
      sx={{
        '&:not(:last-child)': {
          borderBottomWidth: noLine ? 0 : 1,
          borderBottomStyle: 'solid',
        },
      }}
    >
      <Tooltip title={selectTranslation(i18n, setting.description, setting.descriptionEn)}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="nowrap"
          gap={2}
        >
          <Grid>
            <Typography>{selectTranslation(i18n, setting.title, setting.titleEn)}</Typography>
          </Grid>
          <Grid item>
            <Switch
              checked={isChecked}
              onChange={(e, checked) => {
                setIsChecked(checked);
                setIsPushChecked(checked);
                onChange(checked, true);
              }}
            />
          </Grid>
        </Grid>
      </Tooltip>
      <Collapse in={isChecked}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Stack>
              <Typography sx={{ opacity: 0.6 }}>{t('receivePush')}</Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Switch
              checked={isPushChecked}
              onChange={(e, checked) => {
                onChange(isChecked, checked);
                setIsPushChecked(checked);
              }}
            />
          </Grid>
        </Grid>
      </Collapse>
    </Stack>
  );
}
