import { Product, ProductCategory, CreateProductInput } from '~/src/types/graphql';

export const hej = '';

export function expectedProduct(
  product: Product,
  productInput: CreateProductInput,
  category: ProductCategory,
): Product {
  return {
    id: product.id,
    name: productInput.name,
    description: productInput.description,
    price: productInput.price,
    maxPerUser: productInput.maxPerUser,
    imageUrl: productInput.imageUrl,
    inventory: [],
    category: {
      id: category.id,
      name: category.name,
      description: category.description,
    },
    releaseDate: new Date(),
  };
}
