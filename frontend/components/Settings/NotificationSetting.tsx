import
{
  Collapse,
  Grid, Stack, Switch, Tooltip, Typography,
} from '@mui/material';
import React from 'react';

type Props = {
  title: string;
  description: string;
  onChange: (enabled: boolean, push: boolean) => void;
  isEnabled: boolean;
  isPushEnabled: boolean;
};

// Shows a list item with a toggle switch and a title, which shows description as tooltip.
export default function NotificationSetting({
  title, description, onChange, isEnabled, isPushEnabled,
}: Props) {
  const [isChecked, setIsChecked] = React.useState(isEnabled);
  const [isPushChecked, setIsPushChecked] = React.useState(isPushEnabled);

  return (
    <Stack
      alignItems="stretch"
      paddingBottom={2}
      sx={{
        '&:not(:last-child)': {
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
        },
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="nowrap"
        gap={2}
      >
        <Grid>
          <Tooltip title={description}>
            <Typography>{title}</Typography>
          </Tooltip>
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
      <Collapse in={isChecked}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Stack>
              <Typography sx={{ opacity: 0.6 }}>Receive push notifications</Typography>
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
