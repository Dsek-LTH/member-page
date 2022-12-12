import { gql } from 'apollo-server';

export const InitiatePaymentQuery = gql`
mutation InitiatePayment($phoneNumber: String!) {
  webshop {
    initiatePayment(phoneNumber: $phoneNumber) {
      id
      amount
      currency
      paymentStatus
      paymentMethod
      createdAt
      updatedAt
    }
  }
}
`;

export const UpdatePaymentStatusMutation = gql`
mutation UpdatePaymentStatus($paymentId: String!, $status: PaymentStatus!) {
  webshop {
    updatePaymentStatus(paymentId: $paymentId, status: $status) {
      id
      amount
      currency
      paymentStatus
      paymentMethod
      createdAt
      updatedAt
    }
  }
}
`;

export const GetPaymentQuery = gql`
query GetPayment($id: UUID!) {
  payment(id: $id) {
    id
    amount
    currency
    paymentStatus
    paymentMethod
    createdAt
    updatedAt
  }
}
`;

export const MyChestQuery = gql`
query MyChest($studentId: String!) {
  chest(studentId: $studentId) {
    id
    items {
      id
      name
      description
      paidPrice
      imageUrl
      variant
      paidAt
      consumedAt
      studentId
      status
    }
  }
}
`;

export const ConsumeItemMutation = gql`
mutation ConsumeItem($itemId: UUID!) {
  webshop {
    consumeItem(itemId: $itemId) {
      id
      items {
        id
        name
        description
        paidPrice
        imageUrl
        variant
        paidAt
        consumedAt
        studentId
        status
      }
    }
  }
}
`;
