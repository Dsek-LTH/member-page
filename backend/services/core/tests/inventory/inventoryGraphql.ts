import { gql } from 'apollo-server';

export const GetInventoryItemsByStatus = gql`
query GetInventoryItemsByStatus(
  $status: InventoryItemStatus,
  $studentId: String,
  $productId: UUID,
  ) {
  inventoryItemsByStatus(
    status: $status
    studentId: $studentId
    productId: $productId
    ) {
    id
    name
    description
    paidPrice
    imageUrl
    variant
    paidAt
    consumedAt
    deliveredAt
    studentId
    status
  }
}
`;

export const DeliverItem = gql`
mutation DeliverItem($itemId: UUID!) {
  webshop {
    deliverItem(itemId: $itemId) {
      id
      name
      description
      paidPrice
      imageUrl
      variant
      paidAt
      consumedAt
      deliveredAt
      studentId
      status
    }
  }
}
`;
