import * as gql from '../../types/graphql';
import * as sql from '../../types/webshop';

type ProductProps = {
  product: sql.Product
  category?: gql.ProductCategory,
  discount?: gql.Discount,
  inventory?: gql.Inventory[],
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

export const convertProductCategory = (category?: sql.ProductCategory)
: gql.Maybe<gql.ProductCategory> =>
  (category ? {
    id: category.id,
    name: category.name,
    description: category.description,
  } : undefined);

export const convertDiscount = (discount?: sql.ProductDiscount)
: gql.Maybe<gql.Discount> => (discount ? {
  id: discount.id,
  name: discount.name,
  description: discount.description,
  discountPercentage: discount.discount_percentage,
} : undefined);

export const convertInventory = (
  inventory: sql.ProductInventory,
  discount?: gql.Discount,
) : gql.Inventory => ({
  id: inventory.id,
  quantity: inventory.quantity,
  variant: inventory.variant,
  discount,
});

export const convertCart = (cart: sql.Cart): gql.Cart => ({
  id: cart.id,
  expiresAt: cart.expires_at,
  total: cart.total_price,
  products: [],
});
