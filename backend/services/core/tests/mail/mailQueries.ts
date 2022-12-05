import { gql } from 'apollo-server';

export const GetMailAlias = gql`
query GetMailAlias($email: String!) {
  alias(email: $email) {
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
`;

export const GetMailAliases = gql`
query GetMailAliases {
  aliases {
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
`;

export const ResolveRecipients = gql`
query ResolveRecipientsEmail {
  resolveRecipients {
    alias
    emailUsers {
      email
      studentId
    }
  }
}
`;
