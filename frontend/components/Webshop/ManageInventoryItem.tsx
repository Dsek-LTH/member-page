import { Button, Stack, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import handleApolloError from '~/functions/handleApolloError';
import { ProductQuery, useDeleteInventoryMutation, useUpdateInventoryMutation } from '~/generated/graphql';
import { useDialog } from '~/providers/DialogProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';

export default function ManageInventoryItem({
  inventoryItem,
  refetch,
}: {
  inventoryItem: ProductQuery['product']['inventory'][number]
  refetch: () => Promise<any>
}) {
  const [variant, setVariant] = useState(inventoryItem.variant);
  const [quantity, setQuantity] = useState(inventoryItem.quantity.toString());
  const { t } = useTranslation();
  const { confirm } = useDialog();
  const { showMessage } = useSnackbar();
  const [updateInventory] = useUpdateInventoryMutation({
    onCompleted: () => {
      showMessage('Product inventory updated', 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'Error creating product');
    },
  });

  const [deleteInventory] = useDeleteInventoryMutation({
    onCompleted: async () => {
      await refetch();
      showMessage('Product inventory deleted', 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'Error deleting product inventory');
    },
  });
  return (
    <Stack spacing={2}>
      <TextField
        label="Variant (not required, used for things like clothing size)"
        value={variant}
        onChange={(e) => {
          setVariant(e.target.value);
        }}
      />
      <TextField
        label="Quantity"
        value={quantity}
        onChange={(e) => {
          setQuantity(e.target.value);
        }}
      />
      <Stack direction="row" spacing={1}>
        <Button
          style={{
            width: 'fit-content',
          }}
          disabled={Number.isNaN(Number(quantity))}
          onClick={() => {
            updateInventory({
              variables: {
                input: {
                  inventoryId: inventoryItem.id,
                  quantity: !Number.isNaN(Number(quantity)) ? Number(quantity) : 0,
                  variant: variant ?? undefined,
                },
              },
            });
          }}
          variant="contained"
        >
          Save inventory
        </Button>
        <Button
          style={{
            width: 'fit-content',
          }}
          color="error"
          disabled={Number.isNaN(Number(quantity))}
          onClick={() => {
            confirm('Are you sure you want to delete this inventory?', (confirmed) => {
              if (confirmed) {
                deleteInventory({
                  variables: {
                    inventoryId: inventoryItem.id,
                  },
                });
              }
            });
          }}
          variant="contained"
        >
          Delete inventory
        </Button>
      </Stack>
    </Stack>
  );
}
