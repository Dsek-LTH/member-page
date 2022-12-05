import { gql } from 'apollo-server';

export const CreateMailAlias = gql`
mutation CreateMailAlias($email: String!, $position_id: String!) {
  alias {
    create(input: { email: $email, position_id: $position_id }) {
      email
      policies {
        position {
          id
          name
        }
      }
    }
  }
}
`;

export const RemoveMailAlias = gql`
mutation RemoveMailAlias($id: UUID!) {
  alias {
    remove(id: $id) {
      email
      policies {
        id
        position {
          id
          name
        }
      }
    }
  }
}
`;
