import {
  Avatar,
  Button,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
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
              secondary={`${getVariantText(inventory.variant)}${inventory.quantity} st á ${cartItem.price} kr`}
            />
            <ListItemText
              sx={{ width: '40%' }}
              primary="Pris"
              secondary={`${inventory.quantity * cartItem.price} kr`}
            />
            <ListItemText>
              <Stack alignItems="center">
                <Button
                  variant="contained"
                  disabled={inventory.quantity >= cartItem.maxPerUser}
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
                <Typography variant="h4">
                  {inventory.quantity}
                </Typography>
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
              </Stack>
            </ListItemText>
          </ListItem>
          <Divider component="li" />
        </>
      ))}
      {cartItem.inventory.length === 0 && (
      <>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={cartItem.imageUrl} />
          </ListItemAvatar>
          <ListItemText
            sx={{ width: '40%' }}
            primary={cartItem.name}
            secondary={cartItem.description}
          />
          <ListItemText
            sx={{ width: '49%' }}
            primary="Pris"
            secondary={`${cartItem.price} kr`}
          />

        </ListItem>
        <Divider component="li" />
      </>
      )}
    </>
  );
}
