import { context } from '~/src/shared';
import { Cart, CartItem } from '~/src/types/webshop';
import { inventories } from '../cart/cartData';

export const phoneNumber = '0701234567';

export const ctx: context.UserContext = {
  user: {
    keycloak_id: 'test',
    student_id: 'oliver',
  },
  roles: undefined,
};

export const emptyCtx: context.UserContext = { user: undefined, roles: undefined };

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const cart: Cart = {
  id: '093f3f6e-8443-4584-9164-eb326cf9f027',
  student_id: 'oliver',
  created_at: new Date(),
  updated_at: new Date(),
  expires_at: tomorrow,
  total_price: 202,
  total_quantity: 2,
};

export const expiredCart: Cart = {
  id: '093f3f6e-8443-4584-9164-eb326cf9f027',
  student_id: 'oliver',
  created_at: new Date(),
  updated_at: new Date(),
  expires_at: new Date('2020-01-01'),
  total_price: 202,
  total_quantity: 2,
};

export const cartItems: CartItem[] = [
  {
    id: 'fc6ad374-e95f-4657-baa3-d1db5b9796a7',
    cart_id: '093f3f6e-8443-4584-9164-eb326cf9f027',
    created_at: new Date(),
    updated_at: new Date(),
    product_inventory_id: inventories[0].id,
    quantity: 2,
  },
  {
    id: 'e3bd1776-d2d4-4625-89dd-8c98ae66728b',
    cart_id: '093f3f6e-8443-4584-9164-eb326cf9f027',
    created_at: new Date(),
    updated_at: new Date(),
    product_inventory_id: inventories[1].id,
    quantity: 1,
  },
];
