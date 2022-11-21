import {
  Avatar,
  Button,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
} from '@mui/material';
import {
  MyCartQuery,
  useAddToMyCartMutation,
  useRemoveFromMyCartMutation,
  useMyCartQuery,
} from '~/generated/graphql';

const getVariantText = (variant: string) => (variant === 'default' ? '' : `${variant} : `);

export default function CartItem({ cartItem }: { cartItem: MyCartQuery['myCart']['cartItems'][number] }) {
  const [addToMyCart] = useAddToMyCartMutation();
  const [removeFromMyCart] = useRemoveFromMyCartMutation();
  const { refetch: refetchCart } = useMyCartQuery();
  return (
    <>
      {cartItem.inventory.map((inventory) => (
        <>
          <ListItem key={inventory.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={cartItem.imageUrl} />
            </ListItemAvatar>
            <ListItemText
              sx={{ width: '40%' }}
              primary={cartItem.name}
              secondary={`${getVariantText(inventory.variant)}${inventory.quantity} st`}
            />
            <ListItemText
              sx={{ width: '40%' }}
              primary="Pris"
              secondary={`${inventory.quantity * cartItem.price} kr`}
            />
            <ListItemText>
              <Stack>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeFromMyCart({
                      variables: {
                        inventoryId: inventory.inventoryId,
                        quantity: 1,
                      },
                    }).then(() => refetchCart());
                  }}
                >
                  -
                </Button>
                {inventory.quantity}
                <Button
                  variant="contained"
                  onClick={() => {
                    addToMyCart({
                      variables: {
                        inventoryId: inventory.inventoryId,
                        quantity: 1,
                      },
                    }).then(() => refetchCart());
                  }}
                >
                  +
                </Button>
              </Stack>
            </ListItemText>
          </ListItem>
          <Divider component="li" />
        </>
      ))}
    </>
  );
}
