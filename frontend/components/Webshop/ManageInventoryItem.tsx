import {
  Button, Stack, TextField, Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import handleApolloError from '~/functions/handleApolloError';
import {
  ProductQuery,
  useDecrementQuantityMutation,
  useDeleteInventoryMutation,
  useIncrementQuantityMutation,
  useUpdateInventoryMutation,
} from '~/generated/graphql';
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
  const { quantity } = inventoryItem;
  const { t } = useTranslation();
  const { confirm, requestNumber } = useDialog();
  const { showMessage } = useSnackbar();
  const [updateInventory] = useUpdateInventoryMutation({
    onCompleted: () => {
      showMessage('Product inventory updated', 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'Error creating product');
    },
  });

  const [incrementQuantity] = useIncrementQuantityMutation({
    onCompleted: async () => {
      await refetch();
      showMessage('Product inventory updated', 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'Error creating product');
    },
  });

  const [decrementQuantity] = useDecrementQuantityMutation({
    onCompleted: async () => {
      await refetch();
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
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            requestNumber('How many do you want to remove?', 'Quantity', (value) => {
              decrementQuantity({
                variables: {
                  inventoryId: inventoryItem.id,
                  quantity: value,
                },
              });
            });
          }}
        >
          -
        </Button>
        <Typography>{quantity}</Typography>
        <Button
          variant="contained"
          onClick={() => {
            requestNumber('How many do you want to add?', 'Quantity', (value) => {
              incrementQuantity({
                variables: {
                  inventoryId: inventoryItem.id,
                  quantity: value,
                },
              });
            });
          }}
        >
          +
        </Button>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button
          style={{
            width: 'fit-content',
          }}
          onClick={() => {
            updateInventory({
              variables: {
                input: {
                  inventoryId: inventoryItem.id,
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
