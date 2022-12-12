import { context } from '~/src/shared';
import { InventoryItemStatus } from '~/src/types/graphql';
import { UserInventory, UserInventoryItem } from '~/src/types/webshop';
import { inventories, products } from '../cart/cartData';

export const ctx: context.UserContext = {
  user: {
    keycloak_id: 'test',
    student_id: 'oliver',
  },
  roles: undefined,
};

export const ctxPhilip: context.UserContext = {
  user: {
    keycloak_id: 'test2',
    student_id: 'philip',
  },
  roles: undefined,
};

export const emptyCtx: context.UserContext = { user: undefined, roles: undefined };

export const userInventories: UserInventory[] = [
  {
    id: '0f4ea74a-2edf-4ba6-9bbd-e000ad9314ab',
    created_at: new Date(),
    updated_at: new Date(),
    student_id: 'oliver',
  },
  {
    id: '37c5f3f4-a92b-456b-8e86-9bf405f536c9',
    created_at: new Date(),
    updated_at: new Date(),
    student_id: 'philip',
  },
];

export const userInventoryItems: UserInventoryItem[] = [
  // olivers items
  {
    id: 'cf2e106e-8936-4858-adcb-d8734890308f',
    name: products[0].name,
    description: products[0].description,
    paid_price: products[0].price,
    category_id: products[0].category_id,
    image_url: products[0].image_url,
    paid_at: new Date(),
    product_inventory_id: inventories[0].id,
    product_id: products[0].id,
    status: InventoryItemStatus.Paid,
    user_inventory_id: userInventories[0].id,
    student_id: userInventories[0].student_id,
  },
  {
    id: '8d5747b8-d2e1-40ca-9fb0-3f2014e92680',
    name: products[0].name,
    description: products[0].description,
    paid_price: products[0].price,
    category_id: products[0].category_id,
    image_url: products[0].image_url,
    paid_at: new Date(),
    product_inventory_id: inventories[0].id,
    product_id: products[0].id,
    status: InventoryItemStatus.Paid,
    user_inventory_id: userInventories[0].id,
    student_id: userInventories[0].student_id,
  },
  {
    id: 'd0b0b0b0-8936-4858-adcb-d8734890308f',
    name: products[1].name,
    description: products[1].description,
    paid_price: products[1].price,
    category_id: products[1].category_id,
    image_url: products[1].image_url,
    paid_at: new Date(),
    consumed_at: new Date(),
    product_inventory_id: inventories[1].id,
    product_id: products[1].id,
    status: InventoryItemStatus.Consumed,
    user_inventory_id: userInventories[0].id,
    student_id: userInventories[0].student_id,
  },

  // philips items
  {
    id: '4614c639-3520-4425-9e53-ffef43c6c6cf',
    name: products[0].name,
    description: products[0].description,
    paid_price: products[0].price,
    category_id: products[0].category_id,
    image_url: products[0].image_url,
    paid_at: new Date(),
    product_inventory_id: inventories[0].id,
    product_id: products[0].id,
    status: InventoryItemStatus.Paid,
    user_inventory_id: userInventories[1].id,
    student_id: userInventories[1].student_id,
  },
];
