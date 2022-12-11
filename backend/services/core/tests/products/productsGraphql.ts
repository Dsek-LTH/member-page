import { gql } from 'apollo-server';

export const CreateProductMutation = gql`
mutation CreateProductMutation($input: ProductInput!) {
  webshop {
    createProduct(input: $input) {
      id
      name
      description
      price
      maxPerUser
      imageUrl
      inventory {
        id
        variant
        quantity
      }
      category {
        id
        name
        description
      }
    }
  }
}
`;

export const GetProductQuery = gql`
query GetProductQuery($id: UUID!) {
  product(id: $id) {
    id
    name
    description
    price
    maxPerUser
    imageUrl
    inventory {
      id
      variant
      quantity
    }
    category {
      id
      name
      description
    }
  }
}
`;

export const GetProductsQuery = gql`
query GetProductsQuery($categoryId: UUID) {
  products(categoryId: $categoryId) {
    id
    name
    description
    price
    maxPerUser
    imageUrl
    inventory {
      id
      variant
      quantity
    }
    category {
      id
      name
      description
    }
  }
}
`;

export const GetProductCategories = gql`
query ProductCategories {
  productCategories {
    id
    name
    description
  }
}
`;
