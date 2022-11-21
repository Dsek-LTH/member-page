import {
  List, ListItem, ListItemText, Paper,
} from '@mui/material';
import { useMyCartQuery } from '~/generated/graphql';
import CartItem from './CartItem';

export default function CartItems() {
  const { data } = useMyCartQuery();
  const cartItems = data?.myCart?.cartItems || [];
  return (
    <Paper>
      <List>
        {cartItems.map((cartItem) => (
          <CartItem cartItem={cartItem} key={cartItem.id} />
        ))}
        <ListItem alignItems="flex-start">
          <ListItemText
            sx={{ width: '40%' }}
            primary="Totalt antal saker"
            secondary={`${data?.myCart?.totalQuantity} st`}
          />
          <ListItemText
            sx={{ width: '44%' }}
            primary="Totalt pris"
            secondary={`${data?.myCart?.totalPrice} kr`}
          />
        </ListItem>
      </List>
    </Paper>
  );
}
