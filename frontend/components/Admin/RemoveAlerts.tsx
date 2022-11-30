import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';
import { useAlertsQuery, useRemoveAlertMutation } from '~/generated/graphql';

export default function RemoveAlert() {
  const { data, refetch } = useAlertsQuery();
  const [removeAlert, { loading }] = useRemoveAlertMutation();
  return (
    <Stack spacing={1}>
      <Typography>Remove alerts:</Typography>
      {data?.alerts.map((alert) => (
        <LoadingButton
          loading={loading}
          variant="contained"
          onClick={() => {
            removeAlert({ variables: { id: alert.id } }).then(() => refetch());
          }}
          color="error"
          key={alert.id}
        >
          {alert.message}

        </LoadingButton>
      ))}
    </Stack>
  );
}
