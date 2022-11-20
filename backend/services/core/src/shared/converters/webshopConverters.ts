import * as gql from '../../types/graphql';
import * as sql from '../../types/webshop';

type ProductProps = {
  product: sql.Product
  category?: gql.ProductCategory,
  discount?: gql.Discount,
};

// eslint-disable-next-line import/prefer-default-export
export const convertProduct = (
  {
    product,
    category,
    discount,
  }: ProductProps,
): gql.Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  imageUrl: product.image_url,
  category,
  discount,
});

export const convertProductCategory = (category?: sql.ProductCategory)
: gql.Maybe<gql.ProductCategory> =>
  (category ? {
    id: category.id,
    name: category.name,
  } : undefined);

export const convertDiscount = (discount?: sql.ProductDiscount)
: gql.Maybe<gql.Discount> => (discount ? {
  id: discount.id,
  name: discount.name,
  description: discount.description,
  discountPercentage: discount.discount_percentage,
} : undefined);

export const convertCart = (cart: sql.Cart): gql.Cart => ({
  id: cart.id,
  expiresAt: cart.expires_at,
  total: cart.total_price,
  products: [],
});
