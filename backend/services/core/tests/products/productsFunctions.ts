import { Product, ProductCategory, ProductInput } from '~/src/types/graphql';

export const hej = '';

export function expectedProduct(
  product: Product,
  productInput: ProductInput,
  category: ProductCategory,
): Product {
  return {
    id: product.id,
    name: productInput.name,
    description: productInput.description,
    price: productInput.price,
    maxPerUser: productInput.maxPerUser,
    imageUrl: productInput.imageUrl,
    // @ts-ignore
    inventory: productInput.variants.length ? productInput.variants.map((variant, idx) => ({
      id: product.inventory[idx]!.id,
      variant,
      quantity: productInput.quantity,
    })) : [{
      id: product.inventory[0]!.id,
      variant: null,
      quantity: productInput.quantity,
    }],
    category: {
      id: category.id,
      name: category.name,
      description: category.description,
    },
  };
}
