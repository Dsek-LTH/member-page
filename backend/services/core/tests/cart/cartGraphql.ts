import { gql } from 'apollo-server';

export const GetMyCart = gql`
query MyCart {
  myCart {
    id
    cartItems {
      id
      name
      description
      price
      maxPerUser
      imageUrl
      inventory {
        id
        inventoryId
        variant
        quantity
      }
      category {
        id
        name
        description
      }
    }
    totalPrice
    totalQuantity
    expiresAt
  }
}
`;

export const AddToMyCart = gql`
mutation AddToMyCart($inventoryId: UUID!, $quantity: Int!) {
  webshop {
    addToMyCart(inventoryId: $inventoryId, quantity: $quantity) {
      id
      cartItems {
        id
        name
        description
        price
        maxPerUser
        imageUrl
        inventory {
          id
          inventoryId
          variant
          quantity
        }
        category {
          id
          name
          description
        }
      }
      totalPrice
      totalQuantity
      expiresAt
    }
  }
}
`;

export const RemoveFromMyCart = gql`
mutation RemoveFromMyCart($inventoryId: UUID!, $quantity: Int!) {
  webshop {
    removeFromMyCart(inventoryId: $inventoryId, quantity: $quantity) {
      id
      cartItems {
        id
        name
        description
        price
        maxPerUser
        imageUrl
        inventory {
          id
          inventoryId
          variant
          quantity
        }
        category {
          id
          name
          description
        }
      }
      totalPrice
      totalQuantity
      expiresAt
    }
  }
}
`;

export const RemoveMyCart = gql`
mutation RemoveMyCart {
  webshop {
    removeMyCart
  }
}
`;
