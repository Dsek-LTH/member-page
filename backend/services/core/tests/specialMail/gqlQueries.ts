import { gql } from 'apollo-server';

export const SpecialSendersQuery = gql`
  query SpecialSenders($alias: String!) {
    specialSenders(alias: $alias) {
      id
      studentId
      keycloakId
    }
  }
`;

export const CreateSpecialSenderMutation = gql`
  mutation CreateSpecialSender($input: CreateSpecialSender!) {
    specialSender {
      create(input: $input) {
        id
        studentId
        keycloakId
      }
    }
  }
`;

export const RemoveSpecialSenderMutation = gql`
  mutation RemoveSpecialSender($id: UUID!) {
    specialSender {
      remove(id: $id) {
        id
      }
    }
  }
`;

export const SpecialReceiversQuery = gql`
  query SpecialReceivers($alias: String!) {
    specialReceivers(alias: $alias) {
      id
      targetEmail
    }
  }
`;

export const CreateSpecialReceiverMutation = gql`
  mutation CreateSpecialReceiver($input: CreateSpecialReceiver!) {
    specialReceiver {
      create(input: $input) {
        id
        targetEmail
      }
    }
  }
`;

export const RemoveSpecialReceiverMutation = gql`
  mutation RemoveSpecialReceiver($id: UUID!) {
    specialReceiver {
      remove(id: $id) {
        id
      }
    }
  }
`;
