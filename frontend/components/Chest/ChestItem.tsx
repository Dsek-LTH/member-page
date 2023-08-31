import {
  Stack,
  Paper,
  Avatar,
  Typography,
  Button,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import { MyChestQuery, useConsumeItemMutation } from '~/generated/graphql';
import { useDialog } from '~/providers/DialogProvider';

export default function ChestItem({ item }: {
  item: MyChestQuery['chest']['items'][number]
}) {
  const consumed = !!item.consumedAt;
  const [consumeItemMutation] = useConsumeItemMutation({
    variables: { itemId: item.id },
  });
  const { confirm } = useDialog();
  const { t } = useTranslation();
  return (
    <Paper key={item.id} sx={{ marginBottom: '1rem', width: 'fit-content' }}>
      <Stack direction="row" alignItems="center" spacing={2} padding={2} sx={{ width: 'fit-content' }}>
        <Avatar src={item.imageUrl} />
        <Typography variant="h5">
          {item.name}
          {item.variant ? `: ${item.variant}` : ''}
        </Typography>
        {!consumed && (
        <Button
          onClick={() => {
            confirm(`${t('confirmConsume')} ${item.name}?`, (confirmed) => {
              if (confirmed) {
                consumeItemMutation();
              }
            });
          }}
          variant="contained"
        >
          {t('consume')}
        </Button>
        )}
        {consumed && (
        <Typography>
          {t('consumed')}
          :
          {' '}
          {DateTime.fromISO(item.consumedAt).toLocaleString(DateTime.DATETIME_MED)}
        </Typography>
        )}
      </Stack>
    </Paper>
  );
}
