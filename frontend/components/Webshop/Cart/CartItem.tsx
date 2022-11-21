import {
  Avatar, Divider, ListItem, ListItemAvatar, ListItemText,
} from '@mui/material';
import { MyCartQuery } from '~/generated/graphql';

const getVariantText = (variant: string) => (variant === 'default' ? '' : `${variant} : `);

export default function CartItem({ cartItem }: { cartItem: MyCartQuery['myCart']['cartItems'][number] }) {
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
          </ListItem>
          <Divider component="li" />
        </>
      ))}
    </>
  );
}
