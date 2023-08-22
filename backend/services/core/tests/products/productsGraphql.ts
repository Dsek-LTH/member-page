import { gql } from 'apollo-server';

export const CreateProductMutation = gql`
mutation CreateProductMutation($input: CreateProductInput!) {
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
      releaseDate
    }
  }
}
`;

export const UpdateProductMutation = gql`
mutation UpdateProductMutation($input: UpdateProductInput!) {
  webshop {
    updateProduct(input: $input) {
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
      releaseDate
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
    releaseDate
  }
}
`;

export const GetProductsQuery = gql`
query GetProductsQuery {
  products {
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
    releaseDate
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

export const CreateInventory = gql`
mutation CreateInventory($input: CreateInventoryInput!) {
  webshop {
    addInventory(input: $input) {
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

export const UpdateInventory = gql`
mutation UpdateInventory($input: UpdateInventoryInput!) {
  webshop {
    updateInventory(input: $input) {
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
