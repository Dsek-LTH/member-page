import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useCreateInventoryMutation, useProductQuery } from '~/generated/graphql';
import ManageInventoryItem from './ManageInventoryItem';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';

export default function ManageProductInventory({
  id,
}: {
  id: string
}) {
  const { data, refetch } = useProductQuery({
    variables: {
      id,
    },
  });
  const inventory = data?.product?.inventory;
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const [createInventory] = useCreateInventoryMutation({
    variables: {
      input: {
        productId: id,
        quantity: 0,
      },
    },
    onCompleted: async () => {
      await refetch();
      showMessage('Product inventory added', 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'Error creating product');
    },
  });
  return (
    <Stack spacing={2}>
      <Button
        style={{
          width: 'fit-content',
        }}
        variant="contained"
        onClick={() => {
          createInventory();
        }}
      >
        Add inventory variant
      </Button>
      {
        inventory?.length === 0
        && <Typography>There is no inventory information about this product</Typography>
      }
      <Stack direction="row" spacing={2}>
        {
        inventory?.map((inventoryItem) => (
          <ManageInventoryItem key={inventoryItem.id} inventoryItem={inventoryItem} />
        ))
        }
      </Stack>
    </Stack>
  );
}
