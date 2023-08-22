import { CreateProductInput } from '~/src/types/graphql';
import { ProductCategory } from '~/src/types/webshop';

export const categories: ProductCategory[] = [{
  id: '50214b17-87f9-433d-999a-3e671857a15a',
  created_at: new Date(),
  updated_at: new Date(),
  name: 'Merch',
  description: 'Detta är merch',
}, {
  id: '44a9e42e-70d8-4c81-bc2b-b036e5e31006',
  created_at: new Date(),
  updated_at: new Date(),
  name: 'Café',
  description: 'Detta tillhör caféet',
}];

export const coffeeInput: CreateProductInput = {
  categoryId: categories[1].id,
  name: 'Kaffe',
  description: 'Detta är kaffe',
  imageUrl: 'https://bild.se/kaffe.jpg',
  price: 55,
  maxPerUser: 100,
  releaseDate: new Date('2023-03-15'),
};

export const tShirtInput: CreateProductInput = {
  categoryId: categories[0].id,
  name: 'T-shirt',
  description: 'Detta är en t-shirt',
  imageUrl: 'https://bild.se/t-shirt.jpg',
  price: 55,
  maxPerUser: 100,
  releaseDate: new Date('2023-03-15'),
};
