import * as gql from '../../types/graphql';
import * as sql from '../../types/webshop';

type ProductProps = {
  product: sql.Product
  category?: gql.ProductCategory,
  // discount?: gql.Discount,
  inventory?: gql.ProductInventory[],
};

type CartItemProps = {
  product: sql.Product
  category?: gql.ProductCategory,
  // discount?: gql.Discount,
  inventory?: gql.CartInventory[],
};

// eslint-disable-next-line import/prefer-default-export
export const convertProduct = (
  {
    product,
    category,
    inventory = [],
  }: ProductProps,
): gql.Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  imageUrl: product.image_url,
  maxPerUser: product.max_per_user,
  category,
  inventory,
});

export const convertCartItem = (
  {
    product,
    category,
    inventory = [],
  }: CartItemProps,
): gql.CartItem => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  imageUrl: product.image_url,
  maxPerUser: product.max_per_user,
  category,
  inventory,
});

export const convertProductCategory = (category?: sql.ProductCategory)
: gql.Maybe<gql.ProductCategory> =>
  (category ? {
    id: category.id,
    name: category.name,
    description: category.description,
  } : undefined);

/* export const convertDiscount = (discount?: sql.ProductDiscount)
: gql.Maybe<gql.Discount> => (discount ? {
  id: discount.id,
  name: discount.name,
  description: discount.description,
  discountPercentage: discount.discount_percentage,
} : undefined); */

export const convertInventory = (
  inventory: sql.ProductInventory,
  // discount?: gql.Discount,
) : gql.ProductInventory => ({
  id: inventory.id,
  quantity: inventory.quantity,
  variant: inventory.variant,
  // discount,
});

export const convertCart = (cart: sql.Cart): gql.Cart => ({
  id: cart.id,
  expiresAt: cart.expires_at,
  totalPrice: cart.total_price,
  totalQuantity: cart.total_quantity,
  cartItems: [],
});

export const convertUserInventoryItem = (
  item: sql.UserInventoryItem,
): gql.UserInventoryItem => ({
  id: item.id,
  name: item.name,
  description: item.description,
  imageUrl: item.image_url,
  variant: item.variant,
  paidAt: item.paid_at,
  paidPrice: item.paid_price,
  consumedAt: item.consumed_at,
});
